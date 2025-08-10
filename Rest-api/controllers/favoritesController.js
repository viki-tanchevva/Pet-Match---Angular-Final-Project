const db = require('../db/db.json');

// Добавяне на животно към любими
function addFavorite(req, res) {
  const userId = req.user.id;  // взето от authMiddleware
  const { animalId } = req.body;

  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (!user.likedAnimals.includes(animalId)) {
    user.likedAnimals.push(animalId);
    // Запиши промените, ако ползваш файлова база
  }

  res.json({ message: 'Added to favorites', likedAnimals: user.likedAnimals });
}

// Премахване от любими
function removeFavorite(req, res) {
  const userId = req.user.id;
  const { animalId } = req.body;

  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.likedAnimals = user.likedAnimals.filter(id => id !== animalId);
  // Запиши промените

  res.json({ message: 'Removed from favorites', likedAnimals: user.likedAnimals });
}

// Вземане на любими животни
function getFavorites(req, res) {
  const userId = req.user.id;

  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const favorites = db.animals.filter(a => user.likedAnimals.includes(a.id));

  res.json(favorites);
}

module.exports = {
  addFavorite,
  removeFavorite,
  getFavorites,
};
