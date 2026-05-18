const express = require('express');
const {
    getProductFaqs,
    createProductFaq,
    updateProductFaq,
    deleteProductFaq
} = require('../controllers/product-faq.controller');

const productFaqRouter = express.Router();

productFaqRouter.get('/', getProductFaqs);
productFaqRouter.post('/create', createProductFaq);
productFaqRouter.put('/:id', updateProductFaq);
productFaqRouter.delete('/:id', deleteProductFaq);

module.exports = {
    productFaqRouter
};
