// /routes/mails.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/mails');
const { getUserId } = require('../utils/userUtils')

router.route('/')
    .post(getUserId, controller.createMail);

router.route('/:labelName')
    .get(getUserId, controller.getAllMails)

router.route('/search/:query')
    .get(getUserId, controller.searchMails);

router.route('/:id/:labelName')
    .get(getUserId, controller.getMailById)
    .patch(getUserId, controller.updateMail)
    .delete(getUserId, controller.deleteMail);

router.route('/:id/read')
    .patch(getUserId, controller.setRead);

module.exports = router;
