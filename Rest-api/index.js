global.__basedir = __dirname;
require('dotenv').config();

const config = require('./config/config');
const dbConnector = require('./config/db');
const apiRouter = require('./router');

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dbConnector()
  .then(() => {
    const app = express();

    app.use(cors({
      origin: function (origin, callback) {
        const allowed = ['http://localhost:4200', 'http://127.0.0.1:4200'];
        if (!origin || allowed.includes(origin)) return callback(null, true);
        callback(new Error('Not allowed by CORS: ' + origin));
      },
      credentials: true
    }));

    app.use(express.json());
    app.use(cookieParser(process.env.COOKIESECRET || 'SoftUni'));

    app.use('/api', apiRouter);

    const { errorHandler } = require('./utils');
    if (errorHandler) app.use(errorHandler);

    const port = config.port || 3000;
    app.listen(port, () => console.log(`API running on http://localhost:${port}`));
  })
  .catch(console.error);
