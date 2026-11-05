const mysql = require('mysql2/promise');

let pool = null;

// Initialize MySQL Database Connection Pool using .env configuration
async function connectDatabase() {
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'brsc_mpr';

  try {
    pool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test connection pool
    await pool.query('SELECT 1');

    console.log(`Connected to MySQL Database "${database}" at ${host}:${port}`);
    return pool;
  } catch (error) {
    console.error('Database Connection Error:', error.message);
    throw error;
  }
}

module.exports = {
  connectDatabase,
  getPool: () => pool
};
