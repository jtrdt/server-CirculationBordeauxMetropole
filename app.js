const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const db = mongoose.connection;

const boucleRoutes = require('./routes/boucle.js');
const userRoutes = require('./routes/user.js');

mongoose.connect(process.env.DB_LOCALHOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

var corsOptions = {
  origin: process.env.URL_FRONT,
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/boucles', boucleRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
