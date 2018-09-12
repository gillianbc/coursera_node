var express = require('express');
var userRouter = express.Router();
const bodyParser = require('body-parser');
var Users = require('../models/users');
var passport = require('passport');
var authenticate = require('../authenticate');
const cors = require('./cors'); 
userRouter.use(bodyParser.json());

userRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); });

//REGISTER NEW USER
//POST localhost:3000/users/signup  {"username":"gillian","password":"password"}
userRouter.post('/signup', cors.corsWithOptions, (req, res, next) => {
  console.log('Signup');
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      if (req.body.firstname)
        user.firstname = req.body.firstname;
      if (req.body.lastname)
        user.lastname = req.body.lastname;
        user.save((err,user) => {
          if (err){
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
            return;
          }
        });
      //REALLY?  This syntax?
      passport.authenticate('local')(req, res, () => {
        var token = authenticate.getToken({_id: req.user._id});
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, token: token, status: 'Registration Successful.  You are logged in ' + user.username});
      });
    }
  });
});

//LOGIN
// localhost:3000/users/login with username and password in body
userRouter.post('/login', cors.corsWithOptions, passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in, ' + req.body.username});
});

//LOGOUT
//localhost:3000/users/logout
userRouter.get('/logout', cors.cors, (req, res) => {
  if (req.session) {
    console.log('Logout: ' + req.user.username);
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});
/* GET users listing. */
// Note the syntax here.  router.METHOD(path, [callback, ...] callback)
// So we can give the name of a callback or define a local callback
// verifyAdmin is a function defined in authenticate.js - we're not calling it, 
// we are naming it as one of the callbacks (middleware) to use, 
// so we don't say this:  authenticate.verifyAdmin(req, res, next)
// We do define the signature for the last callback as that's defined here locally
// That puzzled me for ages;  it's simple really
userRouter.get('/', cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {
  Users.find({})
  .then((users) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(users);
  }, (err) => next(err))
  .catch((err) => next(err));
});

//Don't we need a next() here?
module.exports = userRouter;
