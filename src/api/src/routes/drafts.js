const express = require('express')
const router = express.Router()
const draftsCtrl = require('../controllers/drafts')
const { getUserId } = require('../utils/userUtils')


router.post('/', getUserId, draftsCtrl.createDraft)
router.get('/', getUserId, draftsCtrl.getDrafts)
router.get('/:id', getUserId, draftsCtrl.getDraftById);
router.post('/:id/send', getUserId, draftsCtrl.sendDraft)
router.patch('/:id', getUserId, draftsCtrl.editDraft)
module.exports = router
