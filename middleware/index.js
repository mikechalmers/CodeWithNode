/*jshint esversion: 8 */

const Review = require('../models/review');
const User = require('../models/user');

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

  checkIfUserExists: async (req, res, next) => {
    // check submitted email against the database
    let userExists = await User.findOne({'email': req.body.email});
    // will be null unless a match so
    if (userExists) {
      req.session.error = 'A user with the given email is already registered';
      return res.redirect('back');
    }
    next();
  }

};
