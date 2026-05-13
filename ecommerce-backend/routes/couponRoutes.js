const express = require("express");
const router = express.Router();

const couponController = require("../controllers/couponController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/", couponController.getAllCoupons);
router.post("/", couponController.createCoupon);
router.patch("/:id/status", couponController.updateCouponStatus);

module.exports = router;