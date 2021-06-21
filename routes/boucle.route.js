const express = require('express');
const router = express.Router();

const boucleCtrl = require('../controllers/boucle.controller.js');
const auth = require('../middlewares/authUser.js');
const authModerator = require('../middlewares/authModerator.js');
const authAdmin = require('../middlewares/authAdmin');

router.get('/', boucleCtrl.getAllBoucles);
router.get('/:id', auth, boucleCtrl.getOneBoucle);
router.post('/', auth, boucleCtrl.addNewBoucle);
router.put('/:id/recommissioning', auth, boucleCtrl.updateBoucleRecommissioning);
router.put('/:id/archive', auth, authAdmin, boucleCtrl.archiveBoucle);
router.put('/:id/edit', auth, boucleCtrl.changeStatus);
router.put('/:id/send', auth, authModerator, boucleCtrl.sendBoucle);
router.put('/:id/comment', auth, boucleCtrl.addComment);
router.delete('/:id', auth, authAdmin, boucleCtrl.deleteOneBoucle);

module.exports = router;
