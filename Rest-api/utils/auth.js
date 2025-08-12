const { verifyToken } = require('./jwt');
const { authCookieName } = require('../app-config');
const fs = require('fs');
const path = require('path');

const dbFilePath = path.join(__dirname, '../db/db.json');

function readDb() {
  return JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));
}

function auth(redirectUnauthenticated = true) {
  return async function (req, res, next) {
    try {
      const token = req.cookies[authCookieName];
      if (!token) {
        if (redirectUnauthenticated) return res.status(401).json({ message: 'Not authenticated' });
        return next();
      }
      const payload = await verifyToken(token); 
      const db = readDb();
      const user = db.users.find(u => String(u.id) === String(payload.id));
      if (!user) return res.status(401).json({ message: 'Invalid token!' });

      req.user = {
        id: user.id,
        _id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      };
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token!' });
    }
  };
}

module.exports = auth;
