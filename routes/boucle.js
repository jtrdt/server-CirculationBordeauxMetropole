const express = require('express');
const router = express.Router();

const boucleCtrl = require('../controllers/BoucleController.js');
const auth = require('../middlewares/authUser.js');
const authAdmin = require('../middlewares/authAdmin');
const authModerator = require('../middlewares/authModerator.js');

router.get('/', boucleCtrl.getAllBoucles);
router.post('/', auth, boucleCtrl.addNewBoucle);
router.get('/:id', auth, boucleCtrl.getOneBoucle);
router.put(
  '/:id/recommissioning',
  auth,
  boucleCtrl.updateBoucleRecommissioning
);
router.put('/:id/archive', auth, authAdmin, boucleCtrl.storeBoucle);
router.put('/:id/edit', auth, boucleCtrl.changeStatus);
router.put('/:id/send', auth, authModerator, boucleCtrl.sendBoucle);
router.put('/:id/comment', auth, boucleCtrl.addComment);
router.delete('/:id', auth, authAdmin, boucleCtrl.deleteOneBoucle);

module.exports = router;
