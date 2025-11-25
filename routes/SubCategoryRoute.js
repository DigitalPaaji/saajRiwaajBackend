const express = require('express');
const router = express.Router();
const subCategoryController = require('../controllers/SubCategoryController');

router.post('/', subCategoryController.createCategory);
router.get('/', subCategoryController.getCategories);
router.delete('/:id', subCategoryController.deleteCategory);
router.get('/category/:categoryId', subCategoryController.getByCategory);


module.exports = router;
