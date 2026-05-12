// Intent CRUD 라우트 (할 일 / 참기)
const express = require('express');
const Intent = require('../models/Intent.cjs');

const router = express.Router();
const DEFAULT_USER_ID = 'default-user';

// GET /api/intents?personId=xxx&includeArchived=true
router.get('/', async (req, res) => {
  try {
    const filter = { userId: DEFAULT_USER_ID };
    if (req.query.personId) filter.personId = req.query.personId;
    if (req.query.includeArchived !== 'true') filter.isArchived = false;

    const intents = await Intent.find(filter).sort({ createdAt: -1 });
    res.json(intents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/intents/:id
router.get('/:id', async (req, res) => {
  try {
    const intent = await Intent.findOne({
      _id: req.params.id,
      userId: DEFAULT_USER_ID,
    });
    if (!intent) return res.status(404).json({ error: 'not found' });
    res.json(intent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/intents
router.post('/', async (req, res) => {
  try {
    const { personId, intentType, title, why, dueDate } = req.body;
    if (!personId || !intentType || !title) {
      return res.status(400).json({
        error: 'personId, intentType, title are required',
      });
    }
    if (!['do', 'avoid'].includes(intentType)) {
      return res.status(400).json({ error: 'intentType must be "do" or "avoid"' });
    }
    const intent = await Intent.create({
      userId: DEFAULT_USER_ID,
      personId,
      intentType,
      title: title.trim(),
      why: why ? why.trim() : null,
      dueDate: dueDate || null,
    });
    res.status(201).json(intent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/intents/:id
router.put('/:id', async (req, res) => {
  try {
    const updates = {};
    if (typeof req.body.title === 'string') updates.title = req.body.title.trim();
    if (typeof req.body.why === 'string') updates.why = req.body.why.trim();
    if (req.body.why === null) updates.why = null;
    if (typeof req.body.dueDate === 'string' || req.body.dueDate === null) {
      updates.dueDate = req.body.dueDate || null;
    }
    if (req.body.intentType && ['do', 'avoid'].includes(req.body.intentType)) {
      updates.intentType = req.body.intentType;
    }
    if (typeof req.body.isArchived === 'boolean') {
      updates.isArchived = req.body.isArchived;
    }

    const intent = await Intent.findOneAndUpdate(
      { _id: req.params.id, userId: DEFAULT_USER_ID },
      updates,
      { new: true }
    );
    if (!intent) return res.status(404).json({ error: 'not found' });
    res.json(intent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/intents/:id (hard delete)
router.delete('/:id', async (req, res) => {
  try {
    const result = await Intent.findOneAndDelete({
      _id: req.params.id,
      userId: DEFAULT_USER_ID,
    });
    if (!result) return res.status(404).json({ error: 'not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
