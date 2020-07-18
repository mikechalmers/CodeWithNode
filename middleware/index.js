/*jshint esversion: 8 */

const Review = require('../models/review');
const User = require('../models/user');
const Post = require('../models/post');

module.exports = {

  asyncErrorHandler: (fn) =>
    (req, res, next) => {
      Promise.resolve(fn(req, res, next))
              .catch(next);
  },

  isReviewAuthor: async (req, res, next) => {
    // we ID the review first
    let review = await Review.findById(req.params.review_id);
    // mognoose gives us the equals helper method - allowing us to check object ID against object ID as === doesn't work
    if (review.author.equals(req.user._id)) {
      return next();
    }
    // no else needed due to return statement above
    // error and redirect
    req.session.error = 'You\'re not allowed to edit comments by other users.';
    return res.redirect('/');
  },

  isLoggedIn: (req, res, next) => {
    if(req.isAuthenticated()) return next();
    req.session.error = 'You need to be logged in to do that';
    req.session.redirectTo = req.originalUrl;
    res.redirect('/login');
  },

  isAuthor: async (req, res, next) => {
    // assign post varable from the ID coming from the URL requested
    const post = await Post.findById(req.params.id);
    // if the author of this post is the current user
    if(post.author.equals(req.user._id)) {
      // pass the found post to the next method using locals
      res.locals.post = post;
      return next();
    }
    req.session.error = "Access denied";
    res.redirect('back');
  }

};
