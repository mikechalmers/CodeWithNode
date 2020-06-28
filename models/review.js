/*jshint esversion: 6 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  title: String,
  price: String,
  description: String,
  images: [ String ],
  location: String,
  lat: Number,
  lng: Number,
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
  ]
});

module.exports = mongoose.model('Review', ReviewSchema);
