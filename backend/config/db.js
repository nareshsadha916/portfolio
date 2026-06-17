const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// A helper wrapper to keep syntax similar to mysql2
module.exports = {
  query: async (text, params) => {
    // Convert ? to $1, $2, etc. for PostgreSQL
    let index = 1;
    let pgText = text.replace(/\?/g, () => `$${index++}`);
    
    // Auto-append RETURNING id for INSERT statements
    const isMutation = /^(INSERT|UPDATE|DELETE)\b/i.test(pgText.trim());
    if (/^INSERT\b/i.test(pgText.trim()) && !/RETURNING/i.test(pgText)) {
      pgText += ' RETURNING id';
    }

    // Execute query
    const result = await pool.query(pgText, params);
    
    // For mutations, mysql2 expects [{ insertId, affectedRows }]
    if (isMutation) {
      const mysqlResult = {
        affectedRows: result.rowCount,
        insertId: (result.rows && result.rows.length > 0 && result.rows[0].id) ? result.rows[0].id : null
      };
      return [mysqlResult, result.fields];
    }
    
    // For SELECTs, return [rows]
    return [result.rows, result.fields];
  },
  pool,
};
