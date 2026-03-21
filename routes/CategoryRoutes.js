const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/CategoryController');

router.post('/', categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.delete('/:id', categoryController.deleteCategory);
router.put("/:id",categoryController.updateCategory)
module.exports = router;
