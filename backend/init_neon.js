const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbUrl = 'postgresql://neondb_owner:npg_iC41NZvytzTk@ep-dawn-bonus-adgbryon.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';
const pool = new Pool({ connectionString: dbUrl });

async function init() {
  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.postgres.sql'), 'utf8');
    await pool.query(schemaSql);
    console.log('Schema created');

    const [rows] = (await pool.query('SELECT * FROM admin')).rows;
    if (!rows) {
      const hash = await bcrypt.hash('naresh916', 10);
      await pool.query(
        'INSERT INTO admin (username, password, email) VALUES ($1, $2, $3)',
        ['nareshsadha', hash, 'admin@example.com']
      );
      console.log('Admin inserted');
    } else {
      console.log('Admin already exists');
    }
  } catch (err) {
    console.error('Init error:', err);
  } finally {
    await pool.end();
  }
}
init();
