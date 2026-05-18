const express = require('express');
const { getBrands, createBrand, updateBrand, deleteBrand } = require('../controllers/brand.controller');
const { upload } = require('../middleware/upload');

const brandRouter = express.Router();

brandRouter.get('/', getBrands);
brandRouter.post('/create', upload.fields([{ name: 'logo', maxCount: 1 }]), createBrand);
brandRouter.put('/:id', upload.fields([{ name: 'logo', maxCount: 1 }]), updateBrand);
brandRouter.delete('/:id', deleteBrand);

module.exports = { brandRouter };
