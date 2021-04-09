const Boucle = require('../models/Boucle.js');

exports.getAllBoucles = (req, res) => {
  Boucle.find()
    .then((boucle) => res.status(200).json(boucle))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneBoucle = (req, res) => {
  const id = req.params.id;
  Boucle.findById(id)
    .then((boucle) => res.status(200).json(boucle))
    .catch((error) => res.status(400).json({ error }));
};

exports.addNewBoucle = (req, res) => {
  const newBoucle = new Boucle({ ...req.body });
  newBoucle
    .save()
    .then(() => {
      res.status(201).json({
        message: 'Boucle ajoutée'
      });
    })
    .catch((error) => res.status(400).json({ error }));
};
