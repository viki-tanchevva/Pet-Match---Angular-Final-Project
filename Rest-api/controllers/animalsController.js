// controllers/animalsController.js

const { v4: uuidv4 } = require('uuid');
const db = require('../db/db.json');
const fs = require('fs');
const path = require('path');

const dbFilePath = path.join(__dirname, '../db/db.json');

function saveDb() {
  fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2));
}

exports.getAllAnimals = (req, res) => {
  res.json(db.animals);
};

exports.getAnimalById = (req, res) => {
  const animal = db.animals.find(a => a.id === req.params.id);
  if (!animal) {
    return res.status(404).json({ message: 'Animal not found' });
  }
  res.json(animal);
};

exports.createAnimal = (req, res) => {
  const { name, age, type, description, imageUrl, location, addedByUserId } = req.body;

  if (!name || !age || !type) {
    return res.status(400).json({ message: 'Name, age and type are required' });
  }

  const newAnimal = {
    id: uuidv4(),
    name,
    age,
    type,
    description: description || '',
    imageUrl: imageUrl || '',
    location: location || '',
    addedByUserId: addedByUserId || null,
    likes: 0,
    adopted: false,
  };

  db.animals.push(newAnimal);
  saveDb();

  res.status(201).json(newAnimal);
};

exports.updateAnimal = (req, res) => {
  const animal = db.animals.find(a => a.id === req.params.id);
  if (!animal) {
    return res.status(404).json({ message: 'Animal not found' });
  }

  const { name, age, type, description, imageUrl, location, adopted } = req.body;

  if (name !== undefined) animal.name = name;
  if (age !== undefined) animal.age = age;
  if (type !== undefined) animal.type = type;
  if (description !== undefined) animal.description = description;
  if (imageUrl !== undefined) animal.imageUrl = imageUrl;
  if (location !== undefined) animal.location = location;
  if (adopted !== undefined) animal.adopted = adopted;

  saveDb();

  res.json(animal);
};

exports.deleteAnimal = (req, res) => {
  const index = db.animals.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Animal not found' });
  }

  const deleted = db.animals.splice(index, 1);
  saveDb();

  res.json({ message: 'Animal deleted', animal: deleted[0] });
};

exports.likeAnimal = (req, res) => {
  const animal = db.animals.find(a => a.id === req.params.id);
  if (!animal) {
    return res.status(404).json({ message: 'Animal not found' });
  }

  animal.likes = (animal.likes || 0) + 1;
  saveDb();

  res.json({ message: 'Animal liked', likes: animal.likes });
};
