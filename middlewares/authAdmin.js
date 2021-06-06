const jwt = require('jsonwebtoken');

const User = require('../models/User.js');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY, {
      algorithms: process.env.TOKEN_ALGO
    });
    const userId = decodedToken.userId;
    const user = await User.findById(userId);
    if (user.role !== 'admin') {
      res.status(403).json({ message: 'Pas les droits nécessaires' });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({ error });
  }
};
