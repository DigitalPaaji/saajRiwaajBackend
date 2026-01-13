const { deleteImage } = require('../helper/deleteImage');
const Banner = require('../models/BannerModel');

// Get all banners (sorted by order)
exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1 });
    res.status(200).json(banners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add new banner
// controllers/BannerController.js
exports.addBanner = async (req, res) => {
  try {
   
 if (!req.files?.desktopImage || !req.files?.mobileImage) {
      return res.status(400).json({
        message: "Both desktopImage and mobileImage are required"
      });
    }

       const desktopImage = req.files.desktopImage[0].filename;
    const mobileImage = req.files.mobileImage[0].filename;

    const newBanner = new Banner({ desktopImage, mobileImage });
    await newBanner.save();

    res.status(201).json(newBanner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a banner
exports.deleteBanner = async (req, res) => {
  try {

    const banner = await Banner.findById(req.params.id);
    
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
   
    await deleteImage(banner.desktopImage)
    await deleteImage(banner.mobileImage);
    await banner.deleteOne()

    res.status(200).json({ message: 'Deleted successfully' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
