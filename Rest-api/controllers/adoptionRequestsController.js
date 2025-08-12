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

function createRequest(req, res) {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

  const { animalId, message } = req.body || {};
  if (!animalId) return res.status(400).json({ message: 'animalId is required' });

  const db = readDb();
  const animal = db.animals.find(a => a.id === animalId);
  if (!animal) return res.status(404).json({ message: 'Animal not found' });

  db.adoptionRequests = ensureArray(db.adoptionRequests);

  const duplicate = db.adoptionRequests.find(r =>
    String(r.userId) === String(req.user.id) &&
    String(r.animalId) === String(animalId) &&
    r.status !== 'Declined'
  );
  if (duplicate) return res.status(409).json({ message: 'Already applied' });

  const id = require('uuid').v4();
  const newReq = {
    id,
    animalId,
    userId: req.user.id,
    shelterId: animal.addedByUserId || null,
    message: message || '',
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.adoptionRequests.push(newReq);
  saveDb(db);
  res.status(201).json(newReq);
}

function getMyRequests(req, res) {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  const db = readDb();
  const list = ensureArray(db.adoptionRequests).filter(r => String(r.userId) === String(req.user.id));
  const animalsById = new Map(db.animals.map(a => [a.id, a]));
  const withAnimal = list.map(r => ({ ...r, animal: animalsById.get(r.animalId) || null }));
  res.json(withAnimal);
}

function getForShelter(req, res) {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  if (req.user.role !== 'Shelter') return res.status(403).json({ message: 'Only Shelter can view this' });

  const db = readDb();
  const list = ensureArray(db.adoptionRequests).filter(r => String(r.shelterId) === String(req.user.id));
  const animalsById = new Map(db.animals.map(a => [a.id, a]));
  const withAnimal = list.map(r => ({ ...r, animal: animalsById.get(r.animalId) || null }));
  res.json(withAnimal);
}

function updateStatus(req, res) {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  if (req.user.role !== 'Shelter') return res.status(403).json({ message: 'Only Shelter can update status' });

  const { id } = req.params;
  const { status } = req.body || {};
  if (!['Pending', 'Approved', 'Declined'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const db = readDb();
  const idx = ensureArray(db.adoptionRequests).findIndex(r => r.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Request not found' });

  const reqItem = db.adoptionRequests[idx];
  if (String(reqItem.shelterId) !== String(req.user.id)) {
    return res.status(403).json({ message: 'Not allowed' });
  }

  reqItem.status = status;
  reqItem.updatedAt = new Date().toISOString();

  if (status === 'Approved') {
    const aIdx = db.animals.findIndex(a => String(a.id) === String(reqItem.animalId));
    if (aIdx !== -1) db.animals[aIdx].adopted = true;
  }

  saveDb(db);
  res.json(reqItem);
}

function removeRequest(req, res) {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

  const { id } = req.params;
  const db = readDb();
  const list = ensureArray(db.adoptionRequests);
  const idx = list.findIndex(r => r.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Request not found' });

  const item = list[idx];
  const isOwnerUser = String(item.userId) === String(req.user.id);
  const isOwnerShelter = req.user.role === 'Shelter' && String(item.shelterId) === String(req.user.id);
  if (!isOwnerUser && !isOwnerShelter) return res.status(403).json({ message: 'Not allowed' });

  list.splice(idx, 1);
  db.adoptionRequests = list;
  saveDb(db);
  res.json({ ok: true });
}

module.exports = {
  createRequest,
  getMyRequests,
  getForShelter,
  updateStatus,
  removeRequest
};
