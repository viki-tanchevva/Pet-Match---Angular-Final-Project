const express = require('express');
const router = express.Router();
const { usersController } = require('../controllers');

router.post('/register', usersController.registerUser);

router.post('/login', usersController.loginUser);

router.get('/', usersController.getAllUsers);

router.get('/:id', usersController.getUserById);

router.get('/:id/favorites', usersController.getUserFavorites);

router.put('/:id', usersController.updateUser);

router.delete('/:id', usersController.deleteUser);

module.exports = router;
