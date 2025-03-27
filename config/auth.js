/**
 * Middleware to ensure a user is authenticated
 */
exports.ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Please log in to view this resource');
    res.redirect('/login');
};

/**
 * Middleware to ensure a user is not authenticated
 * (for routes like login, register that should only be accessible when not logged in)
 */
exports.ensureNotAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};

/**
 * Middleware to ensure a user has admin role
 */
exports.ensureAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    req.flash('error_msg', 'You do not have permission to access this resource');
    res.redirect('/');
};