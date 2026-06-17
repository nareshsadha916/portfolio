const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const portfolioController = require('../controllers/portfolioController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

// ==========================================
// PUBLIC ROUTES
// ==========================================
router.post('/auth/login', authController.login);
router.get('/auth/verify', authMiddleware, authController.verifyToken);

router.get('/public/portfolio', portfolioController.getPublicPortfolio);
router.post('/public/contact', portfolioController.submitContactMessage);

// ==========================================
// ADMIN ROUTES (PROTECTED BY JWT)
// ==========================================

// Skills management
router.post('/admin/skills', authMiddleware, portfolioController.addSkill);
router.put('/admin/skills/:id', authMiddleware, portfolioController.editSkill);
router.delete('/admin/skills/:id', authMiddleware, portfolioController.deleteSkill);

// Projects management
router.post('/admin/projects', authMiddleware, upload.single('image'), portfolioController.addProject);
router.put('/admin/projects/:id', authMiddleware, upload.single('image'), portfolioController.editProject);
router.delete('/admin/projects/:id', authMiddleware, portfolioController.deleteProject);

// Certifications management
router.post(
  '/admin/certifications',
  authMiddleware,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'pdf', maxCount: 1 }
  ]),
  portfolioController.addCertification
);
router.put(
  '/admin/certifications/:id',
  authMiddleware,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'pdf', maxCount: 1 }
  ]),
  portfolioController.editCertification
);
router.delete('/admin/certifications/:id', authMiddleware, portfolioController.deleteCertification);

// Internships management
router.post('/admin/internships', authMiddleware, upload.single('certificate'), portfolioController.addInternship);
router.put('/admin/internships/:id', authMiddleware, upload.single('certificate'), portfolioController.editInternship);
router.delete('/admin/internships/:id', authMiddleware, portfolioController.deleteInternship);

// Achievements management
router.post('/admin/achievements', authMiddleware, portfolioController.addAchievement);
router.put('/admin/achievements/:id', authMiddleware, portfolioController.editAchievement);
router.delete('/admin/achievements/:id', authMiddleware, portfolioController.deleteAchievement);

// Education management
router.post('/admin/education', authMiddleware, portfolioController.addEducation);
router.put('/admin/education/:id', authMiddleware, portfolioController.editEducation);
router.delete('/admin/education/:id', authMiddleware, portfolioController.deleteEducation);

// Contact Information management
router.put('/admin/contact-info', authMiddleware, portfolioController.updateContactInfo);
router.post('/admin/profile-image', authMiddleware, upload.single('profile_image'), portfolioController.uploadProfileImage);

// Resume management
router.post('/admin/resume', authMiddleware, upload.single('resume'), portfolioController.uploadResume);
router.delete('/admin/resume', authMiddleware, portfolioController.deleteResume);

// Messages log
router.get('/admin/messages', authMiddleware, portfolioController.getMessages);
router.delete('/admin/messages/:id', authMiddleware, portfolioController.deleteMessage);

module.exports = router;
