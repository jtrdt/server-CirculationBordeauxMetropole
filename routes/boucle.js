const express = require('express');
const router = express.Router();

const boucleCtrl = require('../controllers/BoucleController.js');

router.get('/', boucleCtrl.getAllBoucles);
router.post('/', boucleCtrl.addNewBoucle);

module.exports = router;
