const express = require('express');
const router = express.Router();

const eventCtrl = require('../controllers/event.controller.js');
const authModerator = require('../middlewares/authModerator.js');

router.get('/', eventCtrl.getAllEvents);
router.get('/:id', eventCtrl.getOneEvent);
router.post('/', authModerator, eventCtrl.addEvent);

module.exports = router;
