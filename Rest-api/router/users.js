const express = require('express');
const router = express.Router();
const { usersController } = require('../controllers');

// Регистрация на потребител
router.post('/register', usersController.registerUser);

// Вход на потребител
router.post('/login', usersController.loginUser);

// Вземи всички потребители (по избор – само за админ/тестове)
router.get('/', usersController.getAllUsers);

// Вземи конкретен потребител по ID
router.get('/:id', usersController.getUserById);

// Харесани животни на потребител
router.get('/:id/favorites', usersController.getUserFavorites);

// Обновяване на информация за потребител
router.put('/:id', usersController.updateUser);

// Изтриване на потребител
router.delete('/:id', usersController.deleteUser);

module.exports = router;
