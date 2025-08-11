const express = require('express');
const router = express.Router();
const { adoptionRequestsController } = require('../controllers');

router.post('/', adoptionRequestsController.createRequest);

router.get('/', adoptionRequestsController.getAllRequests);

router.get('/:id', adoptionRequestsController.getRequestById);

router.put('/:id', adoptionRequestsController.updateRequestStatus);

router.delete('/:id', adoptionRequestsController.deleteRequest);

module.exports = router;
