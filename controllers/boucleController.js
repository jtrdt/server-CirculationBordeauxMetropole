const mongoose = require('mongoose');
const Boucle = require('../models/Boucle.js');

exports.getAllBoucles = async (req, res) => {
  try {
    const boucles = await Boucle.find()
      .populate('postedBy', 'name')
      .populate('recommissioning.by', 'name');
    if (!boucles) {
      res.status(404).json({ message: 'Not Found' });
      return;
    }
    res.status(200).json(boucles);
  } catch (error) {
    res.status(500);
    console.error(error);
  }
};

exports.getOneBoucle = async (req, res) => {
  try {
    const id = req.params.id;
    const boucle = await Boucle.findById(id)
      .populate('postedBy', 'name')
      .populate('recommissioning.by', 'name')
      .populate('comments.by', 'name');
    if (!boucle) {
      res.status(404).json({ message: 'Not Found' });
      return;
    }
    res.status(200).json(boucle);
  } catch (error) {
    res.status(500);
    console.error(error);
  }
};

exports.addNewBoucle = async (req, res) => {
  try {
    const newBoucle = new Boucle({ ...req.body });
    await newBoucle.save();
    res.set('Location', `/api/boucle/${newBoucle.id}`).status(201).send(newBoucle);
  } catch (exception) {
    if (exception instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: exception.message });
      return;
    }
    res.sendStatus(500);
    console.error(exception);
  }
};

exports.updateBoucleRecommissioning = async (req, res) => {
  try {
    const recommissioning = req.body.recommissioning;
    if (!recommissioning) {
      res.status(204).json({ message: 'No Content' });
    }
    await Boucle.updateOne(
      { _id: req.params.id },
      {
        recommissioning
      }
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

exports.storeBoucle = async (req, res) => {
  try {
    const isStored = req.body.isStored;
    if (!isStored) {
      res.status(204).json({ message: 'No Content' });
    }
    await Boucle.updateOne(
      { _id: req.params.id },
      {
        isStored
      }
    );
    res.status(200).json({ message: 'OK' });
  } catch (error) {
    res.status(500);
    console.error(error);
  }
};

exports.sendBoucle = async (req, res) => {
  try {
    const sendedDate = req.body.sendedDate;
    if (!sendedDate) {
      res.status(204).json({ message: 'No Content' });
    }
    await Boucle.updateOne(
      { _id: req.params.id },
      {
        sendedDate
      }
    );
    res.status(200).json({ message: 'OK' });
  } catch (error) {
    res.status(500);
    console.error(error);
  }
};

exports.addComment = async (req, res) => {
  try {
    await Boucle.updateOne(
      { _id: req.params.id },
      {
        $push: {
          comments: {
            by: req.body.comments.by,
            content: req.body.comments.content
          }
        }
      }
    );
    res.status(200).json({ message: 'Commentaire ajouté' });
  } catch (error) {
    res.status(500);
    console.error(error);
  }
};

exports.changeStatus = async (req, res) => {
  try {
    await Boucle.updateOne({ _id: req.params.id }, { ...req.body }, { runValidators: true });
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

exports.deleteOneBoucle = async (req, res) => {
  try {
    const boucle = await Boucle.findOne({ _id: req.params.id });
    if (!boucle) {
      res.status(404).json({ message: 'Not Found' });
      return;
    }
    await Boucle.deleteOne({ _id: req.params.id });
    res.status(200).json({
      message: 'Boucle supprimée'
    });
  } catch (error) {
    res.status(500);
    console.error(error);
  }
};
