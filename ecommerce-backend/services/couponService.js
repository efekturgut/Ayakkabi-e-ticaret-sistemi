const couponRepository = require("../repositories/couponRepository");

const calculateCouponDiscount = async (couponCode, cartTotal) => {
  if (!couponCode) {
    return {
      coupon: null,
      discountAmount: 0,
      finalPrice: cartTotal,
    };
  }

  const coupon = await couponRepository.getCouponByCode(couponCode);

  if (!coupon) {
    const error = new Error("Kupon bulunamadı");
    error.statusCode = 404;
    throw error;
  }

  if (!coupon.is_active) {
    const error = new Error("Bu kupon aktif değil");
    error.statusCode = 400;
    throw error;
  }

  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    const error = new Error("Kuponun süresi dolmuş");
    error.statusCode = 400;
    throw error;
  }

  if (
    coupon.usage_limit !== null &&
    Number(coupon.used_count) >= Number(coupon.usage_limit)
  ) {
    const error = new Error("Kupon kullanım limiti dolmuş");
    error.statusCode = 400;
    throw error;
  }

  if (Number(cartTotal) < Number(coupon.min_order_amount)) {
    const error = new Error(
      `Bu kupon için minimum sepet tutarı ${coupon.min_order_amount} TL olmalıdır`
    );
    error.statusCode = 400;
    throw error;
  }

  let discountAmount = 0;

  if (coupon.discount_type === "percentage") {
    discountAmount = (Number(cartTotal) * Number(coupon.discount_value)) / 100;
  }

  if (coupon.discount_type === "fixed") {
    discountAmount = Number(coupon.discount_value);
  }

  if (discountAmount > Number(cartTotal)) {
    discountAmount = Number(cartTotal);
  }

  const finalPrice = Number(cartTotal) - Number(discountAmount);

  return {
    coupon,
    discountAmount,
    finalPrice,
  };
};

const getAllCoupons = async () => {
  return await couponRepository.getAllCoupons();
};

const createCoupon = async (data) => {
  const { code, discountType, discountValue } = data;

  if (!code || !discountType || !discountValue) {
    const error = new Error("code, discountType ve discountValue zorunludur");
    error.statusCode = 400;
    throw error;
  }

  if (!["percentage", "fixed"].includes(discountType)) {
    const error = new Error("discountType sadece percentage veya fixed olabilir");
    error.statusCode = 400;
    throw error;
  }

  if (Number(discountValue) <= 0) {
    const error = new Error("discountValue 0'dan büyük olmalıdır");
    error.statusCode = 400;
    throw error;
  }

  return await couponRepository.createCoupon(data);
};

const updateCouponStatus = async (couponId, isActive) => {
  if (!couponId || isNaN(couponId)) {
    const error = new Error("Geçerli bir kupon ID gerekli");
    error.statusCode = 400;
    throw error;
  }

  if (typeof isActive !== "boolean") {
    const error = new Error("isActive boolean olmalıdır");
    error.statusCode = 400;
    throw error;
  }

  const coupon = await couponRepository.updateCouponStatus(couponId, isActive);

  if (!coupon) {
    const error = new Error("Kupon bulunamadı");
    error.statusCode = 404;
    throw error;
  }

  return coupon;
};

module.exports = {
  calculateCouponDiscount,
  getAllCoupons,
  createCoupon,
  updateCouponStatus,
};