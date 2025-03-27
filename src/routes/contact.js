const express = require('express');
const router = express.Router();
const contactController = require('../../controllers/contactController');
const {ensureAuthenticated} = require('../../config/auth');

// Get contact page
router.get('/', ensureAuthenticated, contactController.getContactPage);

// Submit contact form
router.post('/', ensureAuthenticated, contactController.submitContactForm);

module.exports = router;