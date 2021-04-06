const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const db = mongoose.connection;

const boucleRoutes = require('./routes/boucle.js');

mongoose.connect('mongodb://' + process.env.DB_LOCALHOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use('/api/boucles', boucleRoutes);

module.exports = app;
