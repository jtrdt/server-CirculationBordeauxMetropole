const jwt = require('jsonwebtoken');

const User = require('../models/user.model.js');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY, {
      algorithms: process.env.TOKEN_ALGO
    });
    const userId = decodedToken.userId;
    const user = await User.findById(userId);
    if (user.role !== 'moderator' && user.role !== 'admin') {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
