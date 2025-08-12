const express = require('express');
const router = express.Router();

const auth = require('../utils/auth');
const { adoptionRequestsController } = require('../controllers');

router.post('/', auth(), adoptionRequestsController.createRequest);

router.get('/mine', auth(), adoptionRequestsController.getMyRequests);

router.get('/for-shelter', auth(), adoptionRequestsController.getForShelter);

router.patch('/:id', auth(), adoptionRequestsController.updateStatus);

router.delete('/:id', auth(), adoptionRequestsController.removeRequest);

module.exports = router;
