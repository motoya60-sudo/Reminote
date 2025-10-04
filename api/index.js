require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

//ミドルウェア設定
// JSONを扱えるようにする
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// ルート設定
app.use('/api/users', require('./src/routes/user-route'));

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
