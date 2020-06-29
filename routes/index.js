/*jshint esversion: 6 */
const express = require('express');
const router = express.Router();
const { postRegister, postLogin, getLogout } = require('../controllers');
const { asyncErrorHandler } = require('../middleware');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

/* GET /register user. */
router.get('/register', (req, res, next) => {
  res.send("this be the register user form");
});

/* POST /register user. */
router.post('/register', asyncErrorHandler(postRegister));

/* GET /login user. */
router.get('/login', (req, res, next) => {
  res.send("this be the register GET login form");
});

/* POST /login user. */
router.post('/login', postLogin);

/* GET /logout user. */
router.get('/logout', getLogout);

/* GET user profile. */
router.get('/profile', (req, res, next) => {
  res.send("this be the GET user profile");
});

/* PUT update user profile/:user_id . */
router.put('/profile/:user_id', (req, res, next) => {
  res.send("PUT the /profile/:user_id");
});

/* GET forgot password. */
router.get('/forgot', (req, res, next) => {
  res.send("this be the GET forgot password");
});

/* GET forgot password. */
router.put('/forgot', (req, res, next) => {
  res.send("this be the PUT forgot password");
});

/* GET reset password with token. */
router.get('/reset/:token', (req, res, next) => {
  res.send("this be the GET reset password with token");
});

/* PUT reset password with token. */
router.put('/reset/:token', (req, res, next) => {
  res.send("this be the PUT reset password with token");
});


module.exports = router;
