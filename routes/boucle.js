const express = require('express');
const router = express.Router();

const boucleCtrl = require('../controllers/BoucleController.js');
const auth = require('../middlewares/authUser.js');

router.get('/', boucleCtrl.getAllBoucles);
router.post('/', auth, boucleCtrl.addNewBoucle);
router.get('/:id', boucleCtrl.getOneBoucle);
router.put('/:id', auth, boucleCtrl.updateOneBoucle);
router.delete('/:id', auth, boucleCtrl.deleteOneBoucle);

module.exports = router;
