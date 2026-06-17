const db = require('../config/db');
const path = require('path');
const fs = require('fs');

// Helpers to delete files when database entries are deleted/updated
const deleteFile = (relativeUrl) => {
  if (!relativeUrl) return;
  const fileName = relativeUrl.replace('/uploads/', '');
  const filePath = path.join(__dirname, '..', 'uploads', fileName);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// ==========================================
// PUBLIC CONTROLLERS
// ==========================================

// Get all portfolio data in one request
exports.getPublicPortfolio = async (req, res) => {
  try {
    const [skills] = await db.query('SELECT * FROM skills ORDER BY category, name');
    const [projects] = await db.query('SELECT * FROM projects ORDER BY completion_date DESC');
    const [certifications] = await db.query('SELECT * FROM certifications ORDER BY issue_date DESC');
    const [internships] = await db.query('SELECT * FROM internships ORDER BY start_date DESC');
    const [achievements] = await db.query('SELECT * FROM achievements ORDER BY date DESC');
    const [education] = await db.query('SELECT * FROM education ORDER BY start_year DESC');
    const [resumeRows] = await db.query('SELECT * FROM resume ORDER BY uploaded_at DESC LIMIT 1');
    const [contactRows] = await db.query('SELECT * FROM contact_info LIMIT 1');

    res.json({
      skills,
      projects,
      certifications,
      internships,
      achievements,
      education,
      resume: resumeRows.length > 0 ? resumeRows[0] : null,
      contactInfo: contactRows.length > 0 ? contactRows[0] : null
    });
  } catch (error) {
    console.error('Error fetching public portfolio:', error);
    res.status(500).json({ message: 'Error fetching portfolio data' });
  }
};

// Submit contact form message
exports.submitContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required' });
    }

    await db.query(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, subject || '', message]
    );

    res.status(201).json({ message: 'Message submitted successfully' });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ message: 'Error submitting your message' });
  }
};

// ==========================================
// ADMIN CONTROLLERS: SKILLS
// ==========================================

exports.addSkill = async (req, res) => {
  try {
    const { name, category, proficiency } = req.body;
    if (!name || !category) {
      return res.status(400).json({ message: 'Name and category are required' });
    }
    const [result] = await db.query(
      'INSERT INTO skills (name, category, proficiency) VALUES (?, ?, ?)',
      [name, category, proficiency || 100]
    );
    res.status(201).json({ id: result.insertId, name, category, proficiency });
  } catch (error) {
    res.status(500).json({ message: 'Error adding skill', error });
  }
};

exports.editSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, proficiency } = req.body;
    await db.query(
      'UPDATE skills SET name = ?, category = ?, proficiency = ? WHERE id = ?',
      [name, category, proficiency, id]
    );
    res.json({ message: 'Skill updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating skill', error });
  }
};

exports.deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM skills WHERE id = ?', [id]);
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting skill', error });
  }
};

// ==========================================
// ADMIN CONTROLLERS: PROJECTS
// ==========================================

exports.addProject = async (req, res) => {
  try {
    const { title, description, tech_stack, github_url, live_url, completion_date, status, category } = req.body;
    let image_url = null;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    const [result] = await db.query(
      'INSERT INTO projects (title, description, tech_stack, image_url, github_url, live_url, completion_date, status, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, tech_stack, image_url, github_url || '', live_url || '', completion_date || null, status || 'Completed', category || 'Web Development']
    );

    res.status(201).json({ id: result.insertId, title, image_url });
  } catch (error) {
    console.error('Add project error:', error);
    res.status(500).json({ message: 'Error adding project', error });
  }
};

exports.editProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tech_stack, github_url, live_url, completion_date, status, category } = req.body;
    
    // Check if there is a new image
    let image_url = req.body.image_url;
    if (req.file) {
      // Delete old image
      const [rows] = await db.query('SELECT image_url FROM projects WHERE id = ?', [id]);
      if (rows.length > 0 && rows[0].image_url) {
        deleteFile(rows[0].image_url);
      }
      image_url = `/uploads/${req.file.filename}`;
    }

    await db.query(
      'UPDATE projects SET title = ?, description = ?, tech_stack = ?, image_url = ?, github_url = ?, live_url = ?, completion_date = ?, status = ?, category = ? WHERE id = ?',
      [title, description, tech_stack, image_url, github_url || '', live_url || '', completion_date || null, status || 'Completed', category || 'Web Development', id]
    );

    res.json({ message: 'Project updated successfully', image_url });
  } catch (error) {
    console.error('Edit project error:', error);
    res.status(500).json({ message: 'Error updating project', error });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT image_url FROM projects WHERE id = ?', [id]);
    if (rows.length > 0 && rows[0].image_url) {
      deleteFile(rows[0].image_url);
    }
    await db.query('DELETE FROM projects WHERE id = ?', [id]);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error });
  }
};

// ==========================================
// ADMIN CONTROLLERS: CERTIFICATIONS
// ==========================================

exports.addCertification = async (req, res) => {
  try {
    const { name, issuing_organization, issue_date } = req.body;
    let image_url = null;
    let pdf_url = null;

    if (req.files) {
      if (req.files.image) image_url = `/uploads/${req.files.image[0].filename}`;
      if (req.files.pdf) pdf_url = `/uploads/${req.files.pdf[0].filename}`;
    }

    const [result] = await db.query(
      'INSERT INTO certifications (name, issuing_organization, issue_date, image_url, pdf_url) VALUES (?, ?, ?, ?, ?)',
      [name, issuing_organization, issue_date || null, image_url, pdf_url]
    );

    res.status(201).json({ id: result.insertId, name, image_url, pdf_url });
  } catch (error) {
    res.status(500).json({ message: 'Error adding certification', error });
  }
};

exports.editCertification = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, issuing_organization, issue_date } = req.body;
    
    let image_url = req.body.image_url;
    let pdf_url = req.body.pdf_url;

    if (req.files) {
      const [rows] = await db.query('SELECT image_url, pdf_url FROM certifications WHERE id = ?', [id]);
      
      if (req.files.image) {
        if (rows.length > 0 && rows[0].image_url) deleteFile(rows[0].image_url);
        image_url = `/uploads/${req.files.image[0].filename}`;
      }
      if (req.files.pdf) {
        if (rows.length > 0 && rows[0].pdf_url) deleteFile(rows[0].pdf_url);
        pdf_url = `/uploads/${req.files.pdf[0].filename}`;
      }
    }

    await db.query(
      'UPDATE certifications SET name = ?, issuing_organization = ?, issue_date = ?, image_url = ?, pdf_url = ? WHERE id = ?',
      [name, issuing_organization, issue_date || null, image_url, pdf_url, id]
    );

    res.json({ message: 'Certification updated successfully', image_url, pdf_url });
  } catch (error) {
    res.status(500).json({ message: 'Error updating certification', error });
  }
};

exports.deleteCertification = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT image_url, pdf_url FROM certifications WHERE id = ?', [id]);
    if (rows.length > 0) {
      if (rows[0].image_url) deleteFile(rows[0].image_url);
      if (rows[0].pdf_url) deleteFile(rows[0].pdf_url);
    }
    await db.query('DELETE FROM certifications WHERE id = ?', [id]);
    res.json({ message: 'Certification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting certification', error });
  }
};

// ==========================================
// ADMIN CONTROLLERS: INTERNSHIPS
// ==========================================

exports.addInternship = async (req, res) => {
  try {
    const { company_name, role, description, start_date, end_date } = req.body;
    let certificate_url = null;
    if (req.file) {
      certificate_url = `/uploads/${req.file.filename}`;
    }

    const [result] = await db.query(
      'INSERT INTO internships (company_name, role, description, start_date, end_date, certificate_url) VALUES (?, ?, ?, ?, ?, ?)',
      [company_name, role, description, start_date, end_date || null, certificate_url]
    );

    res.status(201).json({ id: result.insertId, company_name, role });
  } catch (error) {
    res.status(500).json({ message: 'Error adding internship', error });
  }
};

exports.editInternship = async (req, res) => {
  try {
    const { id } = req.params;
    const { company_name, role, description, start_date, end_date } = req.body;
    let certificate_url = req.body.certificate_url;

    if (req.file) {
      const [rows] = await db.query('SELECT certificate_url FROM internships WHERE id = ?', [id]);
      if (rows.length > 0 && rows[0].certificate_url) {
        deleteFile(rows[0].certificate_url);
      }
      certificate_url = `/uploads/${req.file.filename}`;
    }

    await db.query(
      'UPDATE internships SET company_name = ?, role = ?, description = ?, start_date = ?, end_date = ?, certificate_url = ? WHERE id = ?',
      [company_name, role, description, start_date, end_date || null, certificate_url, id]
    );

    res.json({ message: 'Internship updated successfully', certificate_url });
  } catch (error) {
    res.status(500).json({ message: 'Error updating internship', error });
  }
};

exports.deleteInternship = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT certificate_url FROM internships WHERE id = ?', [id]);
    if (rows.length > 0 && rows[0].certificate_url) {
      deleteFile(rows[0].certificate_url);
    }
    await db.query('DELETE FROM internships WHERE id = ?', [id]);
    res.json({ message: 'Internship deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting internship', error });
  }
};

// ==========================================
// ADMIN CONTROLLERS: ACHIEVEMENTS
// ==========================================

exports.addAchievement = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const [result] = await db.query(
      'INSERT INTO achievements (title, description, date) VALUES (?, ?, ?)',
      [title, description, date || null]
    );
    res.status(201).json({ id: result.insertId, title, description, date });
  } catch (error) {
    res.status(500).json({ message: 'Error adding achievement', error });
  }
};

exports.editAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date } = req.body;
    await db.query(
      'UPDATE achievements SET title = ?, description = ?, date = ? WHERE id = ?',
      [title, description, date || null, id]
    );
    res.json({ message: 'Achievement updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating achievement', error });
  }
};

exports.deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM achievements WHERE id = ?', [id]);
    res.json({ message: 'Achievement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting achievement', error });
  }
};

// ==========================================
// ADMIN CONTROLLERS: EDUCATION
// ==========================================

exports.addEducation = async (req, res) => {
  try {
    const { institution, degree, department, start_year, end_year, status } = req.body;
    const [result] = await db.query(
      'INSERT INTO education (institution, degree, department, start_year, end_year, status) VALUES (?, ?, ?, ?, ?, ?)',
      [institution, degree, department, start_year, end_year, status]
    );
    res.status(201).json({ id: result.insertId, institution, degree });
  } catch (error) {
    res.status(500).json({ message: 'Error adding education record', error });
  }
};

exports.editEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const { institution, degree, department, start_year, end_year, status } = req.body;
    await db.query(
      'UPDATE education SET institution = ?, degree = ?, department = ?, start_year = ?, end_year = ?, status = ? WHERE id = ?',
      [institution, degree, department, start_year, end_year, status, id]
    );
    res.json({ message: 'Education updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating education record', error });
  }
};

exports.deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM education WHERE id = ?', [id]);
    res.json({ message: 'Education deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting education record', error });
  }
};

// ==========================================
// ADMIN CONTROLLERS: CONTACT INFO
// ==========================================

exports.updateContactInfo = async (req, res) => {
  try {
    const { name, phone, email, college, department, github_url, linkedin_url, twitter_url, bio, headline, address, designation } = req.body;
    
    // Check if there is an existing record
    const [rows] = await db.query('SELECT id FROM contact_info LIMIT 1');
    if (rows.length > 0) {
      await db.query(
        'UPDATE contact_info SET name = ?, phone = ?, email = ?, college = ?, department = ?, github_url = ?, linkedin_url = ?, twitter_url = ?, bio = ?, headline = ?, address = ?, designation = ? WHERE id = ?',
        [name, phone, email, college, department, github_url, linkedin_url, twitter_url, bio, headline, address, designation, rows[0].id]
      );
    } else {
      await db.query(
        'INSERT INTO contact_info (name, phone, email, college, department, github_url, linkedin_url, twitter_url, bio, headline, address, designation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [name, phone, email, college, department, github_url, linkedin_url, twitter_url, bio, headline, address, designation]
      );
    }
    res.json({ message: 'Profile details updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile details', error });
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }
    const profile_image_url = `/uploads/${req.file.filename}`;

    const [rows] = await db.query('SELECT id, profile_image_url FROM contact_info LIMIT 1');
    if (rows.length > 0) {
      if (rows[0].profile_image_url) {
        deleteFile(rows[0].profile_image_url);
      }
      await db.query('UPDATE contact_info SET profile_image_url = ? WHERE id = ?', [profile_image_url, rows[0].id]);
    } else {
      await db.query('INSERT INTO contact_info (name, phone, email, college, department, profile_image_url) VALUES (?, ?, ?, ?, ?, ?)', ['Admin', '', '', '', '', profile_image_url]);
    }

    res.json({ message: 'Profile image uploaded successfully', profile_image_url });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading profile image', error });
  }
};

// ==========================================
// ADMIN CONTROLLERS: RESUME
// ==========================================

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No resume file uploaded' });
    }
    const file_url = `/uploads/${req.file.filename}`;

    // Get previous resume files to delete from disk to clean space
    const [rows] = await db.query('SELECT file_url FROM resume');
    for (const row of rows) {
      deleteFile(row.file_url);
    }
    // Clear the table and insert the new active resume
    await db.query('DELETE FROM resume');
    await db.query('INSERT INTO resume (file_url) VALUES (?)', [file_url]);

    res.json({ message: 'Resume uploaded successfully', file_url });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading resume', error });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT file_url FROM resume');
    for (const row of rows) {
      deleteFile(row.file_url);
    }
    await db.query('DELETE FROM resume');
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting resume', error });
  }
};

// ==========================================
// ADMIN CONTROLLERS: MESSAGES
// ==========================================

exports.getMessages = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving messages', error });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM contact_messages WHERE id = ?', [id]);
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message', error });
  }
};
