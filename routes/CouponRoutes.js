const express = require("express");
const router = express.Router();
const CouponController = require("../controllers/CouponController");
const adminAuth = require("../middleware/adminAuth");


router.post("/", adminAuth, CouponController.createCoupon);
router.get("/", adminAuth, CouponController.getAllCoupons);
router.get("/all", CouponController.getAllCoupons);
router.delete("/:id", adminAuth, CouponController.deleteCoupon);


router.get("/:code", CouponController.validateCoupon);

module.exports = router;
   

