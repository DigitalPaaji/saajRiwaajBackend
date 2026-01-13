const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/BannerController');
const upload = require('../helper/saveImage');

// GET all banners
router.get('/', bannerController.getAllBanners);

// POST new banner
router.post('/',upload.fields([
    {name:"desktopImage",maxCount:1},
    {name:"mobileImage",maxCount:1},
]), bannerController.addBanner);

// DELETE banner
router.delete('/:id', bannerController.deleteBanner);

module.exports = router;
