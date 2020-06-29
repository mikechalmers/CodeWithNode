/*jshint esversion: 6 */

// require packages
const createError     = require('http-errors');
const express         = require('express');
const path            = require('path');
const cookieParser    = require('cookie-parser');
const logger          = require('morgan');
const bodyParser      = require('body-parser');
const passport        = require('passport');
const session         = require('express-session');
const mongoose        = require('mongoose');
const methodOverride  = require('method-override');

// require user - passportLocalMongoose code
const User = require('./models/user');

// require routes
const indexRouter     = require('./routes/index');
const postsRouter     = require('./routes/posts');
const reviewsRouter   = require('./routes/reviews');

const app = express();

// mongoose setup
var url = process.env.DATABASEURL || "mongodb://localhost/codeWithNode";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true, });
// mongoose console connection feedback
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('mongo connected');
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// configure ExpressSessions - has to be before passport
app.use(session({
  secret: 'kick me under the table all you want',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// configure Passport - passportLocalMongoose code
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser()); // first part comes from passport, second part (passed in) comes from passportLocalMongoose
passport.deserializeUser(User.deserializeUser());

// mount routes
app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/posts/:id/reviews', reviewsRouter);

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
