// /routes/mails.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/mails');
const draftsCtrl = require('../controllers/drafts')
const { getUserId } = require('../utils/userUtils')

router.route('/')
    .post(getUserId, controller.createMail);

router.route('/drafts')
    .post(getUserId, draftsCtrl.createDraft)
    .get(getUserId, draftsCtrl.getDrafts)

router.route('/drafts/:id/send')
    .post(getUserId, draftsCtrl.sendDraft)

router.route('/drafts/:id')
    .get(getUserId, draftsCtrl.getDraftById)
    .patch(getUserId, draftsCtrl.editDraft)

router.route('/search/:query')
    .get(getUserId, controller.searchMails);


router.route('/:id/read/:labelName')
    .patch(getUserId, controller.setRead);

router.route('/:id/:labelName')
    .get(getUserId, controller.getMailById)
    .patch(getUserId, controller.updateMail)
    .delete(getUserId, controller.deleteMail);

router.route('/:labelName')
    .get(getUserId, controller.getAllMails)
module.exports = router;
