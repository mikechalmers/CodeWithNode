/*jshint esversion: 8 */
const Post = require('../models/post');
const Review = require('../models/review');

module.exports = {

  //Reviews Create
  async reviewCreate(req, res, next){
    // find the post by its ID
    // added .populate to turn the review objects into review content so we can restrict reviews to 1 per user
    // exec() executes the populate
    let post = await Post.findById(req.params.id).populate('reviews').exec();
    // filter is a method that allows us to filter all reviews for something (in this case if author matches a review author)
    let haveReviewed = post.reviews.filter(review => {
      return review.author.equals(req.user._id);
    // using length so if there is a review it will = 1, else = 0
    }).length;
    if(haveReviewed) {
      req.session.error = 'Sorry, you can only create one review per post.';
      return res.redirect(`/posts/${post.id}`);
    }
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
    // first we need to remove the review from the post
    await Post.findByIdAndUpdate(req.params.id, {
      // $pull is a mongo function that removes only the specified values from the entry (in this case the review from the post)
      $pull: { reviews: req.params.review_id}
    });
    await Review.findByIdAndRemove(req.params.review_id);
    req.session.success = 'Review deleted successfully';
    res.redirect(`/posts/${req.params.id}`);
  }

// end modules export
};
