const fs = require('fs');
const path = require('path');

let bcrypt = null;
try { bcrypt = require('bcryptjs'); } catch (_) {}

const dbFilePath = path.join(__dirname, '../db/db.json');

function readDb() {
  try { return JSON.parse(fs.readFileSync(dbFilePath, 'utf-8')); }
  catch { return { users: [] }; }
}
function saveDb(db) { fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2)); }
function ensureArray(arr) { return Array.isArray(arr) ? arr : []; }
function sanitizeUser(u) { if (!u) return null; const { password, passwordHash, ...rest } = u; return rest; }

function requestUserId(req) {
  return (
    req.user?._id ||
    req.user?.id ||
    req.cookies?.userId ||
    req.session?.userId ||
    req.headers['x-user-id'] ||
    null
  );
}
function findUserById(db, id) {
  return ensureArray(db.users).find(u => String(u._id || u.id) === String(id)) || null;
}

function getMe(req, res) {
  const id = requestUserId(req);
  if (!id) return res.status(401).json({ message: 'Not authenticated' });
  const db = readDb();
  const user = findUserById(db, id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(sanitizeUser(user));
}

function updateMe(req, res) {
  const id = requestUserId(req);
  if (!id) return res.status(401).json({ message: 'Not authenticated' });

  const db = readDb();
  const users = ensureArray(db.users);
  const idx = users.findIndex(u => String(u._id || u.id) === String(id));
  if (idx === -1) return res.status(404).json({ message: 'User not found' });

  const { username, email } = req.body || {};
  const user = users[idx];

  if (username !== undefined) user.username = String(username);
  if (email !== undefined) user.email = String(email);

  users[idx] = user;
  db.users = users;
  saveDb(db);
  res.json(sanitizeUser(user));
}

async function changePassword(req, res) {
  const id = requestUserId(req);
  if (!id) return res.status(401).json({ message: 'Not authenticated' });

  const body = req.body || {};
  const current =
    (body.currentPassword ?? body.oldPassword ?? body.passwordCurrent ?? body.password ?? '').toString().trim();
  const next =
    (body.newPassword ?? body.password ?? body.newPass ?? '').toString().trim();

  if (!current || !next) {
    return res.status(400).json({ message: 'currentPassword and newPassword are required' });
  }

  const db = readDb();
  const users = ensureArray(db.users);
  const idx = users.findIndex(u => String(u._id || u.id) === String(id));
  if (idx === -1) return res.status(404).json({ message: 'User not found' });

  const user = users[idx];
  const stored = (user.passwordHash || user.password || '').toString();

  let ok = false;
  const looksHashed = /^\$2[aby]\$/.test(stored);
  if (looksHashed) {
    if (!bcrypt) {
      return res.status(500).json({ message: 'Password hashing module not available' });
    }
    try { ok = await bcrypt.compare(current, stored); } catch { ok = false; }
  } else {
    ok = current === stored;
  }

  if (!ok) return res.status(400).json({ message: 'Current password is incorrect' });

  if (looksHashed && bcrypt) {
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(next, salt);
  } else {
    user.password = next;
  }

  users[idx] = user;
  db.users = users;
  saveDb(db);
  res.json({ ok: true });
}

module.exports = {
  getMe,
  updateMe,
  changePassword,
};
