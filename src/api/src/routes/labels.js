// /routes/labels.js
const express = require('express')
var router = express.Router()

const labels = require('../controllers/labels')

router.route('/')
    .get(labels.getLabels)
    .post(labels.createLabel);

router.route('/:id')
    .get(labels.getLabelById)
    .patch(labels.patchLabelById)
    .delete(labels.deleteLabelById);

module.exports = router
