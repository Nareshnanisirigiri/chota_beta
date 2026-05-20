const express = require('express');
const router = express.Router();
const controller = require('../controllers/delivery-zone.controller');

router.get('/', controller.getDeliveryZones);
router.post('/', controller.createDeliveryZone);
router.put('/:id', controller.updateDeliveryZone);
router.delete('/:id', controller.deleteDeliveryZone);

module.exports = {
    deliveryZoneRouter: router
};
