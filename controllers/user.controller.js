/* eslint-disable quotes */
const mongoose = require('mongoose');

const User = require('../models/user.model.js');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      res.status(404).json({ message: 'Not Found' });
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
    if (user === null) {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
      return;
    }
    res.status(200).json(user);
  } catch (exception) {
    if (exception instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: exception.message });
      return;
    }
    res.sendStatus(500);
    console.error(exception);
  }
};

exports.updateRole = async (req, res) => {
  try {
    const role = req.body.role;
    if (!role) {
      res.status(204).json({ message: 'No Content' });
      return;
    }
    const id = req.params.id;
    const user = await User.findById(id);
    if (user === null) {
      res.status(404).json({ message: 'Not Found' });
      return;
    }
    await User.updateOne({ _id: req.params.id }, { role: req.body.role }, { runValidators: true });
    res.status(200).json({ message: 'Rôle mis à jour avec succès.' });
  } catch (exception) {
    if (exception instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: exception.message });
      return;
    }
    res.sendStatus(500);
    console.error(exception);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    if (!user) {
      res.status(404).json({ message: 'Not Found' });
      return;
    }
    await User.deleteOne({ _id: req.params.id });
    res.status(200).json({
      message: 'Utilisateur supprimée'
    });
  } catch (exception) {
    if (exception instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: exception.message });
      return;
    }
    res.status(500);
    console.error(exception);
  }
};
