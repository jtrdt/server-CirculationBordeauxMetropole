const User = require('../models/User.js');

exports.createNewUser = (req, res) => {
  const newUser = new User({ ...req.body });
  newUser
    .save()
    .then(() => {
      res.status(201).json({
        message: 'Utilisateur ajoutée'
      });
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllUsers = (req, res) => {
  User.find()
    .then((user) => res.status(200).json(user))
    .catch((error) => res.status(400).json({ error }));
};
