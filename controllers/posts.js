/*jshint esversion: 8 */
const Post = require('../models/post');

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
    //use req.body
    let post = await Post.create(req.body);
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
  }

};
