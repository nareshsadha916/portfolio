const db = require('./config/db');
const bcrypt = require('bcryptjs');

async function createDefaultAdmin() {
  try {
    const [rows] = await db.query('SELECT * FROM admin WHERE username = ?', ['admin']);
    if (rows.length > 0) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await db.query('INSERT INTO admin (username, password, email) VALUES (?, ?, ?)', ['admin', hashedPassword, 'admin@example.com']);
    console.log('Default admin user created successfully.');
    console.log('Username: admin');
    console.log('Password: admin123');
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin user:', err);
    process.exit(1);
  }
}

createDefaultAdmin();
