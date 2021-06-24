const express = require('express');
const router = express.Router();

const eventCtrl = require('../controllers/event.controller.js');
const auth = require('../middlewares/authUser.js');
const authModerator = require('../middlewares/authModerator.js');

router.get('/', auth, eventCtrl.getAllEvents);
router.get('/:id', auth, eventCtrl.getOneEvent);
router.post('/', authModerator, eventCtrl.addEvent);

module.exports = router;
