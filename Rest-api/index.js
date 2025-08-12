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
      origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
      credentials: true,
      methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
      allowedHeaders: ['Content-Type','Authorization']
    }));
    app.options('*', cors({
      origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
      credentials: true,
      methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
      allowedHeaders: ['Content-Type','Authorization']
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
