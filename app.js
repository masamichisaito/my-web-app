// app.js
const express = require('express');
const app = express();

app.use(express.json()); // ← これが req.body を使うなら絶対必要

app.get('/', (req, res) => {
  res.status(200).send('Hello, test!');
});

app.post('/echo', (req, res) => {
  res.status(200).json(req.body);
});

app.post('/users', (req, res) => {
 console.log('Request body:', req.body); // ← 残してOK

  const { name, age } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required' });
  }

  if (!Number.isInteger(age)) {
    return res.status(400).json({ error: 'Age must be a number' });
  }

  res.status(201).json({ name, age });
});

module.exports = app;