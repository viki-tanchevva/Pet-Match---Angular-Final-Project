const express = require('express');
const router = express.Router();
const { favoritesController } = require('../controllers');


// Добавяне в любими
router.post('/:userId/add/:animalId', favoritesController.addFavorite);

// Премахване от любими
router.delete('/:userId/remove/:animalId', favoritesController.removeFavorite);

// Връщане на любими животни на потребител
router.get('/:userId', favoritesController.getFavorites);

module.exports = router;
