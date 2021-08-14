const mongoose = require('mongoose');
const paginate = require('express-paginate');

const { Boucle, ArchivedBoucle } = require('../models/boucle.model.js');

exports.getAllBoucles = async (req, res) => {
  try {
    // const [results, itemCount] = await Promise.all([
    //   await Boucle.find({})
    //     .populate('postedBy', 'username')
    //     .populate('comments.by', 'username')
    //     .populate('recommissioning.by', 'username')
    //     .populate('event', 'title')
    //     .populate('isStored.by', 'username')
    //     .limit(req.query.limit)
    //     .skip(req.skip)
    //     .lean()
    //     .exec(),
    //   Boucle.countDocuments({})
    // ]);
    // if (itemCount === 0) {
    //   res.status(404).json({ message: 'Not Found' });
    //   return;
    // }
    // const pageCount = Math.ceil(itemCount / req.query.limit);
    // if (req.accepts('json')) {
    //   res.json({
    //     object: 'list',
    //     has_more: paginate.hasNextPages(req)(pageCount),
    //     data: results
    //   });
    // } else {
    //   res.render('users', {
    //     users: results,
    //     pageCount,
    //     itemCount,
    //     pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
    //   });
    // }
    const boucles = await Boucle.find()
      .populate('postedBy', 'username')
      .populate('comments.by', 'username')
      .populate('recommissioning.by', 'username')
      .populate('event')
      .populate('sendedDate.by', 'username')
      .populate('archiveBy.by', 'username');
    if (!boucles) {
      res.status(404).json({ message: 'Not Found' });
      return;
    }
    res.status(200).json(boucles);
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.getOneBoucle = async (req, res) => {
  try {
    const id = req.params.id;
    const boucle = await Boucle.findById(id)
      .populate('postedBy', 'username')
      .populate('comments.by', 'username')
      .populate('recommissioning.by', 'username')
      .populate('event', 'title')
      .populate('isStored.by', 'username');
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
    res
      .set('Location', `/api/boucles/${newBoucle.id}`)
      .status(201)
      .send(newBoucle);
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

exports.archiveBoucle = async (req, res) => {
  try {
    await Boucle.updateOne(
      { _id: req.params.id },
      {
        archive: true,
        archiveBy: {
          by: req.body.archiveBy.by,
          date: req.body.archiveBy.date
        }
      }
    );
    const BoucleToArchive = await Boucle.findById(req.params.id);
    if (!BoucleToArchive) {
      res.status(404).json({ message: 'Not Found' });
      return;
    }
    const newArchivedBoucle = new ArchivedBoucle(BoucleToArchive.toJSON());
    await newArchivedBoucle.save();
    const isArchiveOk = await ArchivedBoucle.findById(req.params.id);
    if (!isArchiveOk) {
      res.status(404).json({ message: 'Not Found' });
      return;
    }
    await Boucle.deleteOne({ _id: req.params.id });
    res.status(200).json('OK');
  } catch (exception) {
    if (exception instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: exception.message });
      return;
    }
    res.sendStatus(500);
    console.error(exception);
  }
};

exports.sendBoucle = async (req, res) => {
  try {
    const sendedDate = req.body.sendedDate;
    if (!sendedDate) {
      res.status(204).json({ message: 'No Content' });
    }
    await Boucle.updateOne({ _id: req.params.id }, { sendedDate });
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

exports.addEvent = async (req, res) => {
  try {
    const eventId = mongoose.Types.ObjectId(req.body.eventId);
    await Boucle.updateOne(
      { _id: req.params.id },
      { event: eventId },
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

exports.editUrgent = async (req, res) => {
  try {
    await Boucle.updateOne(
      { _id: req.params.id },
      { isUrgent: req.body.isUrgent },
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

exports.editPrecise = async (req, res) => {
  try {
    await Boucle.updateOne(
      { _id: req.params.id },
      { toPrecise: req.body.isUrgent },
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

exports.getAllArchives = async (req, res) => {
  try {
    const boucles = await ArchivedBoucle.find()
      .populate('postedBy', 'username')
      .populate('comments.by', 'username')
      .populate('recommissioning.by', 'username')
      .populate('event')
      .populate('sendedDate.by', 'username')
      .populate('archiveBy.by', 'username');
    if (!boucles) {
      res.status(404).json({ message: 'Not Found' });
      return;
    }
    res.status(200).json(boucles);
  } catch (error) {
    res.status(500).json({ error });
  }
};

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

exports.getOneArchive = async (req, res) => {
  try {
    const id = req.params.id;
    const boucle = await ArchivedBoucle.findById(id)
      .populate('postedBy', 'username')
      .populate('comments.by', 'username')
      .populate('recommissioning.by', 'username')
      .populate('event', 'title')
      .populate('isStored.by', 'username');
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
