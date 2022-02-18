const express = require('express');
const router = express.Router();
const controller = require('../../controllers/employeesController');

router.route('/')
  .get(controller.list)
  .post(controller.create)
  .put(controller.update)
  .delete(controller.delete);

  router.route('/:id')
    .get(controller.read)

module.exports = router;