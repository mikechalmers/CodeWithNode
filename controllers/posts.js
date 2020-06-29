/*jshint esversion: 8 */
const Post = require('../models/post');

// Posts Index
module.exports = {
  async getPosts(req, res, next){
    let posts = await Post.find({});
    res.render('posts/index', { posts });
  },

  // Posts New
  newPost(req, res, next){
    res.render('posts/new');
  },

  //Posts Create
  async createPost(req, res, next){
    //use req.body
    let post = await Post.create(req.body);
    res.redirect(`/posts/${post.id}`); // redirect to create post - note backticks and syntax
  },
  async postRegister(req, res, next){
      console.log('creating post');
    const newPost = new Post({
      username:   req.body.username,
      email:      req.body.email,
      image:      req.body.image
    });
    await User.register(newUser, req.body.password);

    console.log('user registered!');
    res.redirect('/');
  },

  // Posts show
  async showPost(req, res, next){
    let post = await Post.findById(req.params.id);
    res.render('posts/show', { post });
  }

};
