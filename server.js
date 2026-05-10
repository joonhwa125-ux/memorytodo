// 기억(Memory) — Express backend
// 할 일 CRUD를 MongoDB 위에서 제공한다.

const express = require('express');
const cors = require('cors');

const { connectDB } = require('./server/db');
const personsRoutes = require('./server/routes/persons');
const importantDatesRoutes = require('./server/routes/importantDates');
const intentsRoutes = require('./server/routes/intents');
const intentEventsRoutes = require('./server/routes/intentEvents');

const app = express();
const PORT = process.env.PORT || 5000;

// === Middleware ===
app.use(
  cors({
    origin: (origin, cb) => {
      // 개발 환경: localhost / 127.0.0.1 의 모든 포트 허용
      if (!origin) return cb(null, true);
      const ok = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
      cb(ok ? null : new Error('CORS not allowed'), ok);
    },
    credentials: true,
  })
);
app.use(express.json());

// === Health check ===
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, name: 'memory-backend', port: PORT });
});

// === Routes ===
app.use('/api/persons', personsRoutes);
app.use('/api/important-dates', importantDatesRoutes);
app.use('/api/intents', intentsRoutes);
app.use('/api/intent-events', intentEventsRoutes);

// === 404 ===
app.use((req, res) => {
  res.status(404).json({ error: `Not found: ${req.method} ${req.path}` });
});

// === Error handler ===
app.use((err, _req, res, _next) => {
  console.error('[error]', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// === Start ===
async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[server] listening on http://localhost:${PORT}`);
  });
}

start();
