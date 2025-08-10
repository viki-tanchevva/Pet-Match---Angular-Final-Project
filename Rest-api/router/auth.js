const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');


// Регистрация
router.post('/register', authController.register);

// Вход
router.post('/login', authController.login);

// Изход (ако сесии/токени)
router.post('/logout', authController.logout);

module.exports = router;
