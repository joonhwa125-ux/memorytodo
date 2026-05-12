// Person CRUD 라우트
const express = require('express');
const Person = require('../models/Person.cjs');

const router = express.Router();

// 임시 user — 추후 인증 도입 시 req.user.id 로 교체
const DEFAULT_USER_ID = 'default-user';

// GET /api/persons — 내 활성 사람 목록
router.get('/', async (req, res) => {
  try {
    const persons = await Person.find({
      userId: DEFAULT_USER_ID,
      isActive: true,
    }).sort({ createdAt: 1 });
    res.json(persons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/persons/:id
router.get('/:id', async (req, res) => {
  try {
    const person = await Person.findOne({
      _id: req.params.id,
      userId: DEFAULT_USER_ID,
    });
    if (!person) return res.status(404).json({ error: 'not found' });
    res.json(person);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/persons
router.post('/', async (req, res) => {
  try {
    const { displayName } = req.body;
    if (!displayName || !displayName.trim()) {
      return res.status(400).json({ error: 'displayName is required' });
    }
    const person = await Person.create({
      userId: DEFAULT_USER_ID,
      displayName: displayName.trim(),
    });
    res.status(201).json(person);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/persons/:id
router.put('/:id', async (req, res) => {
  try {
    const updates = {};
    if (typeof req.body.displayName === 'string') {
      updates.displayName = req.body.displayName.trim();
    }
    const person = await Person.findOneAndUpdate(
      { _id: req.params.id, userId: DEFAULT_USER_ID },
      updates,
      { new: true }
    );
    if (!person) return res.status(404).json({ error: 'not found' });
    res.json(person);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/persons/:id (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const person = await Person.findOneAndUpdate(
      { _id: req.params.id, userId: DEFAULT_USER_ID },
      { isActive: false },
      { new: true }
    );
    if (!person) return res.status(404).json({ error: 'not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
module.exports.DEFAULT_USER_ID = DEFAULT_USER_ID;
