const db = require('../db/db.json');
const { v4: uuidv4 } = require('uuid');

function getReviewsForShelter(req, res) {
  const { shelterId } = req.params;
  const reviews = db.reviews.filter(r => r.shelterId === shelterId);
  res.json(reviews);
}

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

  res.status(201).json(newReview);
}

function updateReview(req, res) {
  res.status(501).json({ message: 'Not implemented' });
}

function deleteReview(req, res) {
  res.status(501).json({ message: 'Not implemented' });
}

module.exports = {
  getReviewsForShelter,
  createReview,
  updateReview,
  deleteReview,
};
