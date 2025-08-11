const express = require('express');
const router = express.Router();
const Animal = require('../models/animal'); 
const { isAuthenticated } = require('../middleware/auth');

router.post('/:id/like', isAuthenticated, async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    if (!animal) {
      return res.status(404).json({ message: 'Animal not found' });
    }

    const userId = req.user._id; 

    if (animal.likedBy.includes(userId.toString())) {
      return res.status(400).json({ message: 'Already liked' });
    }

    animal.likedBy.push(userId);
    animal.likes = animal.likedBy.length;
    await animal.save();

    res.json({ message: 'Liked', likes: animal.likes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
