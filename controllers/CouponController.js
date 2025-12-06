const Coupon = require("../models/CouponModel");

// ADMIN — create coupon
const createCoupon = async (req, res) => {
  const { code, discountPercent } = req.body;
  try {
    const coupon = await Coupon.create({ 
      code: code.toUpperCase(),
      discountPercent,
    });
    res.status(201).json({ message: "Coupon created", coupon });
  } catch (err) {
    res.status(500).json({ message: "Error creating coupon" });
  }
};

// ADMIN — get ALL coupons
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json({ coupons });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch coupons" });
  }
};

// ADMIN — delete coupon
const deleteCoupon = async (req, res) => {
  const { id } = req.params;
  try {
    await Coupon.findByIdAndDelete(id);
    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting coupon" });
  }
};

// USER — validate coupon
const validateCoupon = async (req, res) => {
  const { code } = req.params;
  try {
    const coupon = await Coupon.findOne({ code });
    if (!coupon) return res.status(404).json({ valid: false, message: "Invalid coupon" });

    res.status(200).json({ valid: true, discountPercent: coupon.discountPercent });
  } catch (err) {
    res.status(500).json({ valid: false, message: "Server error" });
  }
};

module.exports = {
  createCoupon,
  getAllCoupons,
  deleteCoupon,
  validateCoupon,
};
