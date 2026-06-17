const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setup() {
  try {
    // Connect without database selected
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'student',
      port: process.env.DB_PORT || 3309
    });

    console.log('Connected to MySQL server.');

    // Create database
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'portfolio_db'}\`;`);
    console.log(`Database ${process.env.DB_NAME || 'portfolio_db'} created or already exists.`);

    // Use database
    await connection.query(`USE \`${process.env.DB_NAME || 'portfolio_db'}\`;`);

    // Read and execute schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split schema into individual queries
    const queries = schema.split(';').filter(q => q.trim() !== '');
    
    for (const query of queries) {
      if (query.trim()) {
        await connection.query(query);
      }
    }
    
    console.log('Schema imported successfully.');
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('Error during setup:', error);
    process.exit(1);
  }
}

setup();
