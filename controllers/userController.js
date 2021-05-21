/* eslint-disable quotes */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const User = require('../models/User.js');

exports.signup = async (req, res) => {
  try {
    const firstname = req.body.firstname.replace(/\s+/g, '');
    const lastname = req.body.lastname.replace(/\s+/g, '');
    const name = firstname.charAt(0) + lastname;
    const email = req.body.email.replace(/\s+/g, '');
    const isEmailOk = validator.isEmail(email);
    const isPasswordOk = validator.isStrongPassword(req.body.password, {
      minUppercase: 0,
      minSymbols: 0
    });
    if (!isEmailOk || !isPasswordOk) {
      throw 'Adresse email ou mot de passe incorrect';
    }
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res.status(401).json({ message: "Erreur durant l'inscription" });
      return;
    }

    const hashedPasswd = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      firstname,
      lastname,
      name,
      email,
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
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(401).json({
        message: "Erreur d'authentification"
      });
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
      { expiresIn: '10min', algorithm: process.env.TOKEN_ALGO }
    );
    res.status(200).send({ token: token });
  } catch (error) {
    res.sendStatus(500);
  }
};

// TODO logout

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      res
        .status(400)
        .json({ message: "Pas d'utilisateur enregistré en base de données" });
      return;
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      res.status(204);
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const role = req.body.role;
    if (!role) {
      throw 'Data inccorects';
    }
    const user = await User.updateOne(
      {
        _id: req.params.id
      },
      {
        role: req.body.role
      }
    );
    if (!user) {
      res.status(204);
      return;
    }
    res.status(200).json({ message: 'Rôle mis à jour avec succès.' });
  } catch (error) {
    res.status(500).json({ error });
  }
};
