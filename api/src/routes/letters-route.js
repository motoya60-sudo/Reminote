const express = require('express')
const app = express()

// respond with "hello world" when a GET request is made to the homepage
app.post('/letter', (req, res) => {
  res.send('hello world')
})
