const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');
const auth = require('../utils/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// за Angular – зареждане на текущия потребител
router.get('/profile', auth(), authController.profile);

module.exports = router;
