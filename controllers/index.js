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
    res.render('register', { title: 'Register '});
  },

// register user - POST /register
  async postRegister(req, res, next) {
    console.log('registering user');
  const newUser = new User({
    username:   req.body.username,
    email:      req.body.email,
    image:      req.body.image
  });
  // this allows us to have access to the user, so we can log them in right away afer registry
  let user = await User.register(newUser, req.body.password);
  console.log('user registered!');
  req.login(user, function(err) {
    if (err) return next(err);
    req.session.success = `Welcome to Surf Shop, ${user.username}!`;
    res.redirect('/');
  });

},

// GET /login
getLogin(req, res, next) {
  res.render('login', { title: 'Login' });
},

// login user - POST /login
  postLogin(req, res, next) {
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login'
    })(req, res, next);
  },

// logout user - GET /logout
  getLogout(req, res, next) {
    req.logout();
    res.redirect('/');
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
