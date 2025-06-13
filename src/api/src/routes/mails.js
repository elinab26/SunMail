// /routes/mails.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/mails');
const { getUserId } = require('../utils/userUtils')

router.route('/')
    .get(getUserId, controller.getAllMails)
    .post(getUserId, controller.createMail);

router.route('/search/:query')
    .get(getUserId, controller.searchMails);

router.route('/:id')
    .get(getUserId, controller.getMailById)
    .patch(getUserId, controller.updateMail)
    .delete(getUserId, controller.deleteMail);

router.route('/:id/read')
    .patch(getUserId, controller.setRead);

module.exports = router;
