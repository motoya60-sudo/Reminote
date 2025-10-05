require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:8083';

app.use(cors({
  origin: allowedOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// ルート設定
app.use('/api/users', require('./src/routes/user-route'));
app.use('/api/diaries', require('./src/routes/diary-route'));
app.use('/api/studies', require('./src/routes/study-route'));
app.use('/api/tags', require('./src/routes/tag-route'));
app.use('/api/study-tags', require('./src/routes/study-tags-route'));
app.use('/api/line', require('./src/routes/line-route'));

// ルート
app.get('/', (req, res) => {
  res.json({
    message: 'with Me API server',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

//エラーハンドリング
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'サーバー内部エラーが発生しました'
  });
});

// 404ハンドリング
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'エンドポイントが見つかりません'
  });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log(`Server is running at http://localhost:${PORT}/api`);
});
