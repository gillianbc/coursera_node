var express = require('express');
var userRouter = express.Router();
const bodyParser = require('body-parser');
var User = require('../models/users');
var passport = require('passport');
var authenticate = require('../authenticate');
userRouter.use(bodyParser.json());

//REGISTER NEW USER
//POST localhost:3000/users/signup  {"username":"gillian","password":"password"}
userRouter.post('/signup', (req, res, next) => {
  console.log('Signup');
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      //REALLY?  This syntax?
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true,  
                  token: token, 
                  status: 'Registration Successful.  You are logged in ' + user.username});
      });
    }
  });
});

//LOGIN
// localhost:3000/users/login with username and password in body
userRouter.post('/login', passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({_id: req.user._id});
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, 
            token: token, 
            status: 'You are successfully logged in, ' + req.body.username});
});

//LOGOUT
//localhost:3000/users/logout
userRouter.get('/logout', (req, res) => {
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
userRouter.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//Don't we need a next() here?
module.exports = userRouter;
