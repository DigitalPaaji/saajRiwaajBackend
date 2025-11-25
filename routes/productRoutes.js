const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')

router.post('/add',productController.createProduct)
router.get('/',productController.getAllProducts)
router.get('/id/:id',productController.getProductById)
router.delete('/id/:id',productController.deleteProductById)
router.put('/id/:id',productController.updateProductById)
router.get('/category/:categoryId', productController.getProductsByCategory);
router.get('/featured', productController.getFeaturedProducts);
router.get('/offer/:offerId', productController.getProductsByOffer);






module.exports = router;