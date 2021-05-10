const link = "http://localhost:80";

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const User = require('./models/Asso');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy ({usernameField: 'email'}, (email, password, done) => {
            //Match User
            User.findOne({email: email}).then(user => {
                if (!user) {
                    return done(null, false, {msg: 'That email is not registred'});
                }
                // Match Password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done (null, false, {msg: 'Password incorrect'});
                    }
                });
            })
            .catch(err => console.log(err))
        })
    )
    passport.serializeUser(function(user, done) {done(null, user._id);});
    passport.deserializeUser(function(id, done) {User.findById(id, function(err, user) {done(err, user);});});
}
