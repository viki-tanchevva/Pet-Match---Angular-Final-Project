const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const routes = require('./routes'); // импорт на index.js с всички рутери

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Регистриране на рутерите
app.use('/api/animals', routes.animalsRouter);
app.use('/api/users', routes.usersRouter);
app.use('/api/adoptionRequests', routes.adoptionRequestsRouter);
app.use('/api/auth', routes.authRouter);
app.use('/api/favorites', routes.favoritesRouter);
app.use('/api/shelters', routes.sheltersRouter);
app.use('/api/reviews', routes.reviewsRouter);
app.use('/api/matches', routes.matchesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
