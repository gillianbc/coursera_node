const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

//local mongoose schema
const Dishes = require('./models/dishes');
const Promotions = require('./models/promotions');
const Leaders = require('./models/leaders');
//local modules for routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db) => {
  //port is set in the /bin/www file
  console.log('DB connected just fine.  Use Postman now on localhost:3000');
})
.catch((err) => {
  if (url != 'mongodb://localhost:27017/conFusion') {
    console.log('Problem connecting to DB...url should be mongodb://localhost:27017/conFusion');
    console.log('Url is ' + url);
    process.exit();
  }
  else {
    console.log('Problem connecting to DB.  Check mongodb is running');
    process.exit();
  }
});
const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//Load middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//Authentication
function auth (req, res, next) {
  console.log(req.headers);
  const authHeader = req.headers.authorization;
  if (!authHeader) {
      let err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      next(err);
      return;
  }
  const authArray = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
  const user = authArray[0];
  const passwd = authArray[1];
  if (user == 'admin' && passwd == 'password') {
      next(); // authorized
  } else {
      let err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');      
      err.status = 401;
      next(err);
  }
}
app.use(auth);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes',dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // next(createError(404));
  console.log('here');
  next();
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
