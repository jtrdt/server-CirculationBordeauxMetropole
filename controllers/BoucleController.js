const Boucle = require('../models/Boucle.js');

exports.getAllBoucles = (req, res) => {
  Boucle.find()
    .populate('postedBy', 'name')
    .populate('backInService.by', 'name')
    .then(boucle => res.status(200).json(boucle))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneBoucle = (req, res) => {
  const id = req.params.id;
  Boucle.findById(id)
    .populate('postedBy', 'name')
    .populate('backInService.by', 'name')
    .then(boucle => res.status(200).json(boucle))
    .catch(error => res.status(400).json({ error }));
};

exports.addNewBoucle = (req, res) => {
  const newBoucle = new Boucle({ ...req.body });
  newBoucle
    .save()
    .then(() => {
      res
        .set('Location', `/api/boucle/${newBoucle.id}`)
        .status(201)
        .send(newBoucle);
    })
    .catch(error => res.status(400).json({ error }));
};

exports.updateOneBoucle = (req, res) => {
  Boucle.updateOne({ _id: req.params.id }, { ...req.body })
    .then(() =>
      res.status(200).json({
        message: 'Boucle mise à jour'
      })
    )
    .catch(error => res.status(400).json({ error }));
};

exports.deleteOneBoucle = (req, res) => {
  Boucle.deleteOne({ _id: req.params.id })
    .then(() =>
      res.status(200).json({
        message: 'Boucle supprimée'
      })
    )
    .catch(error => res.status(400).json({ error }));
};
