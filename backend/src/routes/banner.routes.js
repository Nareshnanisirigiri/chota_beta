const express = require('express');
const router = express.Router();
const controller = require('../controllers/banner.controller');
const { upload } = require('../middleware/upload');

router.get('/', controller.getBanners);
router.post('/', upload.fields([{ name: 'image', maxCount: 1 }]), controller.createBanner);
router.delete('/:id', controller.deleteBanner);

module.exports = {
    bannerRouter: router
};
