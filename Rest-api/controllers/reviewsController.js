const db = require('../db/db.json');
const { v4: uuidv4 } = require('uuid');

// Вземане на отзиви за приют
function getReviewsForShelter(req, res) {
  const { shelterId } = req.params;
  const reviews = db.reviews.filter(r => r.shelterId === shelterId);
  res.json(reviews);
}

// Създаване на нов отзив
function createReview(req, res) {
  const { shelterId, userId, content, rating } = req.body;
  if (!shelterId || !userId || !content || !rating) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const newReview = {
    id: uuidv4(),
    shelterId,
    userId,
    content,
    rating,
    createdAt: new Date(),
  };

  db.reviews.push(newReview);
  // Запиши промените в db.json

  res.status(201).json(newReview);
}

// Актуализация на отзив
function updateReview(req, res) {
  res.status(501).json({ message: 'Not implemented' });
}

// Изтриване на отзив
function deleteReview(req, res) {
  res.status(501).json({ message: 'Not implemented' });
}

module.exports = {
  getReviewsForShelter,
  createReview,
  updateReview,
  deleteReview,
};
