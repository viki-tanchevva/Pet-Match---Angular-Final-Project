const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { createToken } = require('../utils/jwt');
const { authCookieName } = require('../app-config');

const dbFilePath = path.join(__dirname, '../db/db.json');

function readDb() { return JSON.parse(fs.readFileSync(dbFilePath, 'utf-8')); }
function saveDb(db) { fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2)); }

async function register(req, res) {
  const { username, email, password, role } = req.body || {};
  if (!username || !email || !password) return res.status(400).json({ message: 'Missing required fields' });

  const db = readDb();
  if (db.users.some(u => u.email === email)) return res.status(409).json({ message: 'Email already exists' });

  const id = require('uuid').v4();
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id, username, email, passwordHash, role: role || 'User', likedAnimals: [] };
  db.users.push(user); saveDb(db);
  res.status(201).json({ _id: id, username, email, role: user.role });
}

async function login(req, res) {
  const { email, password } = req.body || {};
  const db = readDb();
  const user = db.users.find(u => u.email === email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const token = createToken({ id: user.id, role: user.role, email: user.email, username: user.username });
  res.cookie(authCookieName, token, { httpOnly: true, sameSite: 'lax', secure: false });
  res.json({ _id: user.id, username: user.username, email: user.email, role: user.role });
}

function profile(req, res) {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  res.json({ _id: req.user._id, username: req.user.username, email: req.user.email, role: req.user.role });
}

function logout(req, res) {
  res.clearCookie(authCookieName, { sameSite: 'lax', secure: false });
  res.json({ message: 'Logged out' });
}

module.exports = { register, login, logout, profile };
