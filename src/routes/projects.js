const express = require('express');
const router = express.Router();
const projectController = require('../../controllers/projectController');
const { ensureAdmin } = require('../../config/auth');
const upload = require('../../config/multer');

// Get all projects
router.get('/', projectController.getAllProjects);

// Search projects
router.get('/search', projectController.searchProjects);


// Admin ONLY routes
// Show form to create a new project
router.get('/create', ensureAdmin, projectController.showCreateProjectForm);

// Create a new project
router.post('/', ensureAdmin, upload.single('screenshot'), projectController.createProject);

// Show form to edit a project
router.get('/:id/edit', ensureAdmin, projectController.showEditProjectForm);

// Update a project
router.post('/:id/update', ensureAdmin, upload.single('screenshot'), projectController.updateProject);

// Show delete confirmation page
router.get('/:id/delete', ensureAdmin, projectController.showDeleteConfirmation);

// Delete a project
router.post('/:id/delete', ensureAdmin, projectController.deleteProject);

// Get project by ID (should be last to avoid conflicts with other routes)
router.get('/:id', projectController.getProjectById);

module.exports = router;