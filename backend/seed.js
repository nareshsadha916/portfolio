const db = require('./config/db');
const bcrypt = require('bcryptjs');

async function seed() {
  console.log('Seeding database...');
  let connection;
  try {
    connection = await db.getConnection();

    // 1. Seed Admin
    const [adminRows] = await connection.query('SELECT * FROM admin WHERE username = ?', ['admin']);
    if (adminRows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await connection.query(
        'INSERT INTO admin (username, password, email) VALUES (?, ?, ?)',
        ['admin', hashedPassword, 'nnareshkavithach@gmail.com']
      );
      console.log('Default admin seeded (Username: admin, Password: admin123)');
    } else {
      console.log('Admin user already exists');
    }

    // 2. Seed Contact Info / Profile
    const [contactRows] = await connection.query('SELECT * FROM contact_info LIMIT 1');
    const headline = 'Aspiring Software Developer | Problem Solver | Future Full Stack Developer';
    const bio = 'I am S. Naresh, a Computer Science and Engineering student at Anna University Regional Campus Madurai. I am passionate about software development, database management, artificial intelligence, machine learning, and web technologies. I enjoy solving real-world problems through technology, building projects, learning new technologies, and continuously improving my technical and analytical skills. I aim to become a skilled software engineer and contribute to innovative technology solutions.';
    
    if (contactRows.length === 0) {
      await connection.query(
        `INSERT INTO contact_info 
         (name, phone, email, college, department, github_url, linkedin_url, twitter_url, bio, headline) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'S. Naresh',
          '+91 96290 95916',
          'nnareshkavithach@gmail.com',
          'Anna University Regional Campus Madurai',
          'Computer Science and Engineering (CSE)',
          'https://github.com',
          'https://linkedin.com',
          'https://twitter.com',
          bio,
          headline
        ]
      );
      console.log('Contact info and bio seeded');
    } else {
      console.log('Contact info already exists');
    }

    // 3. Seed Skills
    const [skillRows] = await connection.query('SELECT COUNT(*) AS count FROM skills');
    if (skillRows[0].count === 0) {
      const initialSkills = [
        // Programming
        { name: 'Python', category: 'Programming' },
        { name: 'C Programming', category: 'Programming' },
        
        // Web Development
        { name: 'HTML', category: 'Web Development' },
        { name: 'CSS', category: 'Web Development' },
        { name: 'JavaScript', category: 'Web Development' },
        
        // Database
        { name: 'DBMS', category: 'Database' },
        { name: 'SQL Basics', category: 'Database' },
        
        // AI/ML
        { name: 'Artificial Intelligence Fundamentals', category: 'AI/ML' },
        { name: 'Machine Learning Fundamentals', category: 'AI/ML' },
        
        // Soft Skills
        { name: 'Logical Thinking', category: 'Soft Skills' },
        { name: 'Analytical Thinking', category: 'Soft Skills' },
        { name: 'Problem Solving', category: 'Soft Skills' },
        { name: 'Critical Thinking', category: 'Soft Skills' },
        { name: 'Team Collaboration', category: 'Soft Skills' },
        { name: 'Communication Skills', category: 'Soft Skills' }
      ];

      for (const skill of initialSkills) {
        await connection.query(
          'INSERT INTO skills (name, category, proficiency) VALUES (?, ?, ?)',
          [skill.name, skill.category, 90]
        );
      }
      console.log(`Seeded ${initialSkills.length} skills`);
    } else {
      console.log('Skills already seeded');
    }

    // 4. Seed Education
    const [eduRows] = await connection.query('SELECT COUNT(*) AS count FROM education');
    if (eduRows[0].count === 0) {
      await connection.query(
        `INSERT INTO education 
         (institution, degree, department, start_year, end_year, status) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          'Anna University Regional Campus Madurai',
          'Bachelor of Engineering (B.E.)',
          'Computer Science and Engineering',
          '2024',
          '2028',
          'Second Year Student'
        ]
      );
      console.log('Education timeline seeded');
    } else {
      console.log('Education already seeded');
    }

    console.log('Database seeding successfully completed.');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    if (connection) connection.release();
    process.exit(0);
  }
}

seed();
