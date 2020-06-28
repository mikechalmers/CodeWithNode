/*jshint esversion: 6 */
const express           = require('express');
const router            = express.Router();
const { errorHandler }  = require('../middleware');
const { getPosts }      = require('../controllers/posts');

/* GET posts index /posts */
router.get('/', errorHandler(getPosts));

/* GET new post /posts/new */
router.get('/new', (req, res, next) => {
  res.send('this is the /posts/new page');
});

/* POST new post /posts */
router.post('/', (req, res, next) => {
  res.send('this is the POST /posts page');
});

/* GET SHOW page /posts/:id */
router.get('/:id', (req, res, next) => {
  res.send('this is the /posts/ SHOW page for IDs');
});

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
