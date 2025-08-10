const fs = require('fs');
const path = require('path');
const usersDb = require('../db/db.json'); // Или твоята реална база
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'some_secret_key'; // замени със собствен ключ
const dbPath = path.join(__dirname, '../db/db.json');

// Регистрация
async function register(req, res) {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const userExists = usersDb.users.find(u => u.email === email);
  if (userExists) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: uuidv4(),
    username,
    email,
    passwordHash,
    role: role === 'User' || role === 'Shelter' ? role : 'User',
    likedAnimals: []
  };

  usersDb.users.push(newUser);

  // Запис във файла (файлова база)
  try {
    fs.writeFileSync(dbPath, JSON.stringify(usersDb, null, 2));
  } catch (err) {
    return res.status(500).json({ message: 'Failed to save user' });
  }

  const { id, username: uname, email: mail, role: userRole } = newUser;
  res.status(201).json({ _id: id, username: uname, email: mail, role: userRole });
}

// Вход
async function login(req, res) {
  const { email, password } = req.body;

  const user = usersDb.users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

  res.json({
    _id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    token
  });
}

// Изход
function logout(req, res) {
  // JWT: Клиентът просто изтрива токена
  res.json({ message: 'Logged out' });
}

module.exports = {
  register,
  login,
  logout,
};
