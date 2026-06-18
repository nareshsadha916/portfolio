const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const client = new Client({
  connectionString: 'postgresql://postgres:Naresh%40%23%24%25%5E%26*%3C%3E@db.ykbieqyjbuoshxdahqys.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    
    // Check if admin exists
    const res = await client.query('SELECT * FROM admin WHERE username = $1', ['admin']);
    if (res.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await client.query('INSERT INTO admin (username, password) VALUES ($1, $2)', ['admin', hashedPassword]);
      console.log('Admin user created successfully.');
    } else {
      console.log('Admin user already exists.');
    }

  } catch (err) {
    console.error("Error creating admin user:", err);
  } finally {
    await client.end();
  }
}

run();
