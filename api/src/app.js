// app.js / server.js
const express = require('express');
const app = express();

app.use(express.json()); // ← これ必須（POST の body を読む）
const diaryRouter = require('./routers/diary-route');

app.use('api/diaries', diaryRouter); 
