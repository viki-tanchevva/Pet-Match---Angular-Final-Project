const db = require('../db/db.json');
const { v4: uuidv4 } = require('uuid');

// Вземане на всички приюти (потребители с роля shelter)
function getAllShelters(req, res) {
  const shelters = db.users.filter(u => u.role === 'shelter');
  res.json(shelters);
}

// Вземане на конкретен приют по id
function getShelterById(req, res) {
  const { id } = req.params;
  const shelter = db.users.find(u => u.id === id && u.role === 'shelter');
  if (!shelter) return res.status(404).json({ message: 'Shelter not found' });
  res.json(shelter);
}

// Създаване на приют (регистрация с роля shelter)
function createShelter(req, res) {
  // Може да използваш логиката от authController.register
  // или да я направиш отделно
  res.status(501).json({ message: 'Not implemented' });
}

// Актуализация на приют
function updateShelter(req, res) {
  res.status(501).json({ message: 'Not implemented' });
}

// Изтриване на приют
function deleteShelter(req, res) {
  res.status(501).json({ message: 'Not implemented' });
}

module.exports = {
  getAllShelters,
  getShelterById,
  createShelter,
  updateShelter,
  deleteShelter,
};
