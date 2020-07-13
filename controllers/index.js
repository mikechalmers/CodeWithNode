/*jshint esversion: 8 */

const User          = require('../models/user');
const Post          = require('../models/post');
const passport      = require('passport');

module.exports = {
  // GET /
  async landingPage(req, res, next) {
    const posts = await Post.find({});
    res.render('index', { posts, mapBoxToken: process.env.MAPBOX_TOKEN, title: 'App Home' });
  },
  // register user - POST /register
  async postRegister(req, res, next) {
    console.log('registering user');
  const newUser = new User({
    username:   req.body.username,
    email:      req.body.email,
    image:      req.body.image
  });
  await User.register(newUser, req.body.password);

  console.log('user registered!');
  res.redirect('/');
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
