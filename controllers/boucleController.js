const Boucle = require('../models/Boucle.js');

exports.getAllBoucles = async (req, res) => {
  try {
    const boucles = await Boucle.find()
      .populate('postedBy', 'name')
      .populate('recommissioning.by', 'name');
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
      .populate('recommissioning.by', 'name')
      .populate('comments.by', 'name');
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

exports.updateBoucleRecommissioning = async (req, res) => {
  const recommissioning = req.body.recommissioning;
  try {
    if (!recommissioning) {
      res.status(400).json({ message: 'Data incorrects' });
    }
    await Boucle.updateOne(
      { _id: req.params.id },
      {
        recommissioning
      }
    );
    res.status(200).json({ message: 'Boucle mise à jour' });
  } catch (error) {
    res.status(500);
    console.error(error);
  }
};

exports.storeBoucle = async (req, res) => {
  const isStored = req.body.isStored;
  try {
    if (!isStored) {
      res.status(400).json({ message: 'Data incorrects' });
    }
    await Boucle.updateOne(
      { _id: req.params.id },
      {
        isStored
      }
    );
    res.status(200).json({ message: 'Boucle archivée' });
  } catch (error) {
    res.status(500);
    console.error(error);
  }
};

exports.sendBoucle = async (req, res) => {
  const sendedDate = req.body.sendedDate;
  try {
    if (!sendedDate) {
      res.status(400).json({ message: 'Data incorrects' });
    }
    await Boucle.updateOne(
      { _id: req.params.id },
      {
        sendedDate
      }
    );
    res.status(200).json({ message: 'Boucle transmise' });
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
