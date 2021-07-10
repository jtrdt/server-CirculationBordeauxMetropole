const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/auth.controller.js');

router.post('/signup', authCtrl.signup);
router.post('/signin', authCtrl.signin);
router.put('/updatepassword/:id', authCtrl.updatePassword);
router.get('/confirm/:confirmationCode', authCtrl.verifyUser);
router.post('/confirm/resend/:id', authCtrl.resendConfirmationCode);
router.post('/requestresetpassword', authCtrl.requestResetPassword);
router.put('/resetpassword', authCtrl.updateResetPassword);

module.exports = router;
