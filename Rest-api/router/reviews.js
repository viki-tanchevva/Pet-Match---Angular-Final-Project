const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');

router.get('/shelter/:shelterId', reviewsController.getReviewsForShelter);

router.post('/', reviewsController.createReview);

router.put('/:id', reviewsController.updateReview);

router.delete('/:id', reviewsController.deleteReview);

module.exports = router;
