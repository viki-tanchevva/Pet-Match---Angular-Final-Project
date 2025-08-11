const express = require('express');
const router = express.Router();
const { animalsController } = require('../controllers');

router.post('/', animalsController.createAnimal);

router.get('/', animalsController.getAllAnimals);

router.get('/:id', animalsController.getAnimalById);

router.put('/:id', animalsController.updateAnimal);

router.delete('/:id', animalsController.deleteAnimal);

router.post('/:id/like', animalsController.likeAnimal);

module.exports = router;
