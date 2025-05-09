const express = require('express');
const router = express.Router();

// Import route modules
const homeRoutes = require('./home');
const aboutRoutes = require('./about');
const projectRoutes = require('./projects');
const contactRoutes = require('./contact');
const authRoutes = require('./auth');

// Mount route modules
router.use('/', homeRoutes);
router.use('/', authRoutes); 
router.use('/about', aboutRoutes);
router.use('/projects', projectRoutes);
router.use('/contact', contactRoutes);

// 404 Handler
router.use((req, res) => {
    if (req.query.format === 'json') {
        return res.status(404).json({ error: "Page not found" });
    }
    res.status(404).render('404', { 
        title: 'Not Found', 
        user: req.user // Pass user details to template
    });
});

module.exports = router;