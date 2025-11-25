const express = require('express')
const router = express.Router()
const User = require('../controllers/UserController')
const auth = require('../middleware/userAuth')
const isAdmin = require('../middleware/adminAuth')


router.get('/all', isAdmin, User.getAllUsers);
router.get('/admin', isAdmin, User.getAdmin)
router.get('/',auth, User.getUser)
router.get('/reset-token/:token',User.checkTokenValidity)
 

router.put('/update', auth, User.updateUserProfile)
router.put('/cart', auth, User.updateCartQuantity);
router.put('/reset-password/:token', User.resetPassword);
 

router.post('/signup',User.signup)
// router.post('/login',User.login)
router.post('/loginUser',User.loginUser)
router.post('/loginAdmin',User.loginAdmin)
router.post('/userlogout',User.logoutUser)
router.post('/adminlogout',User.logoutAdmin)
router.post('/cart', auth, User.addToCart);
router.post('/wishlist', auth, User.addToWishlist);
router.post('/forgot-password', User.forgotPassword);


router.delete('/wishlist/:productId', auth, User.removeFromWishlist);
router.delete('/cart/:productId', auth, User.removeFromCart);


module.exports = router;