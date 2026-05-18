const express = require('express');
const { 
    getWalletTransactions, 
    createWalletTransaction, 
    updateWalletTransaction, 
    deleteWalletTransaction 
} = require('../controllers/wallet.controller');

const walletRouter = express.Router();

walletRouter.get('/', getWalletTransactions);
walletRouter.post('/', createWalletTransaction);
walletRouter.put('/:id', updateWalletTransaction);
walletRouter.delete('/:id', deleteWalletTransaction);

module.exports = { walletRouter };
