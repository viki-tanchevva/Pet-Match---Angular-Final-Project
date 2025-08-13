const fs = require('fs');
const path = require('path');

const dbFilePath = path.join(__dirname, '../db/db.json');

function readDb() {
  return JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));
}
function saveDb(db) {
  fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2));
}
function ensureArray(arr) {
  return Array.isArray(arr) ? arr : [];
}
function sanitizeUser(u) {
  if (!u) return null;
  const { password, ...rest } = u;
  return rest;
}

function getMe(req, res) {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  const db = readDb();
  const user = ensureArray(db.users).find(u => String(u.id) === String(req.user.id));
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(sanitizeUser(user));
}

function updateMe(req, res) {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  const { username, email } = req.body || {};

  const db = readDb();
  const idx = ensureArray(db.users).findIndex(u => String(u.id) === String(req.user.id));
  if (idx === -1) return res.status(404).json({ message: 'User not found' });

  const user = db.users[idx];

  if (username !== undefined) user.username = String(username);
  if (email !== undefined) user.email = String(email);

  db.users[idx] = user;
  saveDb(db);
  res.json(sanitizeUser(user));
}

function changePassword(req, res) {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) return res.status(400).json({ message: 'currentPassword and newPassword are required' });

  const db = readDb();
  const idx = ensureArray(db.users).findIndex(u => String(u.id) === String(req.user.id));
  if (idx === -1) return res.status(404).json({ message: 'User not found' });

  const user = db.users[idx];
  if (String(user.password) !== String(currentPassword)) {
    return res.status(400).json({ message: 'Current password is incorrect' });
  }
  user.password = String(newPassword);
  db.users[idx] = user;
  saveDb(db);
  res.json({ ok: true });
}

module.exports = {
  getMe,
  updateMe,
  changePassword,
};
