/*jshint esversion: 8 */

const User = require('../models/user');

module.exports = {
  async postRegister(req, res, next) {
    console.log('registering user');
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    image: req.body.image
  });
  await User.register(newUser, req.body.password);

  console.log('user registered!');
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
