const express = require('express');
const router = express.Router();
const sheltersController = require('../controllers/sheltersController'); // ← това оправя грешката

// Списък на приюти
router.get('/', sheltersController.getAllShelters);

// Детайли за приют
router.get('/:id', sheltersController.getShelterById);

// Добавяне нов приют (за админ/модератор)
router.post('/', sheltersController.createShelter);

// Редакция на приют
router.put('/:id', sheltersController.updateShelter);

// Изтриване на приют
router.delete('/:id', sheltersController.deleteShelter);

module.exports = router;
