const express = require('express');
const router = express.Router();
const { adoptionRequestsController } = require('../controllers');

// Създаване на заявка за осиновяване
router.post('/', adoptionRequestsController.createRequest);

// Вземи всички заявки (може да се филтрират според потребител или животно)
router.get('/', adoptionRequestsController.getAllRequests);

// Вземи конкретна заявка по ID
router.get('/:id', adoptionRequestsController.getRequestById);

// Обнови статус на заявка (напр. одобрена/отказана)
router.put('/:id', adoptionRequestsController.updateRequestStatus);

// Изтрий заявка
router.delete('/:id', adoptionRequestsController.deleteRequest);

module.exports = router;
