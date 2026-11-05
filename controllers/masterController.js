const { getPool } = require('../config/db');

// ====================================================
// 1. PRISM PROJECTS MASTER CONTROLLER
// ====================================================

// GET /api/masters/prism-projects - Fetch all PRISM projects
exports.getPrismProjects = async (req, res) => {
  try {
    const pool = getPool();
    const [projects] = await pool.query('SELECT * FROM prism_projects ORDER BY id ASC');
    return res.json(projects);
  } catch (error) {
    console.error('Error fetching PRISM projects:', error);
    res.status(500).json({ error: 'Failed to fetch PRISM projects' });
  }
};

// POST /api/masters/prism-projects - Create new PRISM project
exports.createPrismProject = async (req, res) => {
  const { prism_id, project_name, department, default_url, project_description } = req.body;
  if (!project_name) {
    return res.status(400).json({ error: 'Project Name is required' });
  }

  try {
    const pool = getPool();
    const [result] = await pool.query(
      'INSERT INTO prism_projects (prism_id, project_name, department, default_url, project_description) VALUES (?, ?, ?, ?, ?)',
      [prism_id || 'NA', project_name, department || '', default_url || '', project_description || '']
    );
    return res.status(201).json({ message: 'PRISM Project created successfully', id: result.insertId });
  } catch (error) {
    console.error('Error creating PRISM project:', error);
    res.status(500).json({ error: 'Failed to create PRISM project' });
  }
};

// PUT /api/masters/prism-projects/:id - Update existing PRISM project
exports.updatePrismProject = async (req, res) => {
  const { id } = req.params;
  const { prism_id, project_name, department, default_url, project_description } = req.body;

  try {
    const pool = getPool();
    await pool.query(
      'UPDATE prism_projects SET prism_id = ?, project_name = ?, department = ?, default_url = ?, project_description = ? WHERE id = ?',
      [prism_id || 'NA', project_name, department, default_url, project_description || '', id]
    );
    return res.json({ message: 'PRISM Project updated successfully' });
  } catch (error) {
    console.error('Error updating PRISM project:', error);
    res.status(500).json({ error: 'Failed to update PRISM project' });
  }
};

// DELETE /api/masters/prism-projects/:id - Delete PRISM project
exports.deletePrismProject = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = getPool();
    await pool.query('DELETE FROM prism_projects WHERE id = ?', [id]);
    return res.json({ message: 'PRISM Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting PRISM project:', error);
    res.status(500).json({ error: 'Failed to delete PRISM project' });
  }
};


// ====================================================
// 2. EMERGING TECHNOLOGY TYPES MASTER CONTROLLER
// ====================================================

// GET /api/masters/emerging-tech - Fetch all emerging technology categories
exports.getEmergingTechTypes = async (req, res) => {
  try {
    const pool = getPool();
    const [categories] = await pool.query('SELECT * FROM emerging_tech_types ORDER BY id ASC');
    return res.json(categories);
  } catch (error) {
    console.error('Error fetching Emerging Tech categories:', error);
    res.status(500).json({ error: 'Failed to fetch Emerging Tech categories' });
  }
};

// POST /api/masters/emerging-tech - Create emerging tech category
exports.createEmergingTechType = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Category Name is required' });
  }

  try {
    const pool = getPool();
    const [result] = await pool.query('INSERT INTO emerging_tech_types (name) VALUES (?)', [name]);
    return res.status(201).json({ message: 'Emerging Tech Category created successfully', id: result.insertId });
  } catch (error) {
    console.error('Error creating Emerging Tech category:', error);
    res.status(500).json({ error: 'Failed to create Emerging Tech Category' });
  }
};

// PUT /api/masters/emerging-tech/:id - Update emerging tech category
exports.updateEmergingTechType = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Category Name is required' });
  }

  try {
    const pool = getPool();
    await pool.query('UPDATE emerging_tech_types SET name = ? WHERE id = ?', [name, id]);
    return res.json({ message: 'Emerging Tech Category updated successfully' });
  } catch (error) {
    console.error('Error updating Emerging Tech category:', error);
    res.status(500).json({ error: 'Failed to update Emerging Tech Category' });
  }
};

// DELETE /api/masters/emerging-tech/:id - Delete emerging tech category
exports.deleteEmergingTechType = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = getPool();
    await pool.query('DELETE FROM emerging_tech_types WHERE id = ?', [id]);
    return res.json({ message: 'Emerging Tech Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting Emerging Tech category:', error);
    res.status(500).json({ error: 'Failed to delete Emerging Tech Category' });
  }
};


// ====================================================
// 3. NATIONAL PRODUCTS & PARAMETERS MASTER CONTROLLER
// ====================================================

// GET /api/masters/national-products - Fetch products with mapped parameters
exports.getNationalProducts = async (req, res) => {
  try {
    const pool = getPool();
    const [products] = await pool.query('SELECT * FROM national_products ORDER BY id ASC');
    const [parameters] = await pool.query('SELECT * FROM national_product_parameters ORDER BY id ASC');

    const result = products.map(product => ({
      ...product,
      parameters: parameters.filter(param => param.product_id === product.id)
    }));

    return res.json(result);
  } catch (error) {
    console.error('Error fetching National Products:', error);
    res.status(500).json({ error: 'Failed to fetch National Products' });
  }
};

// POST /api/masters/national-products - Create national product and parameters
exports.createNationalProduct = async (req, res) => {
  const { product_name, parameters } = req.body;
  if (!product_name) {
    return res.status(400).json({ error: 'Product Name is required' });
  }

  try {
    const pool = getPool();
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [productResult] = await connection.query('INSERT INTO national_products (product_name) VALUES (?)', [product_name]);
      const productId = productResult.insertId;

      if (Array.isArray(parameters)) {
        for (const paramName of parameters) {
          if (paramName && paramName.trim()) {
            await connection.query(
              'INSERT INTO national_product_parameters (product_id, parameter_name) VALUES (?, ?)',
              [productId, paramName.trim()]
            );
          }
        }
      }

      await connection.commit();
      connection.release();
      return res.status(201).json({ message: 'National Product created successfully', id: productId });
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (error) {
    console.error('Error creating National Product:', error);
    res.status(500).json({ error: 'Failed to create National Product' });
  }
};

// PUT /api/masters/national-products/:id - Update product and parameter mappings
exports.updateNationalProduct = async (req, res) => {
  const { id } = req.params;
  const { product_name, parameters } = req.body;
  if (!product_name) {
    return res.status(400).json({ error: 'Product Name is required' });
  }

  try {
    const pool = getPool();
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      await connection.query('UPDATE national_products SET product_name = ? WHERE id = ?', [product_name, id]);
      await connection.query('DELETE FROM national_product_parameters WHERE product_id = ?', [id]);

      if (Array.isArray(parameters)) {
        for (const paramName of parameters) {
          if (paramName && paramName.trim()) {
            await connection.query(
              'INSERT INTO national_product_parameters (product_id, parameter_name) VALUES (?, ?)',
              [id, paramName.trim()]
            );
          }
        }
      }

      await connection.commit();
      connection.release();
      return res.json({ message: 'National Product updated successfully' });
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (error) {
    console.error('Error updating National Product:', error);
    res.status(500).json({ error: 'Failed to update National Product' });
  }
};

// DELETE /api/masters/national-products/:id - Delete product and parameters
exports.deleteNationalProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = getPool();
    await pool.query('DELETE FROM national_products WHERE id = ?', [id]);
    return res.json({ message: 'National Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting National Product:', error);
    res.status(500).json({ error: 'Failed to delete National Product' });
  }
};
