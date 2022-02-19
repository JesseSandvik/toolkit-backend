const express = require('express');
const router = express.Router();
const controller = require('../../controllers/employeesController');
const ROLES_LIST = require('../../config/rolesList');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
  .get(controller.list)
  .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), controller.create)
  .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), controller.update)
  .delete(verifyRoles(ROLES_LIST.Admin), controller.delete);

  router.route('/:id')
    .get(controller.read)

module.exports = router;