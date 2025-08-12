const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const dbFilePath = path.join(__dirname, '../db/db.json');

function readDb() { return JSON.parse(fs.readFileSync(dbFilePath, 'utf-8')); }
function saveDb(db) { fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2)); }

// GET /api/animals
exports.getAllAnimals = (req, res) => {
  const db = readDb();
  res.json(db.animals);
};

// GET /api/animals/:id
exports.getAnimalById = (req, res) => {
  const db = readDb();
  const animal = db.animals.find(a => a.id === req.params.id);
  if (!animal) return res.status(404).json({ message: 'Animal not found' });
  res.json(animal);
};

// POST /api/animals  (Shelter)
exports.createAnimal = (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  if (req.user.role !== 'Shelter') return res.status(403).json({ message: 'Only Shelter can add animals' });

  const { name, age, type, description, imageUrl, location } = req.body || {};
  if (!name || !type || !imageUrl) return res.status(400).json({ message: 'name, type and imageUrl are required' });

  const db = readDb();
  const newAnimal = {
    id: uuidv4(),
    name,
    age: age ?? null,
    type,
    description: description ?? '',
    imageUrl,
    location: location ?? '',
    addedByUserId: req.user.id,
    likes: 0,
    adopted: false
  };
  db.animals.push(newAnimal);
  saveDb(db);
  res.status(201).json(newAnimal);
};

// PUT /api/animals/:id  (само собственик Shelter)
exports.updateAnimal = (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

  const db = readDb();
  const animal = db.animals.find(a => a.id === req.params.id);
  if (!animal) return res.status(404).json({ message: 'Animal not found' });
  if (req.user.role !== 'Shelter' || String(animal.addedByUserId) !== String(req.user.id)) {
    return res.status(403).json({ message: 'Not allowed' });
  }

  const { name, age, type, description, imageUrl, location, adopted } = req.body || {};
  if (name !== undefined) animal.name = name;
  if (age !== undefined) animal.age = age;
  if (type !== undefined) animal.type = type;
  if (description !== undefined) animal.description = description;
  if (imageUrl !== undefined) animal.imageUrl = imageUrl;
  if (location !== undefined) animal.location = location;
  if (adopted !== undefined) animal.adopted = adopted;

  saveDb(db);
  res.json(animal);
};

// DELETE /api/animals/:id  (само собственик Shelter)
exports.deleteAnimal = (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

  const db = readDb();
  const idx = db.animals.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Animal not found' });

  const animal = db.animals[idx];
  if (req.user.role !== 'Shelter' || String(animal.addedByUserId) !== String(req.user.id)) {
    return res.status(403).json({ message: 'Not allowed' });
  }

  db.animals.splice(idx, 1);
  saveDb(db);
  res.json({ ok: true });
};

// POST /api/animals/:id/like  (toggle за User)
exports.likeAnimal = (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

  const db = readDb();
  const animal = db.animals.find(a => a.id === req.params.id);
  if (!animal) return res.status(404).json({ message: 'Animal not found' });

  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.likedAnimals = user.likedAnimals || [];
  const has = user.likedAnimals.includes(animal.id);
  if (has) {
    user.likedAnimals = user.likedAnimals.filter(id => id !== animal.id);
    animal.likes = Math.max(0, (animal.likes || 0) - 1);
  } else {
    user.likedAnimals.push(animal.id);
    animal.likes = (animal.likes || 0) + 1;
  }

  saveDb(db);
  res.json({ likes: animal.likes, liked: !has, likedAnimals: user.likedAnimals });
};

// GET /api/animals/mine  (Shelter)
exports.getMyAnimals = (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  if (req.user.role !== 'Shelter') return res.status(403).json({ message: 'Only Shelter has "my animals"' });

  const db = readDb();
  const my = db.animals.filter(a => String(a.addedByUserId) === String(req.user.id));
  res.json(my);
};
