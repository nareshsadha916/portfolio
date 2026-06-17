const mysql = require('mysql2/promise');
require('dotenv').config();

async function showDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'student',
      database: process.env.DB_NAME || 'portfolio_db',
      port: process.env.DB_PORT || 3309
    });

    const [tables] = await connection.query('SHOW TABLES');
    const tableKey = `Tables_in_${process.env.DB_NAME || 'portfolio_db'}`;
    
    console.log(`\n=== Database: ${process.env.DB_NAME || 'portfolio_db'} ===\n`);
    
    for (const row of tables) {
      const tableName = row[tableKey];
      console.log(`\nTable: ${tableName}`);
      const [columns] = await connection.query(`DESCRIBE \`${tableName}\``);
      console.table(columns.map(c => ({
        Field: c.Field,
        Type: c.Type,
        Null: c.Null,
        Key: c.Key,
        Default: c.Default
      })));
    }
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

showDatabase();
