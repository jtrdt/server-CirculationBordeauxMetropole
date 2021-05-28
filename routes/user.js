const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/UserController.js');
const auth = require('../middlewares/authUser.js');
const authAdmin = require('../middlewares/authAdmin.js');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

router.get('/', auth, authAdmin, userCtrl.getAllUsers);
router.get('/:id', auth, authAdmin, userCtrl.getUser);
router.put('/:id', auth, authAdmin, userCtrl.updateRole);
router.delete('/:id', authAdmin, userCtrl.deleteUser);

module.exports = router;
