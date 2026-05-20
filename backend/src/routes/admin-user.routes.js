const express = require('express');
const router = express.Router();
const controller = require('../controllers/admin-user.controller');

router.get('/', controller.getAdminUsers);
router.post('/', controller.createAdminUser);
router.put('/:id', controller.updateAdminUser);
router.delete('/:id', controller.deleteAdminUser);

module.exports = {
    adminUserRouter: router
};
