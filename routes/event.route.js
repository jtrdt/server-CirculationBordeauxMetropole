const express = require('express');
const router = express.Router();

const eventCtrl = require('../controllers/event.controller.js');
const auth = require('../middlewares/authUser.js');
const authModerator = require('../middlewares/authModerator.js');

router.get('/', eventCtrl.getAllEvents);
router.get('/:id', auth, eventCtrl.getOneEvent);
router.post('/', authModerator, eventCtrl.addEvent);
router.put('/:id/enddate', authModerator, eventCtrl.editEndDate);
router.put('/:id/update', authModerator, eventCtrl.edit);

module.exports = router;
