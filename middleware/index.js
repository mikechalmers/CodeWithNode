/*jshint esversion: 8 */

const Review = require('../models/review');

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
  }

};
