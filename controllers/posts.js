/*jshint esversion: 8 */
const Post = require('../models/post');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');

// Posts Index
module.exports = {
  async postIndex(req, res, next){
    const { dbQuery } = res.locals;
    delete res.locals.dbQuery;
    // swap .find({}) for .paginate - in both we're querying for all posts
    let posts = await Post.paginate(dbQuery, {
      // what page was queried - otherwise page 1
      page: req.query.page || 1,
      // sort like mongoose, object and string
      // sort: {'_id': '-1'},
      // shortened:
      sort: '-_id',
      limit: 10
    });
    posts.page = Number(posts.page);
    if (!posts.docs.length && res.locals.query) {
      res.locals.error = 'No results match that query';
    }
    res.render('posts/index', { posts, title: 'Posts Index', mapBoxToken });
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
  // for(const file of req.files){
  //   let image = await cloudinary.v2.uploader.upload(file.path);
  //   req.body.post.images.push({
  //     url: image.secure_url,
  //     public_id: image.public_id
  //   });
  for(const file of req.files) {
  	req.body.post.images.push({
  		url: file.secure_url,
  		public_id: file.public_id
  	 });
   }

  // Take the location user sent and query Mapbox geocoding. This will respond with a heap of different properties

  let match = await geocodingClient
    .forwardGeocode({
      query: req.body.post.location,
      limit: 1
    })
    .send();

  // this takes the coordinates part from the above response from the geocodingClient and inserts it into coordinates in the database
  // req.body.post.coordinates = match.body.features[0].geometry.coordinates;
  // instead we will take more than just coordinates for new Geometry object in Post schema
  req.body.post.geometry = match.body.features[0].geometry;

  console.log("req.user._id = " + req.user._id);

  // store the ID of the user as the author of the post
  req.body.post.author = req.user._id;

  console.log("req.body.post.author = " + req.body.post.author);

  // post all the user inputted data into the database as a Post
  // let post = await Post.create(req.body.post);
  // changed to this to now add descriptions for maps

  let post = new Post(req.body.post);
  post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;
  await post.save();

  // flash messages

  req.session.success = 'Post created successfully';

  // find out what is in post (dev)

  // console.log(post);

  res.redirect(`/posts/${post.id}`); // redirect to create post - note backticks and syntax
},

// Posts show
async postShow(req, res, next){
  // next line has an error test to check flash messages
  // throw new Error('This is a glasses error');

  //add .populate to bring in reviews
  let post = await Post.findById(req.params.id).populate({
    // you can just have 'reviews' with no object but we've put it into an object with sort so we can show reverse order
    path: 'reviews',
    options: { sort: { '_id': -1 } },
    populate: {
      path: 'author',
      model: 'User'
    }
  });

  // const floorRating = post.calculateAvgRating();

  // used for seeded posts. Remove and uncomment above in production
  const floorRating = post.avgRating;

  // console.log(post);
  res.render('posts/show', { post, mapBoxToken, floorRating });
},

// Posts edit
postEdit(req, res, next){
  res.render('posts/edit');
},

// Post update
async postUpdate(req, res, next){

  // get access to the post we want to edit by ID

  // let post = await Post.findById(req.params.id);
  // now that the post is being passed from middleware via res.locals, we can instead deconstruct to use current post

  const { post } = res.locals;

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
    //
    // for(const file of req.files){
    //
    //   // upload images
    //
    //   let image = await cloudinary.v2.uploader.upload(file.path);
    //
    //   // add images to Mongo - post.images array
    //
    //   post.images.push({
    //     url: image.secure_url,
    //     public_id: image.public_id
    //   });
    // }

    for(const file of req.files) {
    	post.images.push({
    		url: file.secure_url,
    		public_id: file.public_id
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

    post.geometry = match.body.features[0].geometry;

    // while we're at it, update location - if it's not modified it won't update within this loop

    post.location = req.body.post.location;

  }

  // update the post with the submitted properties regardless if changed or not

  post.title = req.body.post.title;
  post.description = req.body.post.description;
  post.price = req.body.post.price;
  post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;

  // and save - using await so it's saved before we render the updated page

  await post.save();

  // go back to Post show page

  res.redirect(`/posts/${post.id}`);
},

// Post destroy
async postDestroy(req, res, next){
  // deconstruct res.locals for the post that was passed from middleware
  const { post } = res.locals;
  for (const image of post.images) {
    await cloudinary.v2.uploader.destroy(image.public_id);
  }
  await post.remove();
  req.session.success = 'Post deleted successfully';
  res.redirect('/posts');
}
};
