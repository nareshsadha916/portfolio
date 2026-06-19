const { Pool } = require('pg');
require('dotenv').config();

const dbUrl = 'postgresql://neondb_owner:npg_iC41NZvytzTk@ep-dawn-bonus-adgbryon.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString: dbUrl,
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: async (text, params) => {
    // Convert ? to $1, $2, etc.
    let pgText = text;
    if (params && params.length > 0) {
      let i = 1;
      pgText = pgText.replace(/\?/g, () => `$${i++}`);
    }
    
    // Add RETURNING id to INSERT queries to mock insertId
    let isInsert = pgText.trim().toUpperCase().startsWith('INSERT');
    if (isInsert && !pgText.toUpperCase().includes('RETURNING')) {
      pgText += ' RETURNING id';
    }

    try {
      const result = await pool.query(pgText, params);
      
      // Mock SQLite's db.all array wrapper
      if (pgText.trim().toUpperCase().startsWith('SELECT')) {
        return [result.rows];
      }
      
      // Mock SQLite's insertId
      const res = { insertId: null, changes: result.rowCount };
      if (isInsert && result.rows.length > 0) {
        res.insertId = result.rows[0].id;
      }
      return [res];
    } catch (err) {
      throw err;
    }
  }
};
