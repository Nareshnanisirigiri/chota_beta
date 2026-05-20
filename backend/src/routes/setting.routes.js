const express = require('express');
const router = express.Router();
const controller = require('../controllers/setting.controller');

router.get('/', controller.getSettings);
router.post('/', controller.updateSettings);

module.exports = {
    settingRouter: router
};
