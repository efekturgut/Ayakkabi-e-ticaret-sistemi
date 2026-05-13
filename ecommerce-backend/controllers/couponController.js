const couponService = require("../services/couponService");

const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await couponService.getAllCoupons();

    res.json({
      coupons,
    });
  } catch (error) {
    next(error);
  }
};

const createCoupon = async (req, res, next) => {
  try {
    const coupon = await couponService.createCoupon(req.body);

    res.status(201).json({
      message: "Kupon oluşturuldu",
      coupon,
    });
  } catch (error) {
    next(error);
  }
};

const updateCouponStatus = async (req, res, next) => {
  try {
    const coupon = await couponService.updateCouponStatus(
      Number(req.params.id),
      req.body.isActive
    );

    res.json({
      message: "Kupon durumu güncellendi",
      coupon,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCoupons,
  createCoupon,
  updateCouponStatus,
};