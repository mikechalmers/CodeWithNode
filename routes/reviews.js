/*jshint esversion: 6 */
const express = require('express');
const router = express.Router({ mergeParams: true }); //merge params allows me to look up the post i.e. the :id of the overall post from the URL
const {
  asyncErrorHandler,
  isReviewAuthor
 } = require('../middleware');
const {
    reviewCreate,
    reviewUpdate,
    reviewDestroy
} = require('../controllers/reviews');

/* POST new review /posts/:id/reviews */
router.post('/', asyncErrorHandler(reviewCreate));

/* PUT update /posts/:id/reviews/:review_id */
router.put('/:review_id', isReviewAuthor, asyncErrorHandler(reviewUpdate));

/* DESTROY the /posts/:id/reviews/:review_id */
router.delete('/:review_id', isReviewAuthor, asyncErrorHandler(reviewDestroy));

module.exports = router;
