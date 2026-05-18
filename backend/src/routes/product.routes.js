const express = require('express');
const { getProducts, updateProductStatus } = require('../controllers/product.controller');

const productRouter = express.Router();

productRouter.get('/', getProducts);
productRouter.put('/:id/status', updateProductStatus);

module.exports = {
    productRouter
};
