/* eslint-disable quotes */
require('localenv');
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

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
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
  origin: process.env.CLIENT_URL,
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet());
app.use(limiter);
app.get('/api', () => res.send('Listening'));
app.use('/api/auth', authRoutes);
app.use('/api/boucles', boucleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);

module.exports = app;
