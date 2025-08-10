const express = require('express');
const router = express.Router();
const matchesController = require('../controllers/matchesController');

// Връщане на препоръчани животни (match logic)
router.get('/:userId/recommendations', matchesController.getRecommendations);

// Записване на match (ако се налага)
router.post('/:userId/match/:animalId', matchesController.createMatch);

module.exports = router;
