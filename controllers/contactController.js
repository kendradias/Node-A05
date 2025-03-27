const Contact = require('../src/models/contact');

/**
 * Get contact page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getContactPage = (req, res) => {
    try {
        res.render('contact', { 
            title: 'Contact Me',
            user: req.user // pass user details to template
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
 * Submit contact form
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.submitContactForm = async (req, res) => {
    try {
        const { name, message } = req.body;
        
        // Create new contact message
        const newContact = new Contact({
            name,
            message,
            user: req.user._id // Associate with the logged-in user
        });
        
        // Save to MongoDB
        await newContact.save();
        
        console.log('Contact Form Submission:', newContact);
        
        if (req.query.format === 'json') {
            return res.status(200).json({
                success: true,
                message: "Thank you for reaching out!"
            });
        }
        
        res.render('thank-you', { 
            title: 'Thank You' 
        });
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { 
            title: 'Server Error',
            error: process.env.NODE_ENV === 'production' ? {} : err
        });
    }
};