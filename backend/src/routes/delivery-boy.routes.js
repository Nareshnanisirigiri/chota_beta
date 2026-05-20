const express = require('express');
const router = express.Router();
const controller = require('../controllers/delivery-boy.controller');

// Main Listings & Details
router.get('/', controller.getDeliveryBoys);
router.get('/zones', controller.getDeliveryZones);
router.get('/earnings', controller.getEarnings);
router.get('/earnings-history', controller.getEarningHistory);
router.get('/cash-collections', controller.getCashCollections);
router.get('/cash-history', controller.getCashCollectionHistory);
router.get('/withdrawals', controller.getWithdrawals);
router.get('/withdrawals-history', controller.getWithdrawalHistory);
router.get('/:id', controller.getDeliveryBoyById);

// Status / Verification Actions
router.put('/:id/verification', controller.updateVerification);
router.put('/:id/status', controller.updateStatus);
router.delete('/:id', controller.deleteDeliveryBoy);

// Financial Actions
router.post('/earnings/:id/settle', controller.settleEarning);
router.post('/cash-submit', controller.submitCash);
router.put('/withdrawals/:id', controller.updateWithdrawal);

module.exports = {
    deliveryBoyRouter: router
};
