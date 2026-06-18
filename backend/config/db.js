const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const isNewDb = !fs.existsSync(dbPath);

const db = new sqlite3.Database(dbPath);

const query = (text, params = []) => {
  return new Promise((resolve, reject) => {
    // Convert PostgreSQL $1, $2 to SQLite ?
    const sqliteText = text.replace(/\$\d+/g, '?').replace(/RETURNING id/i, '');
    
    const isSelect = /^\s*SELECT\b/i.test(sqliteText);
    
    if (isSelect) {
      db.all(sqliteText, params, (err, rows) => {
        if (err) reject(err);
        else resolve([rows, []]);
      });
    } else {
      db.run(sqliteText, params, function (err) {
        if (err) reject(err);
        else resolve([{ affectedRows: this.changes, insertId: this.lastID }, []]);
      });
    }
  });
};

if (isNewDb) {
  console.log("Initializing SQLite database...");
  const schema = `
    CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      email TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      proficiency INTEGER DEFAULT 100,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      tech_stack TEXT NOT NULL,
      image_url TEXT,
      github_url TEXT,
      live_url TEXT,
      completion_date TEXT,
      status TEXT DEFAULT 'Completed',
      category TEXT DEFAULT 'Web Development',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS certifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      issuing_organization TEXT NOT NULL,
      issue_date TEXT,
      image_url TEXT,
      pdf_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS internships (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_name TEXT NOT NULL,
      role TEXT NOT NULL,
      description TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT,
      certificate_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS education (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      institution TEXT NOT NULL,
      degree TEXT NOT NULL,
      department TEXT NOT NULL,
      start_year TEXT,
      end_year TEXT,
      status TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS resume (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_url TEXT NOT NULL,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS contact_info (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      college TEXT NOT NULL,
      department TEXT NOT NULL,
      github_url TEXT,
      linkedin_url TEXT,
      twitter_url TEXT,
      bio TEXT,
      headline TEXT,
      profile_image_url TEXT,
      address TEXT,
      designation TEXT
    );
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS portfolio_content (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `;
  
  db.exec(schema, async (err) => {
    if (err) console.error("Schema error:", err);
    else {
      try {
        const hash = await bcrypt.hash('admin123', 10);
        await query('INSERT INTO admin (username, password, email) VALUES (?, ?, ?)', ['admin', hash, 'admin@example.com']);
        console.log("Admin created");
      } catch (e) {
        console.error("Admin init error:", e);
      }
    }
  });
}

module.exports = { query, pool: db };
