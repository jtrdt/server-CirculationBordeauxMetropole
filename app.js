/* eslint-disable quotes */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const db = mongoose.connection;

const boucleRoutes = require('./routes/boucle.route.js');
const userRoutes = require('./routes/user.route.js');
const authRoutes = require('./routes/auth.route.js');
const eventRoutes = require('./routes/event.route.js');

mongoose.connect(process.env.DB_LOCALHOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 200
});

var corsOptions = {
  origin: process.env.URL_FRONT,
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet());
app.use(limiter);

app.get('/', (req, res) => {
  res.json({
    message:
      "Bienvenue dans l'application de gestion des travaux du Poste de Commandement Circulation Bordeaux Métropole"
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/boucles', boucleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);

module.exports = app;
