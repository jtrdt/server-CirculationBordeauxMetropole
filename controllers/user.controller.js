const mongoose = require('mongoose');
const paginate = require('express-paginate');

const User = require('../models/user.model.js');

exports.getAllUsers = async (req, res) => {
  try {
    const [results, itemCount] = await Promise.all([
      await User.find({}).limit(req.query.limit).skip(req.skip).lean().exec(),
      User.countDocuments({})
    ]);
    if (itemCount === 0) {
      res.status(404).json({ message: 'Not Found' });
      return;
    }
    const pageCount = Math.ceil(itemCount / req.query.limit);
    if (req.accepts('json')) {
      res.status(200).json({
        object: 'list',
        has_more: paginate.hasNextPages(req)(pageCount),
        data: results
      });
    } else {
      res.render('users', {
        users: results,
        pageCount,
        itemCount,
        pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
      });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (user === null) {
      res.status(404).json({ message: 'Not Found' });
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
    await User.updateOne(
      { _id: req.params.id },
      { role: req.body.role },
      { runValidators: true }
    );
    res.status(200).json({ message: 'OK' });
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
    res.status(200).json({ message: 'OK' });
  } catch (exception) {
    if (exception instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: exception.message });
      return;
    }
    res.status(500);
    console.error(exception);
  }
};
