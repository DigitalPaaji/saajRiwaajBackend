const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/CategoryController');
const catupload = require('../helper/catimage');

router.post('/',catupload.single("image"), categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.get("/cat-sub",categoryController.getCat_sub)
router.delete('/:id', categoryController.deleteCategory);
router.put("/:id",catupload.single("image"),categoryController.updateCategory)
module.exports = router;
