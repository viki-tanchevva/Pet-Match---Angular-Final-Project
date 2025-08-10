const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');

// Списък отзиви за приют
router.get('/shelter/:shelterId', reviewsController.getReviewsForShelter);

// Добавяне на отзив
router.post('/', reviewsController.createReview);

// Редакция на отзив
router.put('/:id', reviewsController.updateReview);

// Изтриване на отзив
router.delete('/:id', reviewsController.deleteReview);

module.exports = router;
