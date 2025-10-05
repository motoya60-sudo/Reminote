// app.js / server.js
const express = require('express');
const app = express();

app.use((req, _res, next) => {
    console.log('[REQ]', req.method, req.originalUrl);
    next();
  });
app.use(express.json()); // ← これ必須（POST の body を読む）
const diaryRouter = require('./routes/diary-route');

app.use('/api/diaries', diaryRouter); 
