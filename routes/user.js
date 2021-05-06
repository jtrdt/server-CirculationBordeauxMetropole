const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/UserController.js');
const authAdmin = require('../middlewares/authAdmin.js');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/', authAdmin, userCtrl.getAllUsers);

module.exports = router;
