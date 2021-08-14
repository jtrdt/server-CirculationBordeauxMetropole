const mongoose = require('mongoose');
const Event = require('../models/event.model.js');

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('postedBy', 'username');
    if (!events) {
      res.status(404).json({ message: 'Not Found' });
      return;
    }
    res.status(200).json(events);
  } catch (error) {
    res.status(500);
    console.error(error);
  }
};

exports.getOneEvent = async (req, res) => {
  try {
    const id = req.params.id;
    const event = await Event.findById(id).populate('postedBy', 'username');
    if (!event) {
      res.status(404).json({ message: 'Not Found' });
      return;
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500);
    console.error(error);
  }
};

exports.addEvent = async (req, res) => {
  try {
    const newEvent = new Event({ ...req.body });
    await newEvent.save();
    res
      .set('Location', `/api/events/${newEvent.id}`)
      .status(201)
      .send(newEvent);
  } catch (exception) {
    if (exception instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: exception.message });
      return;
    }
    res.sendStatus(500);
    console.error(exception);
  }
};

exports.editEndDate = async (req, res) => {
  try {
    await Event.updateOne(
      { _id: req.params.id },
      { endDate: req.body.endDate },
      { runValidators: true }
    );
    res.status(200).json({ message: 'OK' });
  } catch (exception) {
    if (exception instanceof mongoose.Error.CastError) {
      res.status(400).json({ message: exception.message });
      return;
    }
    res.status(500);
    console.error(exception);
  }
};

exports.edit = async (req, res) => {
  try {
    await Event.updateOne(
      { _id: req.params.id },
      { title: req.body.title },
      { color: req.body.color },
      { runValidators: true }
    );
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
