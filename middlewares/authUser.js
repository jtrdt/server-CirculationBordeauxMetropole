const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY, {
      algorithms: process.env.TOKEN_ALGO
    });
    const userId = decodedToken.userId;
    if (!userId) {
      throw 'Pas authentifié';
    }
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
