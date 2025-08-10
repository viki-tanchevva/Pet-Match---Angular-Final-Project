const db = require('../db/db.json');

// Вземане на препоръки (match) за даден потребител
function getRecommendations(req, res) {
  const userId = req.user.id;
  // Тук може да се сложи логика с тестове и филтриране, но за момента връщаме животни, които не са осиновени
  const animals = db.animals.filter(a => !a.adopted);
  res.json(animals);
}

// Създаване на match (ако е нужно)
function createMatch(req, res) {
  res.status(501).json({ message: 'Not implemented' });
}

module.exports = {
  getRecommendations,
  createMatch,
};
