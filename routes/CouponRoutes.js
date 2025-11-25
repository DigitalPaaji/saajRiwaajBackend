const express = require("express");
const router = express.Router();
const CouponController = require("../controllers/CouponController");
const adminAuth = require("../middleware/adminAuth");

// Admin routes
router.post("/", adminAuth, CouponController.createCoupon);
router.get("/", adminAuth, CouponController.getAllCoupons);
router.delete("/:id", adminAuth, CouponController.deleteCoupon);

// Public route
router.get("/:code", CouponController.validateCoupon);

module.exports = router;
