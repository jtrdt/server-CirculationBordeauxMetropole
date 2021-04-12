const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/UserController.js');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/', userCtrl.getAllUsers);

module.exports = router;
