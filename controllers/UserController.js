const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User.js');

exports.signup = (req, res) => {
  const email = req.body.email.toLowerCase(); // expect 'r.rohee@bordeaux-metropole.fr'
  const namedot = email.split('@')[0];
  const name = namedot.split('.').join('').toLowerCase();
  User.findOne({ email: req.body.email })
    .then((user, error) => {
      if (!user) {
        bcrypt.hash(req.body.password, 10).then(hashedPasswd => {
          const user = new User({
            name: name,
            email: email,
            password: hashedPasswd
          });
          user
            .save()
            .then(() => {
              res.status(201).send(user);
            })
            .catch(error => {
              res.status(401).json({ error });
            });
        });
      } else {
        res.status(403).json({ error });
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};

exports.login = (req, res) => {
  User.findOne({ name: req.body.name })
    .then(user => {
      if (!user) {
        res.status(401).json({
          message: 'Utilisateur non reconnu'
        });
      } else {
        bcrypt
          .compare(req.body.password, user.password)
          .then(log => {
            if (log) {
              res.status(200).json({
                message: 'login ok',
                userId: user._id,
                name: user.name,
                admin: user.admin,
                token: jwt.sign(
                  { userId: user._id, admin: user.admin },
                  process.env.TOKEN_SECRET_KEY,
                  { expiresIn: '15min' }
                )
              });
            } else {
              res.status(401).json({ error: 'Erreur d\'authentification' });
            }
          })
          .catch(error => {
            res.status(500).json({ error });
          });
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};

exports.getAllUsers = (req, res) => {
  User.find()
    .then(user => res.status(200).json(user))
    .catch(error => res.status(400).json({ error }));
};
