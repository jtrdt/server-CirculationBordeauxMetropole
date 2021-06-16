/* eslint-disable quotes */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const User = require('../models/user.model.js');
const nodemailer = require('../config/nodemailer.config.js');

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
      res
        .status(400)
        .json({ message: 'Adresse email ou mot de passe incorrect' });
      return;
    }
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res.status(400).json({ message: "Erreur durant l'inscription" });
      return;
    }

    const hashedPasswd = await bcrypt.hash(req.body.password, 10);
    const token = jwt.sign(
      { email: req.body.email },
      process.env.TOKEN_SECRET_KEY,
      {
        algorithm: process.env.TOKEN_ALGO
      }
    );
    const newUser = new User({
      firstname,
      lastname,
      username,
      email: req.body.email,
      password: hashedPasswd,
      confirmationCode: token
    });

    await newUser.save();
    res
      .set('Location', `/api/users/${newUser.id}`)
      .status(201)
      .send({ message: 'Nouvel utilisateur ajouté avec succès' });
    nodemailer.sendConfirmationEmail(
      newUser.firstname,
      newUser.email,
      newUser.confirmationCode
    );
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

    if (user.status != 'active') {
      return res.status(401).send({
        message: 'Compte en attente de validation. Vérifiez vos emails'
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, userName: user.username },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: '2h', algorithm: process.env.TOKEN_ALGO }
    );
    res.status(200).send({ token: token });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findOne({
      confirmationCode: req.params.confirmationCode
    });
    if (!user) {
      return res.status(404).send({ message: 'Utilisateur inconnu' });
    }
    user.status = 'active';
    user.save(err => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
    });
    res.redirect(process.env.URL_FRONT);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// TODO logout
