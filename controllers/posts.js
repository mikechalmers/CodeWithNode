/*jshint esversion: 8 */
const Post = require('../models/post');
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
    res.render('posts/index', { posts });
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
    let post = await Post.create(req.body.post);
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
    // handle any deletion of existing images
    // handle upload of new images
    let post = await Post.findByIdAndUpdate(req.params.id, req.body.post);
    res.redirect(`/posts/${post.id}`);
  },

  // Post destroy
  async postDestroy(req, res, next){
    await Post.findByIdAndDelete(req.params.id);
    res.redirect('/posts');
  }

};
