const express = require('express');
const router = express.Router();

const boucleCtrl = require('../controllers/BoucleController.js');

router.get('/', boucleCtrl.getAllBoucles);
router.get('/:id', boucleCtrl.getOneBoucle);
router.post('/', boucleCtrl.addNewBoucle);

module.exports = router;
