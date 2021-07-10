const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user.controller.js');
const auth = require('../middlewares/authUser.js');
const authAdmin = require('../middlewares/authAdmin.js');

router.get('/', auth, authAdmin, userCtrl.getAllUsers);
router.get('/:id', auth, authAdmin, userCtrl.getUser);
router.put('/:id', auth, authAdmin, userCtrl.updateRole);
// router.delete('/:id', authAdmin, userCtrl.deleteUser);

module.exports = router;
