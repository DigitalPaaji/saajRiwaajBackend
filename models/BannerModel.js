// models/BannerModel.js
const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  desktopImage: {
    type: String,
    required: true,
  },
  mobileImage: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Banner', bannerSchema);
