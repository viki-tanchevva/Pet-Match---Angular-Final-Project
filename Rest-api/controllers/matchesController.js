const db = require('../db/db.json');

function getRecommendations(req, res) {
  const userId = req.user.id;
  const animals = db.animals.filter(a => !a.adopted);
  res.json(animals);
}

function createMatch(req, res) {
  res.status(501).json({ message: 'Not implemented' });
}

module.exports = {
  getRecommendations,
  createMatch,
};
