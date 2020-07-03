/*jshint esversion: 8 */
const Post = require('../models/post');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'mike-chalmers',
  api_key: '691283465219522',
  api_secret: process.env.CLOUDINARY_SECRET
});

// Posts Index
module.exports = {
  async postIndex(req, res, next){
    let posts = await Post.find({});
    res.render('posts/index', { posts, title: 'Posts Index' });
  },

  // Posts New
  postNew(req, res, next){
    res.render('posts/new');
  },

//Posts Create
async postCreate(req, res, next){
  // there's no req.body.post.images and we need this to add it to user's post so
  // we can create it as an array, then push() the fields created by cloudinary in like so
  req.body.post.images = [];
  for(const file of req.files){
    let image = await cloudinary.v2.uploader.upload(file.path);
    req.body.post.images.push({
      url: image.secure_url,
      public_id: image.public_id
    });
  }

  // Take the location user sent and query Mapbox geocoding. This will respond with a heap of different properties

  let match = await geocodingClient
    .forwardGeocode({
      query: req.body.post.location,
      limit: 1
    })
    .send();

  // this takes the coordinates part from the above response and inserts it into coordinates in the database

  req.body.post.coordinates = match.body.features[0].geometry.coordinates;

  // post all the user inputted data into the database as a Post

  let post = await Post.create(req.body.post);

  // find out what is in post (dev)

  // console.log(post);

  res.redirect(`/posts/${post.id}`); // redirect to create post - note backticks and syntax
},

// Posts show
async postShow(req, res, next){
  let post = await Post.findById(req.params.id);
  res.render('posts/show', { post });
},

// Posts edit
async postEdit(req, res, next){
  let post = await Post.findById(req.params.id);
  res.render('posts/edit', { post });
},

// Post update
async postUpdate(req, res, next){

  // get access to the post we want to edit by ID

  let post = await Post.findById(req.params.id);

  // Update IMAGES

  // check if there are any images for deletion by looking for the array of image checkboxes then seeing if any selected images exist with length, 0 = falsy

  if(req.body.deleteImages && req.body.deleteImages.length) {

    // make the images to delete a variable as we're going to be using it

    let deleteImages = req.body.deleteImages;

    // loop over the images - using async function so needs forof

    for(const public_id of deleteImages) {

      // delete image from Cloudinary

      await cloudinary.v2.uploader.destroy(public_id);

      // -- delete image from Mongo i.e post.images --

      // loop over images attached to the post

      for(const image of post.images) {

        // if any images from the post have the same public_id as the one we're deleting

        if(image.public_id === public_id) {

          // get the index of the image

          let index = post.images.indexOf(image);

          // remove this image using splice and one

          post.images.splice(index, 1);

          // this will still need saved, but we do that later
        }
      }
    }
  }

  // now check if there's any new images to upload

  if(req.files) {

    // loop over files added

    for(const file of req.files){

      // upload images

      let image = await cloudinary.v2.uploader.upload(file.path);

      // add images to Mongo - post.images array

      post.images.push({
        url: image.secure_url,
        public_id: image.public_id
      });
    }
  }

  // Update LOCATION / COORDINATES

  // if the User submitted location is different to how it is in database

  if(req.body.post.location !== post.location) {

    // Same as create route: take the update location user sent and query Mapbox geocoding. This will respond with a heap of different properties

    let match = await geocodingClient
      .forwardGeocode({
        query: req.body.post.location,
        limit: 1
      })
      .send();

    // take the coordinates from the response above and put it in the post that's about to be saved to database (below)

    post.coordinates = match.body.features[0].geometry.coordinates;

    // while we're at it, update location - if it's not modified it won't update within this loop

    post.location = req.body.post.location;

  }

  // update the post with the submitted properties regardless if changed or not

  post.title = req.body.post.title;
  post.description = req.body.post.description;
  post.price = req.body.post.price;

  // and save

  post.save();

  // go back to Post show page

  res.redirect(`/posts/${post.id}`);
},

// Post destroy
async postDestroy(req, res, next){
  let post = await Post.findById(req.params.id);
  for (const image of post.images) {
    await cloudinary.v2.uploader.destroy(image.public_id);
  }
  await post.remove();
  res.redirect('/posts');
}
};
