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

//route to add label to mail
router.route('/:mailId/labels')
    .post(getUserId, controller.addLabelToMail);

router.route('/:mailId/labels/:labelId')
    .delete(getUserId, controller.deleteLabelFromMail);

module.exports = router;
