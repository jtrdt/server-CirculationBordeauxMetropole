const express = require('express');
const router = express.Router();

const boucleCtrl = require('../controllers/BoucleController.js');
const auth = require('../middlewares/authUser.js');
const authAdmin = require('../middlewares/authAdmin');

router.get('/', boucleCtrl.getAllBoucles);
router.post('/', auth, boucleCtrl.addNewBoucle);
router.get('/:id', boucleCtrl.getOneBoucle);
router.put('/:id/recommissioning', auth, boucleCtrl.updateBoucleRecommissioning);
router.put('/:id/archive', authAdmin, boucleCtrl.updateBoucleAdmin);
router.put('/:id/comment', auth, boucleCtrl.addComment);
router.delete('/:id', auth, boucleCtrl.deleteOneBoucle);

module.exports = router;
