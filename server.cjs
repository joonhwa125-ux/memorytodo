// 기억(Memory) — Express backend
// 할 일 CRUD를 MongoDB 위에서 제공한다.

const express = require('express');
const cors = require('cors');

const { connectDB } = require('./server/db.cjs');
const personsRoutes = require('./server/routes/persons.cjs');
const importantDatesRoutes = require('./server/routes/importantDates.cjs');
const intentsRoutes = require('./server/routes/intents.cjs');
const intentEventsRoutes = require('./server/routes/intentEvents.cjs');

const app = express();
const PORT = process.env.PORT || 5000;

// === CORS ===
// 허용 오리진:
//   1) localhost / 127.0.0.1 의 모든 포트 (개발용 — 항상 허용)
//   2) ALLOWED_ORIGINS env (쉼표 구분, 프로덕션 도메인 추가용)
//      예) ALLOWED_ORIGINS=https://memory.vercel.app,https://memory-pr-2.vercel.app
const extraOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

function isAllowedOrigin(origin) {
  if (!origin) return true; // curl / Postman / 서버사이드 요청
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
  if (extraOrigins.includes(origin)) return true;
  return false;
}

app.use(
  cors({
    origin: (origin, cb) => {
      const ok = isAllowedOrigin(origin);
      cb(ok ? null : new Error(`CORS not allowed: ${origin}`), ok);
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
