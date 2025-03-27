const LocalStrategy = require('passport-local').Strategy;
const User = require('../src/models/user');

module.exports = function(passport) {
    // Local Strategy
    passport.use(new LocalStrategy(
        async function(username, password, done) {
            try {
                // Find user by username
                const user = await User.findOne({ username: username });
                
                // If user doesn't exist
                if (!user) {
                    return done(null, false, { message: 'Incorrect username or password' });
                }
                
                // Check password
                const isMatch = await user.comparePassword(password);
                if (!isMatch) {
                    return done(null, false, { message: 'Incorrect username or password' });
                }
                
                // If everything is OK, return the user
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    ));

    // Serialize user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // Deserialize user
    passport.deserializeUser(async function(id, done) {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
};