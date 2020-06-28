/*jshint esversion: 6 */
const express = require('express');
const router = express.Router({ mergeParams: true }); //merge params allows me to look up the post i.e. the :id of the overall post from the URL

/* GET reviews index /posts/:id/reviews */
router.get('/', (req, res, next) => {
  res.send('this is the posts/:id/reviews page');
});

/* POST new review /posts/:id/reviews */
router.post('/', (req, res, next) => {
  res.send('this is the post new review to posts/:id/reviews page');
});

/* GET edit review /posts/:id/reviews/:review_id/edit */
router.get('/:review_id/edit', (req, res, next) => {
  res.send('this is to edit the posts/:id/reviews/:review_id content');
});

/* PUT update /posts/:id/reviews/:review_id */
router.put('/:review_id', (req, res, next) => {
  res.send('this is to update the posts/:id/reviews/:review_id content');
});

/* DESTROY the /posts/:id/reviews/:review_id */
router.delete('/:review_id', (req, res, next) => {
  res.send('this is to destroy the posts/:id/reviews/:review_id');
});

module.exports = router;
