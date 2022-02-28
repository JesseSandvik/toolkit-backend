const express = require('express');
const router = express.Router();
const controller = require('../../controllers/usersController');

router.route('/')
.get(controller.listUsers)

  router.route('/:id')
    .get(controller.readUser)

module.exports = router;