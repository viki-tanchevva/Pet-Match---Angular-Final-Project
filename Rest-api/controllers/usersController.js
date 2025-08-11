const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const db = require('../db/db.json');

const dbFilePath = path.join(__dirname, '../db/db.json');

function saveDb() {
  fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2));
}

function getAllUsers(req, res) {
  res.json(db.users);
}

function getUserById(req, res) {
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
}

function registerUser(req, res) {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  const existing = db.users.find(u => u.email === email);
  if (existing) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const newUser = {
    id: uuidv4(),
    username,
    email,
    passwordHash: password,
    role: role || 'user',
    likedAnimals: [],
  };

  db.users.push(newUser);
  saveDb();

  res.status(201).json(newUser);
}

function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = db.users.find(u => u.email === email && u.passwordHash === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({ message: 'Login successful', user });
}

function updateUser(req, res) {
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { username, email, password, likedAnimals } = req.body;

  if (username !== undefined) user.username = username;
  if (email !== undefined) user.email = email;
  if (password !== undefined) user.passwordHash = password;
  if (likedAnimals !== undefined) user.likedAnimals = likedAnimals;

  saveDb();

  res.json(user);
}

function deleteUser(req, res) {
  const index = db.users.findIndex(u => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  const deleted = db.users.splice(index, 1);
  saveDb();

  res.json({ message: 'User deleted', user: deleted[0] });
}

function loginUser(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = db.users.find(u => u.email === email && u.passwordHash === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({ message: 'Login successful', user });
}

function getUserFavorites(req, res) {
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user.likedAnimals || []);
}

module.exports = {
  getAllUsers,
  getUserById,
  registerUser,
  loginUser,
  getUserFavorites,
  updateUser,
  deleteUser,
};
