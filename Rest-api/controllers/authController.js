const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { createToken } = require('../utils/jwt');
const { authCookieName } = require('../app-config');

const dbFilePath = path.join(__dirname, '../db/db.json');

function readDb() {
  return JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));
}
function saveDb(db) {
  fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2));
}
function normalizeRole(role) {
  const r = String(role || '').toLowerCase();
  if (r === 'shelter') return 'Shelter';
  return 'User';
}

async function register(req, res) {
  try {
    const { username, email, password, rePassword, role } = req.body || {};
    if (!username || !email || !password) return res.status(400).json({ message: 'Missing required fields' });
    if (rePassword !== undefined && rePassword !== password) return res.status(400).json({ message: 'Passwords do not match' });
    const db = readDb();
    const exists = db.users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
    if (exists) return res.status(409).json({ message: 'Email already in use' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
      id: require('crypto').randomUUID(),
      username,
      email,
      passwordHash,
      role: normalizeRole(role),
      likedAnimals: []
    };
    db.users.push(user);
    saveDb(db);
    const token = createToken({ id: user.id, role: user.role, email: user.email, username: user.username });
    res.cookie(authCookieName, token, { httpOnly: true, sameSite: 'lax', secure: false });
    return res.json({ _id: user.id, username: user.username, email: user.email, role: user.role, likedAnimals: user.likedAnimals });
  } catch (_err) {
    return res.status(500).json({ message: 'Registration failed' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });
    const db = readDb();
    const user = db.users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = createToken({ id: user.id, role: normalizeRole(user.role), email: user.email, username: user.username });
    res.cookie(authCookieName, token, { httpOnly: true, sameSite: 'lax', secure: false });
    return res.json({ _id: user.id, username: user.username, email: user.email, role: normalizeRole(user.role), likedAnimals: user.likedAnimals || [] });
  } catch (_err) {
    return res.status(500).json({ message: 'Login failed' });
  }
}

function profile(req, res) {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  const db = readDb();
  const full = db.users.find(u => String(u.id) === String(req.user.id));
  const role = normalizeRole(full?.role || req.user.role);
  const likedAnimals = Array.isArray(full?.likedAnimals) ? full.likedAnimals : [];
  return res.json({ _id: req.user.id, username: req.user.username, email: req.user.email, role, likedAnimals });
}

function logout(req, res) {
  res.clearCookie(authCookieName, { sameSite: 'lax', secure: false });
  return res.json({ message: 'Logged out' });
}

module.exports = { register, login, logout, profile };
