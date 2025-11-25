// models/CouponModel.js
const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  discountPercent: {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model("Coupon", couponSchema);
