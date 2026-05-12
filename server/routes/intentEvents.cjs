// IntentEvent 라우트 (4사분면 실행 기록)
const express = require('express');
const IntentEvent = require('../models/IntentEvent.cjs');

const router = express.Router();
const DEFAULT_USER_ID = 'default-user';

const VALID_QUADRANTS = ['aligned', 'procrastinated', 'relapsed', 'resisted'];

// GET /api/intent-events?personId=xxx&since=YYYY-MM-DD
router.get('/', async (req, res) => {
  try {
    const filter = { userId: DEFAULT_USER_ID };
    if (req.query.personId) filter.personId = req.query.personId;
    if (req.query.since) {
      const since = new Date(req.query.since);
      if (!isNaN(since)) filter.recordedAt = { $gte: since };
    }
    const events = await IntentEvent.find(filter).sort({ recordedAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/intent-events
router.post('/', async (req, res) => {
  try {
    const { personId, intentId, quadrant, triggerNote, sessionType } = req.body;
    if (!personId || !quadrant) {
      return res.status(400).json({ error: 'personId, quadrant are required' });
    }
    if (!VALID_QUADRANTS.includes(quadrant)) {
      return res.status(400).json({
        error: `quadrant must be one of ${VALID_QUADRANTS.join(', ')}`,
      });
    }
    const ev = await IntentEvent.create({
      userId: DEFAULT_USER_ID,
      personId,
      intentId: intentId || null,
      quadrant,
      triggerNote: triggerNote || null,
      sessionType: sessionType || 'realtime',
      recordedAt: new Date(),
    });
    res.status(201).json(ev);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/intent-events/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await IntentEvent.findOneAndDelete({
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
