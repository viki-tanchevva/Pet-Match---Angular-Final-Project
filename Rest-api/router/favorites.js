const express = require('express');
const router = express.Router();
const { favoritesController } = require('../controllers');

router.post('/:userId/add/:animalId', favoritesController.addFavorite);

router.delete('/:userId/remove/:animalId', favoritesController.removeFavorite);

router.get('/:userId', favoritesController.getFavorites);

module.exports = router;
