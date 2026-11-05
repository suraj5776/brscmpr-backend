# BRSC SIO Online Inputs Monthly Progress Report (MPR) Application

Development of a full-stack web application for SIO Online Monthly Progress Inputs (BRSC MPR) using **Angular** frontend, **Node.js/Express.js** backend, and **MySQL** database.

## User Review Required

> [!IMPORTANT]
> **Database Credentials & Environment**: The backend will default to MySQL connection on `localhost:3306`, user `root`, database `brsc_mpr`. Environment variables can be overridden in `brscmpr-backend/.env`.
> 
> **Master Data Pre-population**: We will extract master PRISM projects, Emerging Tech types, and National Products with their default parameters directly from `SIO Online Inputs BRSC (2).xlsx` to populate the MySQL seed file.

## Open Questions

None at present. We have extracted all required fields and dropdown structures from your request and the provided Excel file.

## Proposed Changes

---

### File & Folder Cleanup

- Clean up unnecessary Angular default placeholder code (`app.html` boilerplate content) and prepare standard modular architecture.

---

### Database Schema & Master Seed Data (`brscmpr-backend/database/`)

#### [NEW] [schema.sql](file:///c:/Users/suraj/Downloads/BRSC-MPR/brscmpr-backend/database/schema.sql)
Tables:
- `prism_projects` (id, prism_id, name, department, default_url)
- `emerging_tech_types` (id, name)
- `national_products` (id, name)
- `national_product_parameters` (id, product_id, parameter_name)
- `mpr_reports` (id, month_year, status, created_at, updated_at)
- `mpr_major_enhancements` (id, report_id, prism_project_id, project_name, department, url, enhancement_done)
- `mpr_emerging_tech` (id, report_id, tech_type_id, tech_type_name, description, link_url)
- `mpr_major_events` (id, report_id, event_name, project, description)
- `mpr_national_product_inputs` (id, report_id, product_id, parameter_id, previous_month, reporting_month, cumulative_since_inception)

#### [NEW] [seed.sql](file:///c:/Users/suraj/Downloads/BRSC-MPR/brscmpr-backend/database/seed.sql)
- Seed PRISM projects (OFMAS, eSahkari, CCMS, e-Labharthi, Jal Jeevan Hariyali, Patna High Court CIS, etc.)
- Seed Emerging Tech types (AI, AR/VR, Blockchain, IoT, Drone, etc.)
- Seed National Products & Parameters (ICJS, IVFRT, e-Prisons, e-Transport, eCourts, NKN, e-Office, etc.)

---

### Backend API (`brscmpr-backend/`)

#### [MODIFY] [package.json](file:///c:/Users/suraj/Downloads/BRSC-MPR/brscmpr-backend/package.json)
- Add dependencies: `mysql2`, `cors`, `dotenv`, `express`, `nodemon`.

#### [NEW] [config/db.js](file:///c:/Users/suraj/Downloads/BRSC-MPR/brscmpr-backend/config/db.js)
- MySQL pool setup with error handling and optional auto-table creation / seed fallback.

#### [NEW] [controllers/masterController.js](file:///c:/Users/suraj/Downloads/BRSC-MPR/brscmpr-backend/controllers/masterController.js)
- APIs for fetching PRISM projects, Emerging Tech options, National Products, and parameters mapped per product.

#### [NEW] [controllers/mprController.js](file:///c:/Users/suraj/Downloads/BRSC-MPR/brscmpr-backend/controllers/mprController.js)
- Full CRUD controller for MPR submissions (Create, Read all/by ID, Update, Delete).

#### [NEW] [routes/api.js](file:///c:/Users/suraj/Downloads/BRSC-MPR/brscmpr-backend/routes/api.js)
- Define Master Data and MPR CRUD API routes.

#### [NEW] [server.js](file:///c:/Users/suraj/Downloads/BRSC-MPR/brscmpr-backend/server.js)
- Main Express application entry point.

---

### Frontend Application (`brscmpr-frontend/`)

#### [MODIFY] [src/styles.css](file:///c:/Users/suraj/Downloads/BRSC-MPR/brscmpr-frontend/src/styles.css)
- Implement CSS design tokens, custom form styling, responsive layouts, glassmorphism cards, badges, word counters, and modern UI aesthetic.

#### [NEW] [src/app/services/mpr.service.ts](file:///c:/Users/suraj/Downloads/BRSC-MPR/brscmpr-frontend/src/app/services/mpr.service.ts)
- Angular HTTP service for consuming backend APIs.

#### [NEW] [src/app/components/mpr-form/](file:///c:/Users/suraj/Downloads/BRSC-MPR/brscmpr-frontend/src/app/components/mpr-form/)
- Form containing the 4 required sections:
  1. Major Enhancements in PRISM projects (Month/Year, PRISM Project dropdown, auto-filled Project Name & Dept, URL, 200-word limited textarea).
  2. Use of Emerging Technologies (Dropdown: AI, AR/VR, Blockchain, IoT, Drone; Description; Link URL).
  3. Major Events in State/Division (Event Name, Project, Description).
  4. National Products Implemented (Product dropdown, dynamic Parameter rows with Previous Month, Reporting Month, Cumulative inputs).

#### [NEW] [src/app/components/mpr-list/](file:///c:/Users/suraj/Downloads/BRSC-MPR/brscmpr-frontend/src/app/components/mpr-list/)
- View & Manage MPR records table with filtering, viewing details modal, editing, and deleting capabilities.

#### [MODIFY] [src/app/app.ts](file:///c:/Users/suraj/Downloads/BRSC-MPR/brscmpr-frontend/src/app/app.ts) & [src/app/app.html](file:///c:/Users/suraj/Downloads/BRSC-MPR/brscmpr-frontend/src/app/app.html)
- Main layout with tabbed navigation (New Report Form vs Report History / Management).

---

## Verification Plan

### Automated Verification
- Verify backend API routes using `curl` / HTTP requests.
- Verify Angular build with `npm run build` in `brscmpr-frontend`.

### Manual Verification
- Test all 4 input form sections: auto-filling project details, word count limits, dynamic parameter loading per product, submitting report.
- Verify full CRUD operations (Create report, View list, Edit report, Delete report).
