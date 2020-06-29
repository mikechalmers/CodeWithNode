/*jshint esversion: 6 */
const express                     = require('express');
const router                      = express.Router();
const { errorHandler }            = require('../middleware');
const { getPosts,
        newPost,
        createPost,
        showPost
      } = require('../controllers/posts');

/* GET posts index /posts */
router.get('/', errorHandler(getPosts));

/* GET new post /posts/new */
router.get('/new', newPost);

/* POST new post /posts */
router.post('/', errorHandler(createPost));

/* GET SHOW page /posts/:id */
router.get('/:id', errorHandler(showPost));

/* GET edit post /posts/:id/edit */
router.get('/:id/edit', (req, res, next) => {
  res.send('this is to edit the /posts/:id content');
});

/* PUT update /posts/:id */
router.put('/:id', (req, res, next) => {
  res.send('this is to update the /posts/:id content');
});

/* DESTROY the /posts/:id */
router.delete('/:id', (req, res, next) => {
  res.send('this is to destroy the /posts/:id');
});

module.exports = router;
