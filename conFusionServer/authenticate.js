var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/users');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config.js');
exports.local = passport.use(new LocalStrategy(User.authenticate()));
//Define what user information should be stored in the session

exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey,
        { expiresIn: 7200 });
};

exports.verifyAdmin = function (req, res, next) {
    if (req.user.admin)
        next();
    else {
        let err = new Error("You are not authorized to perform this operation!");
        err.status = 403;
        next(err);
    }
}

var opts = {};
//The JSON webtoken must be supplied in the authorization header e.g "bearer eJgt67jngG"
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({ _id: jwt_payload._id }, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));

// session: false means we're not using session authentication; no need - we're using the jwt strategy
exports.verifyUser = passport.authenticate('jwt', { session: false });


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());