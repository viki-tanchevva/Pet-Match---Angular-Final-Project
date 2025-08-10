const express = require('express');
const router = express.Router();
const { animalsController } = require('../controllers');

// Създаване на ново животно
router.post('/', animalsController.createAnimal);

// Вземи всички животни (с възможност за филтриране по тип, име и т.н.)
router.get('/', animalsController.getAllAnimals);

// Вземи животно по ID
router.get('/:id', animalsController.getAnimalById);

// Обнови животно по ID
router.put('/:id', animalsController.updateAnimal);

// Изтрий животно по ID
router.delete('/:id', animalsController.deleteAnimal);

router.post('/:id/like', animalsController.likeAnimal);

module.exports = router;
