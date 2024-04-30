
require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const jwt=require('jsonwebtoken');



//if there is not any user then we use guest s
function attachUser(req,res,next) {
  // attach user to res.locals
  res.locals.user= {
    name:'Guest',
    email:'guest@example.com'
    //test 

    
  
    
  };
  console.log(res.locals.user);
  
  next();
}

var app = express();

//add middleware before routes
app.use(attachUser);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dynamodbRouter= require('./routes/dynamodb');
var authRouter= require('./routes/auth');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');





app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use(express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use(express.static(path.join(__dirname, 'node_modules/popper.js/dist/umd')));
app.use(express.static(path.join(__dirname,'node_modules/sweetalert2/dist')));

//jwt decode middleware
// JWT decode middleware
app.use((req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.error('Token decode error:', err.message);
        // If token is expired or invalid, clear the cookie and set user to null
        if (err.name === 'TokenExpiredError') {
          res.clearCookie('token');
        }
        res.locals.user = null;
      } else {
        res.locals.user = decoded;
      }
      next();
    });
  } else {
    res.locals.user = null;
    next();
  }
});






app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dynamodb', dynamodbRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
