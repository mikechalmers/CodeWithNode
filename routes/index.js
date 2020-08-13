/*jshint esversion: 6 */
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const {
  landingPage,
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  getLogout,
  getProfile,
  updateProfile,
  getForgotPassword,
  putForgotPassword,
  getResetPassword,
  putResetPassword
} = require('../controllers');
const {
  asyncErrorHandler,
  isLoggedIn,
  isValidPassword,
  changePassword
} = require('../middleware');

/* GET home/landing page. */
router.get('/', asyncErrorHandler(landingPage));

/* GET /register user. */
router.get('/register', getRegister);

/* POST /register user. */
router.post('/register', upload.single('image'), asyncErrorHandler(postRegister));

/* GET /login user. */
router.get('/login', getLogin);

/* POST /login user. */
router.post('/login', asyncErrorHandler(postLogin));

/* GET /logout user. */
router.get('/logout', getLogout);

/* GET user profile. */
router.get('/profile', isLoggedIn, asyncErrorHandler(getProfile));

/* PUT update user profile. */
router.put('/profile',
  isLoggedIn,
  upload.single('image'),
  asyncErrorHandler(isValidPassword),
  asyncErrorHandler(changePassword),
  asyncErrorHandler(updateProfile)
);

/* GET forgot password. */
router.get('/forgot-password', getForgotPassword);

/* PUT forgot password. */
router.put('/forgot-password', asyncErrorHandler(putForgotPassword));

/* GET reset password with token. */
router.get('/reset/:token', asyncErrorHandler(getResetPassword));

/* PUT reset password with token. */
router.put('/reset/:token', asyncErrorHandler(putResetPassword));


module.exports = router;
