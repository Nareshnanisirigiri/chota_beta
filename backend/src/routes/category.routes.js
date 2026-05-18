const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { upload } = require('../middleware/upload');

const uploadFields = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
    { name: 'icon', maxCount: 1 },
    { name: 'activeIcon', maxCount: 1 }
]);

router.get('/', categoryController.getCategories);
router.post('/create', uploadFields, categoryController.createCategory);
router.put('/:id', uploadFields, categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);
module.exports = { categoryRouter: router };
