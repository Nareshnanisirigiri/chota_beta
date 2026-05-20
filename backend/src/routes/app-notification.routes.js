const express = require('express');
const router = express.Router();
const controller = require('../controllers/app-notification.controller');

router.get('/', controller.getNotifications);
router.post('/', controller.createNotification);
router.delete('/:id', controller.deleteNotification);

module.exports = {
    appNotificationRouter: router
};
