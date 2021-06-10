const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/auth.controller.js');

router.post('/signup', authCtrl.signup);
router.post('/signin', authCtrl.signin);
router.get('/confirm/:confirmationCode', authCtrl.verifyUser);

module.exports = router;
