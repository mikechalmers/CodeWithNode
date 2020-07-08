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
    req.body.review.author = req.user._id;
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
    // // find the post by its ID
    // let post = await Post.findById(req.params.id);
    // // this is my attempt and it does not work. Why? I didn't have the above line in (post wasn't defined - and didn't have the route using this controller yet)
    // // find the review by its ID
    // let review = await Review.findById(req.params.review_id);
    //
    // // set responses to review proper
    // review.body = req.body.review.body;
    // review.rating = req.body.review.rating;
    // // save so it's permanent
    // review.save();
    //
    // // go back to Post show page
    // res.redirect(`/posts/${post.id}`);

    // this was Ian's solution:
    // awaits, updates in one, takes the review ID (using req.params.review_id) and updates with the content (with req.body.review)
    await Review.findByIdAndUpdate(req.params.review_id, req.body.review);
    // add in a success flash
    req.session.success = 'Review updated successfully';
    // use req.params.id directly instead of creating a variable
    res.redirect(`/posts/${req.params.id}`);
    // much shorter and nicer


  },

  // Reviews destroy
  async reviewDestroy(req, res, next){

  }

// end modules export
};
