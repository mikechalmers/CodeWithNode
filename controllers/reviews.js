/*jshint esversion: 8 */
const Post = require('../models/post');
const Review = require('../models/review');

module.exports = {

  //Reviews Create
  async reviewCreate(req, res, next){
    // find the post by its ID
    let post = await Post.findById(req.params.id);
    // create the review
    // attach the author - add later
    // req.body.review.author = req.user._id;
    let review = await Review.create(req.body.review);
    // assign review to post
    post.reviews.push(review);
    // save the post
    post.save();
    // flash success
    req.session.success = 'Review created successfully';
    // redirect to the post show page - using template literals. ${post.id} = req.params.id
    res.redirect(`/posts/${post.id}`);
  },

  // Reviews update
  async reviewUpdate(req, res, next){

  },

  // Reviews destroy
  async reviewDestroy(req, res, next){

  }

// end modules export
};
