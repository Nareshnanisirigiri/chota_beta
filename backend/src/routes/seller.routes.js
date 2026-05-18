const express = require('express');
const { getSellers, getSellerById, updateSeller } = require('../controllers/seller.controller');

const sellerRouter = express.Router();

sellerRouter.get('/', getSellers);
sellerRouter.get('/:id', getSellerById);
sellerRouter.put('/:id', updateSeller);

module.exports = {
    sellerRouter
};
