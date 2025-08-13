const express = require('express');
const router = express.Router();

const auth = require('../utils/auth');
const { usersController } = require('../controllers');

router.get('/me', auth(), usersController.getMe);
router.put('/me', auth(), usersController.updateMe);
router.put('/password', auth(), usersController.changePassword);

module.exports = router;
