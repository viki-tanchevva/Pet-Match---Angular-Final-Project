const fs = require('fs');
const path = require('path');

const dbFilePath = path.join(__dirname, '../db/db.json');

function readDb() { return JSON.parse(fs.readFileSync(dbFilePath, 'utf-8')); }
function saveDb(db) { fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2)); }

function getFavorites(req, res) {
  const db = readDb();
  const userId = (req.user && req.user.id) || req.params.userId;
  if (!userId) return res.status(401).json({ message: 'Not authenticated' });

  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const liked = new Set(user.likedAnimals || []);
  const favorites = db.animals.filter(a => liked.has(a.id));
  res.json(favorites);
}

function addFavorite(req, res) {
  const db = readDb();
  const userId = (req.user && req.user.id) || req.params.userId;
  const animalId = req.body?.animalId || req.params.animalId;

  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.likedAnimals = user.likedAnimals || [];
  if (!user.likedAnimals.includes(animalId)) user.likedAnimals.push(animalId);

  saveDb(db);
  res.json({ message: 'Added to favorites', likedAnimals: user.likedAnimals });
}

function removeFavorite(req, res) {
  const db = readDb();
  const userId = (req.user && req.user.id) || req.params.userId;
  const animalId = req.body?.animalId || req.params.animalId;

  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.likedAnimals = (user.likedAnimals || []).filter(id => id !== animalId);
  saveDb(db);
  res.json({ message: 'Removed from favorites', likedAnimals: user.likedAnimals });
}

module.exports = { getFavorites, addFavorite, removeFavorite };
