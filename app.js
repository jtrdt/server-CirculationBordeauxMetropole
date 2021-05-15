require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const db = mongoose.connection;

const boucleRoutes = require('./routes/boucle.js');
const userRoutes = require('./routes/user.js');

const dbConnect = async () => {
  await mongoose.connect(process.env.DB_LOCALHOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    console.log('Connected to MongoDB');
  });
};

dbConnect();

var corsOptions = {
  origin: process.env.URL_FRONT,
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet());

app.use('/api/boucle', boucleRoutes);
app.use('/api/user', userRoutes);

module.exports = app;
