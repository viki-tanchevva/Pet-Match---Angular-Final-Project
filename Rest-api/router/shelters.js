const express = require('express');
const router = express.Router();
const sheltersController = require('../controllers/sheltersController'); // ← това оправя грешката

router.get('/', sheltersController.getAllShelters);

router.get('/:id', sheltersController.getShelterById);

router.post('/', sheltersController.createShelter);

router.put('/:id', sheltersController.updateShelter);

router.delete('/:id', sheltersController.deleteShelter);

module.exports = router;
