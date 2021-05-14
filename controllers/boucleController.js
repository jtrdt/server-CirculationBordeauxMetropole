const Boucle = require('../models/Boucle.js');

exports.getAllBoucles = async (req, res) => {
  try {
    const boucles = await Boucle.find()
      .populate('postedBy', 'name')
      .populate('backInService.by', 'name');
    if (!boucles) {
      res.status(204);
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
      .populate('backInService.by', 'name');
    if (!boucle) {
      res.status(204);
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
      .set('Location', `/api/boucle/${newBoucle.id}`)
      .status(201)
      .send(newBoucle);
  } catch (error) {
    res.status(500);
    console.error(error);
  }
};

exports.updateOneBoucle = async (req, res) => {
  try {
    const newComment = req.body.comments;
    if (newComment) {
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
    } else {
      await Boucle.updateOne(
        { _id: req.params.id },
        {
          ...req.body
        }
      );
      res.status(200).json({ message: 'Boucle mise à jour' });
    }
  } catch (error) {
    res.status(500);
    console.error(error);
  }
};

exports.deleteOneBoucle = async (req, res) => {
  try {
    await Boucle.deleteOne({ _id: req.params.id });
    res.status(200).json({
      message: 'Boucle supprimée'
    });
  } catch (error) {
    res.status(500);
    console.error(error);
  }
};
