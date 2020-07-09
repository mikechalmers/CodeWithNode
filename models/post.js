/*jshint esversion: 8 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require('./review');
const mongoosePaginate = require('mongoose-paginate');

const PostSchema = new Schema({
  title: String,
  price: String,
  description: String,
  images: [ {
    url: String,
    public_id: String
  } ],
  location: String,
  coordinates: Array,
  user: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ],
  avgRating: {
    type: Number,
    default: 0
  }
});

// middleware added so any time .remove() (ie post.remove() in Posts Destroy controller), this removes matching reviews
// need to use a function - not arrow function - here, as we're using 'this' (which points to the post that called it here)
// $in is another mongo operator - selects docs whose field hold an arrary that matches
PostSchema.pre('remove', async function() {
  await Review.remove({
    _id: {
      $in: this.reviews
    }
  });
});

// PostSchema = any document that is a post can call the calculateAvgRating method and will run this function
// need to use a function for 'this' to work
PostSchema.methods.calculateAvgRating = function() {
  let ratingsTotal = 0;
  // only run if there are reviews
  if(this.reviews.length) {
    // this refers to the post it will be rating
    // iterate over all reviews
    this.reviews.forEach(review => {
      ratingsTotal += review.rating;
    });
    // post.avgRating from the schema
    this.avgRating = Math.round((ratingsTotal / this.reviews.length) * 10) / 10;
    const floorRating = Math.floor(this.avgRating);
    this.save();
    return floorRating;
  } else {
    this.avgRating = ratingsTotal;
  }
  };


// add pagination insude of posts
PostSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Post', PostSchema);
