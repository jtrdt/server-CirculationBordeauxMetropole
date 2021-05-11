/* eslint-disable quotes */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User.js');

exports.signup = async (req, res) => {
  const email = req.body.email.toLowerCase(); // expect 'r.blabla@bordeaux-metropole.fr'
  const namedot = email.split('@')[0];
  const name = namedot.split('.').join('').toLowerCase();
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res.status(401).json({ message: "Erreur durant l'inscription" });
      return;
    }

    const hashedPasswd = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      name: name,
      email: email,
      password: hashedPasswd
    });

    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ name: req.body.name });
    if (!user) {
      res.status(401).json({
        message: "Erreur d'authentification"
      });
      return;
    }

    const match = await bcrypt.compare(req.body.password, user.password);
    if (match) {
      const token = jwt.sign(
        { userId: user._id, admin: user.admin, userName: user.name },
        process.env.TOKEN_SECRET_KEY,
        { expiresIn: '10min' }
      );
      console.log(token);
      res.status(200).send({ token: token });
    } else {
      res.status(401).json({ message: "Erreur d'authentification" });
      return;
    }
  } catch (error) {
    res.sendStatus(500);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      res.status(400).json({ message: "Pas d'utilisateur en bdd" });
      return;
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error });
  }
};
