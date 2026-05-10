// ImportantDate CRUD 라우트
const express = require('express');
const ImportantDate = require('../models/ImportantDate');

const router = express.Router();
const DEFAULT_USER_ID = 'default-user';

// GET /api/important-dates?personId=xxx
router.get('/', async (req, res) => {
  try {
    const filter = { userId: DEFAULT_USER_ID };
    if (req.query.personId) filter.personId = req.query.personId;

    const dates = await ImportantDate.find(filter).sort({ dateValue: 1 });
    res.json(dates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/important-dates
router.post('/', async (req, res) => {
  try {
    const { personId, label, dateValue } = req.body;
    if (!personId || !label || !dateValue) {
      return res.status(400).json({
        error: 'personId, label, dateValue are required',
      });
    }
    const doc = await ImportantDate.create({
      userId: DEFAULT_USER_ID,
      personId,
      label: label.trim(),
      dateValue,
    });
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/important-dates/:id
router.put('/:id', async (req, res) => {
  try {
    const updates = {};
    if (typeof req.body.label === 'string') updates.label = req.body.label.trim();
    if (typeof req.body.dateValue === 'string') updates.dateValue = req.body.dateValue;

    const doc = await ImportantDate.findOneAndUpdate(
      { _id: req.params.id, userId: DEFAULT_USER_ID },
      updates,
      { new: true }
    );
    if (!doc) return res.status(404).json({ error: 'not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/important-dates/:id (hard delete)
router.delete('/:id', async (req, res) => {
  try {
    const result = await ImportantDate.findOneAndDelete({
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
