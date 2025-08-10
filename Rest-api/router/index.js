const express = require('express');
const router = express.Router();

const animals = require('./animals.js');
const users = require('./users.js');
const adoptionRequests = require('./adoptionRequest.js');
const auth = require('./auth.js');
const favorites = require('./favorites.js');
const shelters = require('./shelters.js');
const reviews = require('./reviews.js');
const matches = require('./matches.js');

router.use('/animals', animals);
router.use('/users', users);
router.use('/adoptionRequests', adoptionRequests);
router.use('/auth', auth);
router.use('/favorites', favorites);
router.use('/shelters', shelters);
router.use('/reviews', reviews);
router.use('/matches', matches);

module.exports = router;