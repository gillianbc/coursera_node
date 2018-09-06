var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/users');

//Note the syntax here.  module.exports is used for exporting functions
//Here we are exporting an object called local 
exports.local = passport.use(new LocalStrategy(User.authenticate()));
//Define what user information should be stored in the session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());