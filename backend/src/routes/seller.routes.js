const express = require('express');
const { 
    getSellers, 
    getSellerById, 
    updateSeller, 
    createSeller, 
    deleteSeller, 
    getSellerWithdrawals, 
    getSellerWithdrawalHistory, 
    updateSellerWithdrawal,
    getSellerSettlements,
    getSellerSettlementHistory,
    settleCommissions
} = require('../controllers/seller.controller');
const { upload } = require('../middleware/upload');

const sellerRouter = express.Router();

const sellerUpload = upload.fields([
    { name: 'license', maxCount: 1 },
    { name: 'incorporation', maxCount: 1 },
    { name: 'idcard', maxCount: 1 },
    { name: 'signature', maxCount: 1 }
]);

sellerRouter.get('/', getSellers);
sellerRouter.post('/', sellerUpload, createSeller);
sellerRouter.get('/withdrawals', getSellerWithdrawals);
sellerRouter.get('/withdrawals-history', getSellerWithdrawalHistory);
sellerRouter.put('/withdrawals/:id', updateSellerWithdrawal);
sellerRouter.get('/settlements', getSellerSettlements);
sellerRouter.get('/settlements-history', getSellerSettlementHistory);
sellerRouter.post('/settlements/settle', settleCommissions);
sellerRouter.get('/:id', getSellerById);
sellerRouter.put('/:id', sellerUpload, updateSeller);
sellerRouter.delete('/:id', deleteSeller);

module.exports = {
    sellerRouter
};
