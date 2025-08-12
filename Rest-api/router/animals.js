const express = require('express');
const router = express.Router();
const { animalsController, favoritesController } = require('../controllers');
const auth = require('../utils/auth');

router.post('/', auth(), animalsController.createAnimal);
router.get('/', animalsController.getAllAnimals);

router.get('/favorites', auth(), favoritesController.getFavorites);
router.get('/mine', auth(), animalsController.getMyAnimals);

router.get('/:id', animalsController.getAnimalById);
router.put('/:id', auth(), animalsController.updateAnimal);
router.delete('/:id', auth(), animalsController.deleteAnimal);

router.post('/:id/like', auth(), animalsController.likeAnimal);

module.exports = router;
