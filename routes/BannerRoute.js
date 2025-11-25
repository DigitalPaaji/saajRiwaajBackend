const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/BannerController');

// GET all banners
router.get('/', bannerController.getAllBanners);

// POST new banner
router.post('/', bannerController.addBanner);

// DELETE banner
router.delete('/:id', bannerController.deleteBanner);

module.exports = router;
