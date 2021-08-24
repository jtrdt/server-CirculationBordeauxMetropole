const express = require('express');
const router = express.Router();

const boucleCtrl = require('../controllers/boucle.controller.js');
const auth = require('../middlewares/authUser.js');
const authModerator = require('../middlewares/authModerator.js');
const authAdmin = require('../middlewares/authAdmin');

// router.get('/', boucleCtrl.getAllBoucles);
router.get('/', boucleCtrl.getBoucle);
router.get('/archives/', boucleCtrl.getAllArchives);
// router.get('/archives/:id', auth, boucleCtrl.getOneArchive);
router.post('/', auth, boucleCtrl.addNewBoucle);
router.put('/:id/recommissioning',auth,boucleCtrl.updateBoucleRecommissioning);
router.put('/:id/archive', auth, authAdmin, boucleCtrl.archiveBoucle);
router.put('/:id/event', auth, boucleCtrl.addEvent);
router.put('/:id/send', auth, authModerator, boucleCtrl.sendBoucle);
router.put('/:id/comment', auth, boucleCtrl.addComment);
router.put('/:id/urgent', auth, boucleCtrl.editUrgent);
router.put('/:id/precise', auth, boucleCtrl.editPrecise);
router.delete('/:id', auth, authAdmin, boucleCtrl.deleteOneBoucle);

module.exports = router;
