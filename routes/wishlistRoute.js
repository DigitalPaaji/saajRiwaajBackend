const express = require('express');
const { getWishlist } = require('../controllers/WishlistController');
const router = express.Router()

router.post("/wishlistitems",getWishlist)





module.exports = router;