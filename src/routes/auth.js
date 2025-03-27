const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');
const { ensureNotAuthenticated } = require('../../config/auth');

// Login page - only accessible if not logged in
router.get('/login', ensureNotAuthenticated, authController.getLoginPage);

// Register page - only accessible if not logged in
router.get('/register', ensureNotAuthenticated, authController.getRegisterPage);

// Handle login
router.post('/login', ensureNotAuthenticated, authController.login);

// Handle register
router.post('/register', ensureNotAuthenticated, authController.register);

// Handle logout
router.get('/logout', authController.logout);

module.exports = router;