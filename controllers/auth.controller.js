/* eslint-disable quotes */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const User = require('../models/user.model.js');

exports.signup = async (req, res) => {
  try {
    const firstname = req.body.firstname.replace(/\s+/g, '');
    const lastname = req.body.lastname.replace(/\s+/g, '');
    const username = firstname.charAt(0) + lastname;
    const isEmailOk = validator.isEmail(req.body.email);
    const isPasswordOk = validator.isStrongPassword(req.body.password, {
      minUppercase: 0,
      minSymbols: 0
    });
    if (!isEmailOk || !isPasswordOk) {
      res.status(400).json({ message: 'Adresse email ou mot de passe incorrect' });
      return;
    }
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res.status(400).json({ message: "Erreur durant l'inscription" });
      return;
    }

    const hashedPasswd = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      firstname,
      lastname,
      username,
      email: req.body.email,
      role: req.body.role,
      password: hashedPasswd
    });

    await newUser.save();
    res
      .set('Location', `/api/user/${newUser.id}`)
      .status(201)
      .json({ message: 'Nouvel utilisateur ajouté avec succès' });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(401).json({ message: "Erreur d'authentification" });
      return;
    }

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      res.status(401).json({ message: "Erreur d'authentification" });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, userName: user.name },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: '2h', algorithm: process.env.TOKEN_ALGO }
    );
    res.status(200).send({ token: token });
  } catch (error) {
    res.sendStatus(500);
  }
};

// TODO logout
