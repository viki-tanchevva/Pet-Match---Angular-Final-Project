const express = require('express');
const router = express.Router();
const matchesController = require('../controllers/matchesController');

router.get('/:userId/recommendations', matchesController.getRecommendations);

router.post('/:userId/match/:animalId', matchesController.createMatch);

module.exports = router;
