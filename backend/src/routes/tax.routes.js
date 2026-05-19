const express = require('express');
const {
    getTaxRates, createTaxRate, updateTaxRate, deleteTaxRate,
    getTaxClasses, createTaxClass, updateTaxClass, deleteTaxClass,
} = require('../controllers/tax.controller');

const taxRouter = express.Router();

// Tax Rates
taxRouter.get('/rates', getTaxRates);
taxRouter.post('/rates/create', createTaxRate);
taxRouter.put('/rates/:id', updateTaxRate);
taxRouter.delete('/rates/:id', deleteTaxRate);

// Tax Classes
taxRouter.get('/classes', getTaxClasses);
taxRouter.post('/classes/create', createTaxClass);
taxRouter.put('/classes/:id', updateTaxClass);
taxRouter.delete('/classes/:id', deleteTaxClass);

module.exports = { taxRouter };
