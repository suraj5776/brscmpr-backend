const { getPool } = require('../config/db');

// ====================================================
// MONTHLY PROGRESS REPORT (MPR) CONTROLLER
// ====================================================

/**
 * Helper: Save sub-section records (Emerging Tech, Events, Products, Awards)
 */
async function saveReportSubSections(connection, reportId, data) {
  const { emerging_tech, major_events, national_product_inputs, major_awards } = data;

  // 1. Emerging Tech
  if (Array.isArray(emerging_tech)) {
    for (const item of emerging_tech) {
      if (item.tech_type || item.description) {
        await connection.query(
          'INSERT INTO mpr_emerging_tech (report_id, tech_type, project_name, description, link_url) VALUES (?, ?, ?, ?, ?)',
          [reportId, item.tech_type || '', item.project_name || '', item.description || '', item.link_url || '']
        );
      }
    }
  }

  // 2. Major Events
  if (Array.isArray(major_events)) {
    for (const item of major_events) {
      if (item.event_name || item.description) {
        const eventDate = item.date_of_event && item.date_of_event.trim() ? item.date_of_event.trim() : null;
        await connection.query(
          'INSERT INTO mpr_major_events (report_id, event_name, project, description, date_of_event) VALUES (?, ?, ?, ?, ?)',
          [reportId, item.event_name || 'Inauguration', item.project || '', item.description || '', eventDate]
        );
      }
    }
  }

  // 3. National Product Inputs
  if (Array.isArray(national_product_inputs)) {
    for (const item of national_product_inputs) {
      if (item.product_id && item.parameter_id) {
        await connection.query(
          'INSERT INTO mpr_national_product_inputs (report_id, product_id, parameter_id, previous_month, reporting_month, cumulative_since_inception) VALUES (?, ?, ?, ?, ?, ?)',
          [reportId, item.product_id, item.parameter_id, item.previous_month || '', item.reporting_month || '', item.cumulative_since_inception || '']
        );
      }
    }
  }

  // 4. Major Awards
  if (Array.isArray(major_awards)) {
    for (const item of major_awards) {
      if (item.award_level || item.award_title || item.details_of_award) {
        const awardDate = item.award_date && item.award_date.trim() ? item.award_date.trim() : null;
        await connection.query(
          'INSERT INTO mpr_major_awards (report_id, award_level, award_title, award_date, details_of_award) VALUES (?, ?, ?, ?, ?)',
          [reportId, item.award_level || 'National', item.award_title || '', awardDate, item.details_of_award || '']
        );
      }
    }
  }
}

/**
 * GET /api/mpr - Fetch all monthly progress reports (Batch Optimized with JOIN)
 */
exports.getAllReports = async (req, res) => {
  try {
    const pool = getPool();
    const [reports] = await pool.query(`
      SELECT r.*, p.prism_id, p.department, p.default_url AS url, p.project_description
      FROM mpr_reports r
      LEFT JOIN prism_projects p ON r.prism_project_id = p.id
      ORDER BY r.id DESC
    `);

    if (reports.length === 0) {
      return res.json([]);
    }

    const reportIds = reports.map(report => report.id);

    // Batch query all sub-sections
    const [techs] = await pool.query('SELECT * FROM mpr_emerging_tech WHERE report_id IN (?)', [reportIds]);
    const [events] = await pool.query("SELECT id, report_id, event_name, project, description, DATE_FORMAT(date_of_event, '%Y-%m-%d') AS date_of_event FROM mpr_major_events WHERE report_id IN (?)", [reportIds]);
    const [awards] = await pool.query("SELECT id, report_id, award_level, award_title, DATE_FORMAT(award_date, '%Y-%m-%d') AS award_date, details_of_award FROM mpr_major_awards WHERE report_id IN (?)", [reportIds]);
    const [products] = await pool.query(`
      SELECT np.report_id, np.product_id, np.parameter_id, np.previous_month, np.reporting_month, np.cumulative_since_inception,
             p.product_name, param.parameter_name
      FROM mpr_national_product_inputs np
      JOIN national_products p ON np.product_id = p.id
      JOIN national_product_parameters param ON np.parameter_id = param.id
      WHERE np.report_id IN (?)
    `, [reportIds]);

    const detailedReports = reports.map(report => {
      const majorEnhancements = (report.project_name || report.enhancement_done) ? [{
        prism_project_id: report.prism_project_id,
        prism_id: report.prism_id || '',
        project_name: report.project_name || '',
        department: report.department || '',
        url: report.url || '',
        enhancement_done: report.enhancement_done || '',
        project_description: report.project_description || ''
      }] : [];

      return {
        ...report,
        major_enhancements: majorEnhancements,
        emerging_tech: techs.filter(t => t.report_id === report.id),
        major_events: events.filter(ev => ev.report_id === report.id),
        major_awards: awards.filter(aw => aw.report_id === report.id),
        national_product_inputs: products.filter(p => p.report_id === report.id)
      };
    });

    return res.json(detailedReports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch monthly reports' });
  }
};

/**
 * GET /api/mpr/:id - Fetch single report details by ID
 */
exports.getReportById = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = getPool();
    const [reports] = await pool.query(`
      SELECT r.*, p.prism_id, p.department, p.default_url AS url, p.project_description
      FROM mpr_reports r
      LEFT JOIN prism_projects p ON r.prism_project_id = p.id
      WHERE r.id = ?
    `, [id]);

    if (reports.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const report = reports[0];
    const [techs] = await pool.query('SELECT * FROM mpr_emerging_tech WHERE report_id = ?', [report.id]);
    const [events] = await pool.query("SELECT id, report_id, event_name, project, description, DATE_FORMAT(date_of_event, '%Y-%m-%d') AS date_of_event FROM mpr_major_events WHERE report_id = ?", [report.id]);
    const [awards] = await pool.query("SELECT id, report_id, award_level, award_title, DATE_FORMAT(award_date, '%Y-%m-%d') AS award_date, details_of_award FROM mpr_major_awards WHERE report_id = ?", [report.id]);
    const [products] = await pool.query(`
      SELECT np.product_id, np.parameter_id, np.previous_month, np.reporting_month, np.cumulative_since_inception,
             p.product_name, param.parameter_name
      FROM mpr_national_product_inputs np
      JOIN national_products p ON np.product_id = p.id
      JOIN national_product_parameters param ON np.parameter_id = param.id
      WHERE np.report_id = ?
    `, [report.id]);

    const majorEnhancements = (report.project_name || report.enhancement_done) ? [{
      prism_project_id: report.prism_project_id,
      prism_id: report.prism_id || '',
      project_name: report.project_name || '',
      department: report.department || '',
      url: report.url || '',
      enhancement_done: report.enhancement_done || '',
      project_description: report.project_description || ''
    }] : [];

    return res.json({
      ...report,
      major_enhancements: majorEnhancements,
      emerging_tech: techs,
      major_events: events,
      major_awards: awards,
      national_product_inputs: products
    });
  } catch (error) {
    console.error('Error fetching report detail:', error);
    res.status(500).json({ error: 'Failed to fetch report detail' });
  }
};

/**
 * POST /api/mpr - Submit new monthly progress report
 */
exports.createReport = async (req, res) => {
  const {
    report_month,
    report_year,
    month_year,
    major_enhancements,
    prism_project_id,
    project_name,
    enhancement_done,
    other_significant
  } = req.body;

  const month = report_month || (month_year ? month_year.split(' ')[0] : 'March');
  const year = report_year || (month_year ? parseInt(month_year.split(' ')[1]) : 2026);
  const formattedMonthYear = month_year || `${month} ${year}`;

  const enhancementObj = (Array.isArray(major_enhancements) && major_enhancements.length > 0) ? major_enhancements[0] : {};
  let finalPrismId = prism_project_id || enhancementObj.prism_project_id || null;
  const customPrismCode = enhancementObj.prism_id || req.body.prism_id || 'NA';
  const finalProjectName = project_name || enhancementObj.project_name || '';
  const finalDepartment = enhancementObj.department || req.body.department || '';
  const finalUrl = enhancementObj.url || req.body.url || '';
  const finalEnhancementDone = enhancement_done || enhancementObj.enhancement_done || '';
  const finalProjectDescription = enhancementObj.project_description || req.body.project_description || '';

  try {
    const pool = getPool();
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Synchronize PRISM project details with master table
      if (finalPrismId) {
        await connection.query(
          'UPDATE prism_projects SET prism_id = ?, project_name = ?, department = ?, default_url = ?, project_description = ? WHERE id = ?',
          [customPrismCode.trim() || 'NA', finalProjectName.trim(), finalDepartment, finalUrl, finalProjectDescription, finalPrismId]
        );
      } else if (finalProjectName.trim()) {
        const [newProjRes] = await connection.query(
          'INSERT INTO prism_projects (prism_id, project_name, department, default_url, project_description) VALUES (?, ?, ?, ?, ?)',
          [customPrismCode.trim() || 'NA', finalProjectName.trim(), finalDepartment, finalUrl, finalProjectDescription]
        );
        finalPrismId = newProjRes.insertId;
      }

      // Save Report Header
      const [reportResult] = await connection.query(
        `INSERT INTO mpr_reports 
         (report_month, report_year, month_year, prism_project_id, project_name, enhancement_done, other_significant) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [month, year, formattedMonthYear, finalPrismId, finalProjectName, finalEnhancementDone, other_significant || '']
      );
      const reportId = reportResult.insertId;

      // Save all detail sub-sections
      await saveReportSubSections(connection, reportId, req.body);

      await connection.commit();
      connection.release();
      return res.status(201).json({ message: 'Report submitted successfully', id: reportId });
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ error: 'Failed to submit report' });
  }
};

/**
 * PUT /api/mpr/:id - Update existing monthly progress report
 */
exports.updateReport = async (req, res) => {
  const { id } = req.params;
  const {
    report_month,
    report_year,
    month_year,
    major_enhancements,
    prism_project_id,
    project_name,
    enhancement_done,
    other_significant
  } = req.body;

  const month = report_month || (month_year ? month_year.split(' ')[0] : 'March');
  const year = report_year || (month_year ? parseInt(month_year.split(' ')[1]) : 2026);
  const formattedMonthYear = month_year || `${month} ${year}`;

  const enhancementObj = (Array.isArray(major_enhancements) && major_enhancements.length > 0) ? major_enhancements[0] : {};
  let finalPrismId = prism_project_id || enhancementObj.prism_project_id || null;
  const customPrismCode = enhancementObj.prism_id || req.body.prism_id || 'NA';
  const finalProjectName = project_name || enhancementObj.project_name || '';
  const finalDepartment = enhancementObj.department || req.body.department || '';
  const finalUrl = enhancementObj.url || req.body.url || '';
  const finalEnhancementDone = enhancement_done || enhancementObj.enhancement_done || '';
  const finalProjectDescription = enhancementObj.project_description || req.body.project_description || '';

  try {
    const pool = getPool();
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Synchronize PRISM project details with master table
      if (finalPrismId) {
        await connection.query(
          'UPDATE prism_projects SET prism_id = ?, project_name = ?, department = ?, default_url = ?, project_description = ? WHERE id = ?',
          [customPrismCode.trim() || 'NA', finalProjectName.trim(), finalDepartment, finalUrl, finalProjectDescription, finalPrismId]
        );
      } else if (finalProjectName.trim()) {
        const [newProjRes] = await connection.query(
          'INSERT INTO prism_projects (prism_id, project_name, department, default_url, project_description) VALUES (?, ?, ?, ?, ?)',
          [customPrismCode.trim() || 'NA', finalProjectName.trim(), finalDepartment, finalUrl, finalProjectDescription]
        );
        finalPrismId = newProjRes.insertId;
      }

      // Update Report Header
      await connection.query(
        `UPDATE mpr_reports 
         SET report_month = ?, report_year = ?, month_year = ?, prism_project_id = ?, project_name = ?, enhancement_done = ?, other_significant = ? 
         WHERE id = ?`,
        [month, year, formattedMonthYear, finalPrismId, finalProjectName, finalEnhancementDone, other_significant || '', id]
      );

      // Clear old sub-sections for full update
      await connection.query('DELETE FROM mpr_emerging_tech WHERE report_id = ?', [id]);
      await connection.query('DELETE FROM mpr_major_events WHERE report_id = ?', [id]);
      await connection.query('DELETE FROM mpr_national_product_inputs WHERE report_id = ?', [id]);
      await connection.query('DELETE FROM mpr_major_awards WHERE report_id = ?', [id]);

      // Re-insert updated sub-sections
      await saveReportSubSections(connection, id, req.body);

      await connection.commit();
      connection.release();
      return res.json({ message: 'Report updated successfully' });
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ error: 'Failed to update report' });
  }
};

/**
 * DELETE /api/mpr/:id - Delete monthly progress report
 */
exports.deleteReport = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = getPool();
    await pool.query('DELETE FROM mpr_reports WHERE id = ?', [id]);
    return res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ error: 'Failed to delete report' });
  }
};
