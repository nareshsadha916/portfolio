const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateSchema() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'student',
      database: process.env.DB_NAME || 'portfolio_db',
      port: process.env.DB_PORT || 3309
    });

    console.log('Connected to MySQL server.');

    // Add profile_image_url
    try {
      await connection.query('ALTER TABLE `contact_info` ADD COLUMN `profile_image_url` VARCHAR(500) DEFAULT NULL;');
      console.log('Added profile_image_url column.');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') console.log('Column profile_image_url already exists.');
      else throw e;
    }

    // Add address
    try {
      await connection.query('ALTER TABLE `contact_info` ADD COLUMN `address` TEXT DEFAULT NULL;');
      console.log('Added address column.');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') console.log('Column address already exists.');
      else throw e;
    }

    // Add designation
    try {
      await connection.query('ALTER TABLE `contact_info` ADD COLUMN `designation` VARCHAR(255) DEFAULT NULL;');
      console.log('Added designation column.');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') console.log('Column designation already exists.');
      else throw e;
    }
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('Error during schema update:', error);
    process.exit(1);
  }
}

updateSchema();
