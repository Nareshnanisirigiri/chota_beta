const express = require('express');
const router = express.Router();
const controller = require('../controllers/system-update.controller');

router.get('/', controller.getSystemUpdates);

module.exports = {
    systemUpdateRouter: router
};
