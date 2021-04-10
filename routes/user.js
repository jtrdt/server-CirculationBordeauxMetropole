const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/UserController.js');

router.post('/', userCtrl.createNewUser);
router.get('/', userCtrl.getAllUsers);

module.exports = router;
