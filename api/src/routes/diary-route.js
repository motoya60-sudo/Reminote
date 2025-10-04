const express = require('express');
const router = express.Router()

router.get('/diary', (req, res) => {
  res.send('hello world')
})