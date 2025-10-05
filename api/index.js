// ===========================================
// Reminote API server (with Gemini summary)
// ===========================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// --- Firebase初期化（まだされていなければ）
if (!admin.apps.length) {
  admin.initializeApp();
}

// --- Express設定
const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:8083';

// --- CORS & JSON
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-internal-cron-token'],
}));
app.use(express.json());

// --- リクエストログ（任意）
app.use((req, _res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  next();
});

/* ============================================================
   🔹 1) ヘルス（最優先で登録）
   ============================================================ */
console.log('REGISTER /api/health');
app.get('/api/health', (_req, res) => {
  console.log('HIT /api/health');
  res.json({ ok: true, msg: 'up' });
});

// ルート（おまけ）
app.get('/', (_req, res) => {
  res.json({ message: 'with Me API server', status: 'running', timestamp: new Date().toISOString() });
});

/* ============================================================
   🔹 2) 既存API群
   ============================================================ */
app.use('/api/users', require('./src/routes/user-route'));
app.use('/api/diaries', require('./src/routes/diary-route'));
app.use('/api/studies', require('./src/routes/study-route'));
app.use('/api/tags', require('./src/routes/tag-route'));
app.use('/api/study-tags', require('./src/routes/study-tags-route'));

/* ============================================================
   🔹 3) 週次要約API（Gemini）— 専用prefixで衝突回避
      ※ cron-route 側は /_ping, /weekly-summary などフラットなパス
   ============================================================ */
app.use('/api/cron', require('./src/routes/cron-route'));

/* ============================================================
   🔹 4) エラーハンドリング & 404（最後）
   ============================================================ */
app.use((err, _req, res, _next) => {
  console.error('[Error Stack]', err.stack);
  res.status(500).json({ success: false, message: 'サーバー内部エラーが発生しました' });
});

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'エンドポイントが見つかりません' });
});

/* ============================================================
   🔹 起動
   ============================================================ */
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
  console.log(`✅ API base path: http://localhost:${PORT}/api`);
});
