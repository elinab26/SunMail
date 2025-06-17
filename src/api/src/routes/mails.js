// /routes/mails.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/mails');
const draftsCtrl = require('../controllers/drafts')
const { getUserId } = require('../utils/userUtils')

router.route('/')
    .post(getUserId, controller.createMail)
    .get(getUserId, controller.getAllMails)

router.route('/drafts')
    .post(getUserId, draftsCtrl.createDraft)
    .get(getUserId, draftsCtrl.getDrafts)

router.route('/drafts/:id/send')
    .post(getUserId, draftsCtrl.sendDraft)

router.route('/drafts/:id')
    .get(getUserId, draftsCtrl.getDraftById)
    .patch(getUserId, draftsCtrl.editDraft)
    // .delete(getUserId, draftsCtrl.deleteDraft)

router.route('/search/:query')
    .get(getUserId, controller.searchMails);

router.route('/:id/read/:labelName')
    .patch(getUserId, controller.setRead);

router.route('/:id')
    .get(getUserId, controller.getMailById)

router.route('/label/:labelName')
    .get(getUserId, controller.getAllMailsOfLabel)

module.exports = router;
