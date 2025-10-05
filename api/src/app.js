// api/app.js  or  api/server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();

// --- Firebase Admin 初期化（最初にやる）
if (!admin.apps.length) {
  admin.initializeApp();
}

// --- CORS設定（最初に設置）
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:8083';
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-internal-cron-token'],
}));

// --- リクエストログ（任意）
app.use((req, _res, next) => {
  console.log('[REQ]', req.method, req.originalUrl);
  next();
});

// --- JSON 受け取り（重複しないよう1回だけ）
app.use(express.json());

/* ---------------------------------------------------------
   ✅ ヘルスチェックは “最優先で” 登録（ここを先に！）
--------------------------------------------------------- */
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, msg: 'up' });
});

/* ---------------------------------------------------------
   既存API群
--------------------------------------------------------- */
app.use('/api/users',       require('./src/routes/user-route'));
app.use('/api/diaries',     require('./src/routes/diary-route'));
app.use('/api/studies',     require('./src/routes/study-route'));
app.use('/api/tags',        require('./src/routes/tag-route'));
app.use('/api/study-tags',  require('./src/routes/study-tags-route'));

/* ---------------------------------------------------------
   ✅ 週次要約（Gemini）cronルートは “専用prefix” に変更
   - cron-route 側はフラットなパスに直す（/_ping, /weekly-summary 等）
   - こうすると /api/health と衝突しない
--------------------------------------------------------- */
app.use('/api/cron', require('./src/routes/cron-route'));

// --- 404（最後に置く！）
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'エンドポイントが見つかりません' });
});

module.exports = app;
