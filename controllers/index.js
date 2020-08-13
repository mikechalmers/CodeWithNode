/*jshint esversion: 8 */

const User          = require('../models/user');
const Post          = require('../models/post');
const passport      = require('passport');
const mapBoxToken   = process.env.MAPBOX_TOKEN;
const util          = require('util');
const { cloudinary } = require('../cloudinary');
const { deleteProfileImage } = require('../middleware');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
      if (req.file) {
        const { secure_url, public_id} = req.file;
        req.body.image = { secure_url, public_id };
      }
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
      deleteProfileImage(req);
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
  },

  async updateProfile(req, res, next) {
    const {
    username,
    email
    } = req.body;
    const { user } = res.locals;
    if (username) user.username = username;
    if (email) user.email = email;
    if (req.file) {
      if (user.image.public_id) await cloudinary.v2.uploader.destroy(user.image.public_id);
      const { secure_url, public_id } = req.file;
      user.image = { secure_url, public_id };
    }
    await user.save();
    // user node's util promisify to use promise instead of callback
    // need to pass in req so req.login has access to it when promisified by using bind (req = context / THIS)
    const login = util.promisify(req.login.bind(req));
    // start new session with updated profile
    await login(user);
    req.session.success = 'Profile successfully updated';
    res.redirect('/profile');
  },

  getForgotPassword(req, res, next) {
    res.render('users/forgot');
  },

  async putForgotPassword(req, res, next) {
    const token = await crypto.randomBytes(20).toString('hex');
    const { email } = req.body;
    const user = await User.findOne({ email });
    const oneHour = 3600000;
    if (!user) {
      req.session.error = 'No account with that email';
      return res.redirect('/forgot-password');
    }
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const message = {
      to: email,
      from: 'Mike Chalmers <mike@mikechalmers.co.uk>', // Use the verified email
      subject: 'CodeWithNode - Forgot Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
			Please click on the following link, or copy and paste it into your browser to complete the process:
			http://${req.headers.host}/reset/${token}
			If you did not request this, please ignore this email and your password will remain unchanged.`.replace(/			/g, ''),
    };
    await sgMail.send(message);

    req.session.success = `An email has been sent to ${ email }, with further instructions`;
    res.redirect('/forgot-password');
  },

  async getResetPassword(req, res, next) {
    const { token } = req.params;
    const user = await User.findOne({
      resetPasswordToken: token,
      // $gt is mongo operator [greater than]
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      req.session.error = 'Password reset token is invalid or has expired';
      return res.redirect('/forgot-password');
    }
    res.render('users/reset', { token });
  },

  async putResetPassword(req, res, next) {
    const { token } = req.params;
    const user = await User.findOne({
      resetPasswordToken: token,
      // $gt is mongo operator [greater than]
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      req.session.error = 'Password reset token is invalid or has expired';
      return res.redirect('/forgot-password');
    }

    if (req.body.password === req.body.confirm) {
      await user.setPassword(req.body.password);
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();
      const login = util.promisify(req.login.bind(req));
      await login(user);
    } else {
      req.session.error = 'Passwords do not match';
      return res.redirect(`/reset/${ token }`);
    }
    const message = {
      to: user.email,
      from: 'Mike Chalmers <mike@mikechalmers.co.uk>', // Use the verified email
      subject: 'CodeWithNode - Password changed',
      text: `The requested password change has come in to effect. Didn't do this? Get in touch with us immediately!!!!`.replace(/      /g, ''),
    };
    await sgMail.send(message);
    req.session.success = 'i guess it worked';
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
