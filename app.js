const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const flash = require('c0nnect-flash');
const passport = require('passport');

// Load environment variables
dotenv.config();

// Import database connection
require('./config/db');

// Passport config
require('./config/passport')(passport);

const app = express();
const port = process.env.PORT || 3000;

// Import routes
const routes = require('./src/routes');

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session Middleware
app.use(session({
    secret: preovess.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitiated: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day - more than enough for now 
}))


// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash Middleware
app.use(flash());

// Global Variables Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// EJS Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout'); 

// Mount all routes
app.use('/', routes);

// 404 Handler (this will be triggered if no route matches)
app.use((req, res) => {
    res.status(404).render('404', { 
        title: 'Not Found' 
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).render('404', { 
      title: 'Server Error',
      message: 'Something went wrong on our end. Please try again later.'
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});