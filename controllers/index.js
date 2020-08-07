/*jshint esversion: 8 */

const User          = require('../models/user');
const Post          = require('../models/post');
const passport      = require('passport');
const mapBoxToken = process.env.MAPBOX_TOKEN;

module.exports = {
// GET /
  async landingPage(req, res, next) {
    const posts = await Post.find({});
    res.render('index', { posts, mapBoxToken, title: 'App Home' });
  },

// GET /register
  getRegister(req, res, next) {
    // pass in username and email so user inputted values of these will = value on redirect in case of error
    res.render('register', { title: 'Register ', username: '', email: '' });
  },

// register user - POST /register
  async postRegister(req, res, next) {
    console.log('registering user');
    // catch any errors early for custom error handling
    try {
      // this allows us to have access to the user, so we can log them in right away afer registry
      const user = await User.register(new User(req.body), req.body.password);
      console.log('user registered!');
      // create a session
      req.login(user, function(err) {
        if (err) return next(err);
        req.session.success = `Welcome to Surf Shop, ${user.username}!`;
        res.redirect('/');
      });
    } catch(err) {
      console.log(err);
      // deconstruct req.body so username and email have their own variables
      const { username, email } = req.body;
      let error = err.message;
      if(error.includes('duplicate') && error.includes('index: email_1 dup key')) {
        error = 'A user with the given email is already registered';
      }
      res.render('register', { title: 'Register', username, email, error });
    }
},

// GET /login
getLogin(req, res, next) {
  // isAuthenticated is a Passport method that gives boolean value
  // self-contained if statement, no need for curly brackets
  // redirect to home if already logged in
  if(req.isAuthenticated()) return res.redirect('/');
  // use <a href="/login?returnTo=true"> to redirect to same page
  // again, is self-contained so doesn't need brackets (important: on one line)
  if(req.query.returnTo) req.session.redirectTo = req.headers.referer;
  // otherwise render the login page
  res.render('login', { title: 'Login' });
},

// login user - POST /login
  async postLogin(req, res, next) {
    // deconstruct req.body, pull out username and password, giving us access to them as variables
    const { username, password } = req.body;
    // invoke User.authenticate twice (invoke the function returned and pass in the arguments it expects (username and password).
    // returns a user or error depending if authenticated.
    const { user, error } = await User.authenticate()(username, password);
    // if there is an error bounce the error to next
    if(!user && error) return next (error);
    // if they are authentic
    req.login(user, function(err){
      // if there is an error bounce the error to next
      if(err) return next(err);
      // else crete a welcome flash message
      req.session.success = `Welcome back, ${username}!`;
      // pull the redirectTo from the session, assign to variable
      const redirectUrl = req.session.redirectTo || '/';
      // remove the session redirectTo so it's not floating around anymore
      delete req.session.redirectTo;
      // and then redirect them
      res.redirect(redirectUrl);
    });

  },

// logout user - GET /logout
  getLogout(req, res, next) {
    req.logout();
    res.redirect('/');
  },

  // User PROFILE GET /profile
  async getProfile(req, res, next) {
    // user Mongoose methods to get latest posts by this user
    const posts = await Post.find().where('author').equals(req.user._id).limit(10).exec();
    res.render('profile', { posts });
  }

};

// User.register(newUser, req.body.password, (err) => {
//   if (err) {
//     console.log('error while user register!', err);
//     return next(err);
//   }
//
//
//
//   res.redirect('/');
// });
