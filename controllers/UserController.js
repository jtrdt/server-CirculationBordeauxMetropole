const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User.js');

exports.signup = (req, res) => {
  User.findOne({ name: req.body.name })
    .then((user, error) => {
      if (!user) {
        bcrypt.hash(req.body.password, 10).then((hashedPasswd) => {
          const user = new User({
            name: req.body.name,
            password: hashedPasswd
          });
          user
            .save()
            .then(() => {
              res.status(201).json({
                message: 'Nouvel utilisateur enregistré'
              });
            })
            .catch((error) => {
              res.status(401).json({ error });
            });
        });
      } else {
        res.status(403).json({ error });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.login = (req, res) => {
  User.findOne({ name: req.body.name })
    .then((user) => {
      if (!user) {
        res.status(401).json({
          message: 'Utilisateur non reconnu'
        });
      } else {
        bcrypt
          .compare(req.body.password, user.password)
          .then((log) => {
            if (log) {
              res.status(200).json({
                message: 'login ok',
                userId: user._id,
                name: user.name,
                admin: user.admin,
                token: jwt.sign(
                  { userId: user._id },
                  process.env.TOKEN_SECRET_KEY,
                  { expiresIn: '1h' }
                )
              });
            } else {
              res.status(401).json({ error: 'mauvais login ou mdp' });
            }
          })
          .catch((error) => {
            res.status(500).json({ error });
          });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getAllUsers = (req, res) => {
  User.find()
    .then((user) => res.status(200).json(user))
    .catch((error) => res.status(400).json({ error }));
};
