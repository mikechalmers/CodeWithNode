/*jshint esversion: 6 */
const express                     = require('express');
const router                      = express.Router();
const multer                      = require('multer');
const {cloudinary, storage}       = require('../cloudinary');
const upload                      = multer({ storage });
const { asyncErrorHandler,
        isLoggedIn
      }       = require('../middleware');
const { postIndex,
        postNew,
        postCreate,
        postShow,
        postEdit,
        postUpdate,
        postDestroy
      } = require('../controllers/posts');

/* GET posts index /posts */
router.get('/', asyncErrorHandler(postIndex));

/* GET new post /posts/new */
router.get('/new', isLoggedIn, postNew);

/* POST new Create /posts */
router.post('/', isLoggedIn, upload.array('images', 4), asyncErrorHandler(postCreate));

/* GET SHOW page /posts/:id */
router.get('/:id', asyncErrorHandler(postShow));

/* GET edit post /posts/:id/edit */
router.get('/:id/edit', asyncErrorHandler(postEdit));

/* PUT update /posts/:id */
router.put('/:id', upload.array('images', 4), asyncErrorHandler(postUpdate));

/* DESTROY the /posts/:id */
router.delete('/:id', asyncErrorHandler(postDestroy));

module.exports = router;
