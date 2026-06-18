const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  connectionString: 'postgresql://postgres:Naresh%40%23%24%25%5E%26*%3C%3E@db.ykbieqyjbuoshxdahqys.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    const schemaPath = path.join(__dirname, 'schema.postgres.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schemaSql);
    console.log("Database initialized successfully!");
  } catch (err) {
    console.error("Error initializing database:", err);
  } finally {
    await client.end();
  }
}

run();
