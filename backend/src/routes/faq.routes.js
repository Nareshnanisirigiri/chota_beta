const express = require('express');
const router = express.Router();
const controller = require('../controllers/faq.controller');

router.get('/', controller.getFAQs);
router.post('/', controller.createFAQ);
router.put('/:id', controller.updateFAQ);
router.delete('/:id', controller.deleteFAQ);

module.exports = {
    faqRouter: router
};
