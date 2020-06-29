/*jshint esversion: 6 */
const express                     = require('express');
const router                      = express.Router();
const { asyncErrorHandler }            = require('../middleware');
const { postIndex,
        postNew,
        postCreate,
        postShow,
        postEdit,
        postUpdate
      } = require('../controllers/posts');

/* GET posts index /posts */
router.get('/', asyncErrorHandler(postIndex));

/* GET new post /posts/new */
router.get('/new', postNew);

/* POST new post /posts */
router.post('/', asyncErrorHandler(postCreate));

/* GET SHOW page /posts/:id */
router.get('/:id', asyncErrorHandler(postShow));

/* GET edit post /posts/:id/edit */
router.get('/:id/edit', asyncErrorHandler(postEdit));

/* PUT update /posts/:id */
router.put('/:id', asyncErrorHandler(postUpdate));

/* DESTROY the /posts/:id */
router.delete('/:id', (req, res, next) => {
  res.send('this is to destroy the /posts/:id');
});

module.exports = router;
