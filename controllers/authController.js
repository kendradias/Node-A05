const passport = require('passport');
const User = require('../src/models/user');

/**
 * Show login page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getLoginPage = (req, res) => {
    try {
        res.render('login', { 
            title: 'Login'
        });
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { 
            title: 'Server Error',
            error: process.env.NODE_ENV === 'production' ? {} : err
        });
    }
};

/**
 * Handle login request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.login = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
};

/**
 * Show register page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getRegisterPage = (req, res) => {
    try {
        res.render('register', { 
            title: 'Register'
        });
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { 
            title: 'Server Error',
            error: process.env.NODE_ENV === 'production' ? {} : err
        });
    }
};

/**
 * Handle register request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.register = async (req, res) => {
    try {
        const { username, email, password, password2 } = req.body;
        
        // Validation
        const errors = [];
        
        // Check required fields
        if (!username || !email || !password || !password2) {
            errors.push({ msg: 'Please fill in all fields' });
        }
        
        // Check passwords match
        if (password !== password2) {
            errors.push({ msg: 'Passwords do not match' });
        }
        
        // Check password length
        if (password.length < 6) {
            errors.push({ msg: 'Password should be at least 6 characters' });
        }
        
        // If there are errors, re-render the register page
        if (errors.length > 0) {
            return res.render('register', {
                title: 'Register',
                errors,
                username,
                email
            });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        
        if (existingUser) {
            errors.push({ msg: 'Email or username is already registered' });
            return res.render('register', {
                title: 'Register',
                errors,
                username,
                email
            });
        }
        
        // Create new user
        const newUser = new User({
            username,
            email,
            password,
            role: 'user' // Default role for new registrations
        });
        
        // Save user to the database
        await newUser.save();
        
        req.flash('success_msg', 'You are now registered and can log in');
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { 
            title: 'Server Error',
            error: process.env.NODE_ENV === 'production' ? {} : err
        });
    }
};

/**
 * Handle logout request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.logout = (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/login');
    });
};