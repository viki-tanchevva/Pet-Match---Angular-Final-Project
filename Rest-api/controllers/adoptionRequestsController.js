const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const db = require('../db/db.json');

const dbFilePath = path.join(__dirname, '../db/db.json');

function saveDb() {
  fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2));
}

exports.getAllRequests = (req, res) => {
  res.json(db.adoptionRequests);
};

exports.getRequestById = (req, res) => {
  const request = db.adoptionRequests.find(r => r.id === req.params.id);
  if (!request) {
    return res.status(404).json({ message: 'Request not found' });
  }
  res.json(request);
};

exports.createRequest = (req, res) => {
  const { userId, animalId, message } = req.body;

  if (!userId || !animalId || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newRequest = {
    id: uuidv4(),
    userId,
    animalId,
    message,
    status: 'pending',
  };

  db.adoptionRequests.push(newRequest);
  saveDb();

  res.status(201).json(newRequest);
};

exports.updateRequestStatus = (req, res) => {
  const request = db.adoptionRequests.find(r => r.id === req.params.id);
  if (!request) {
    return res.status(404).json({ message: 'Request not found' });
  }

  const { status } = req.body;

  if (!['pending', 'approved', 'declined'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  request.status = status;
  saveDb();

  res.json(request);
};

exports.deleteRequest = (req, res) => {
  const index = db.adoptionRequests.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Request not found' });
  }

  const deleted = db.adoptionRequests.splice(index, 1);
  saveDb();

  res.json({ message: 'Request deleted', request: deleted[0] });
};
