// src/api/src/routes/blacklist.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/blacklist');

// POST /api/blacklist
router.post('/', controller.createBlacklistEntry);

// DELETE /api/blacklist/:id
router.delete('/:id', controller.deleteBlacklistEntry);

module.exports = router;
