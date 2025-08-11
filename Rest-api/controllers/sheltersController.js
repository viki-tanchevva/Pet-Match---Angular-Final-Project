const db = require('../db/db.json');
const { v4: uuidv4 } = require('uuid');

function getAllShelters(req, res) {
  const shelters = db.users.filter(u => u.role === 'shelter');
  res.json(shelters);
}

function getShelterById(req, res) {
  const { id } = req.params;
  const shelter = db.users.find(u => u.id === id && u.role === 'shelter');
  if (!shelter) return res.status(404).json({ message: 'Shelter not found' });
  res.json(shelter);
}

function createShelter(req, res) {
  res.status(501).json({ message: 'Not implemented' });
}

function updateShelter(req, res) {
  res.status(501).json({ message: 'Not implemented' });
}

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
