// app.js / server.js
const express = require('express');
const app = express();

app.use((req, _res, next) => {
    console.log('[REQ]', req.method, req.originalUrl);
    next();
  });
app.use(express.json()); // ← これ必須（POST の body を読む）
const diaryRouter = require('./routes/diary-route');

const studyRouter = require('./routes/study-route');
const tagRouter = require('./routes/tag-route');
const studyTagLinksRouter = require('./routes/study-');



app.use('/api/users', require('./src/routes/user-route'));
app.use('/api/diaries', diaryRouter); 
app.use('/api/studies', studyRouter);
app.use('/api/tags', tagRouter);
app.use('/api/study-tags', studyTagLinksRouter);

