// routes/users.js
const express = require('express');
var router = express.Router();
const controller = require('../controllers/users');

router.route('/')
    .get(controller.getAllUsers)
    .post(controller.createUser);

router.route('/:id')
    .get(controller.getUserById)
    .patch(controller.updateUser)
    .delete(controller.deleteUser);

module.exports = router;
