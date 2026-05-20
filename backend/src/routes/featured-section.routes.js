const express = require('express');
const router = express.Router();
const controller = require('../controllers/featured-section.controller');
const { upload } = require('../middleware/upload');

router.get('/', controller.getFeaturedSections);
router.post('/', upload.fields([{ name: 'image', maxCount: 1 }]), controller.createFeaturedSection);
router.put('/reorder', controller.updateSortOrder);
router.put('/:id', upload.fields([{ name: 'image', maxCount: 1 }]), controller.updateFeaturedSection);
router.delete('/:id', controller.deleteFeaturedSection);

module.exports = {
    featuredSectionRouter: router
};
