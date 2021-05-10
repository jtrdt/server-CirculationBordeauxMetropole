const express = require('express');
const router = express.Router();

const boucleCtrl = require('../controllers/BoucleController.js');
const auth = require('../middlewares/auth.js');

router.get('/', boucleCtrl.getAllBoucles);
router.get('/:id', boucleCtrl.getOneBoucle);
router.post('/', auth, boucleCtrl.addNewBoucle);
router.put('/:id', auth, boucleCtrl.updateOneBoucle);
router.delete('/:id', auth, boucleCtrl.deleteOneBoucle);

module.exports = router;
