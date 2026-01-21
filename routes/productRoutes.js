const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')
const upload = require('../helper/saveImage')

router.post('/add',  upload.fields([
    { name: "images", maxCount: 30 },
    { name: "barcode", maxCount: 1 },
  ]),productController.createProduct)
router.get('/',productController.getAllProducts)
router.get('/id/:id',productController.getProductById)
router.delete('/id/:id',productController.deleteProductById)
router.put('/id/:id', upload.fields([
    { name: "newImages", maxCount: 30 },
    { name: "newBarCode", maxCount: 1 },
  ]),productController.updateProductById)
router.get('/category/:categoryId', productController.getProductsByCategory);
router.get('/featured', productController.getFeaturedProducts);
router.get('/offer/:offerId', productController.getProductsByOffer);
router.get('/search/:text', productController.searchProduct);






module.exports = router;