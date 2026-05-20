const express = require('express');
const router = express.Router();
const controller = require('../controllers/promo.controller');

router.get('/', controller.getPromos);
router.post('/', controller.createPromo);
router.put('/:id', controller.updatePromo);
router.delete('/:id', controller.deletePromo);

module.exports = {
    promoRouter: router
};
