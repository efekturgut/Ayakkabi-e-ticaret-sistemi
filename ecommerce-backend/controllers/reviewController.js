const reviewService = require("../services/reviewService");

const getReviewsByProductId = async (req, res, next) => {
  try {
    const reviews = await reviewService.getReviewsByProductId(
      Number(req.params.productId)
    );

    res.json({
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

const createReview = async (req, res, next) => {
  try {
    const review = await reviewService.createReview(
      req.user.id,
      Number(req.params.productId),
      req.body
    );

    res.status(201).json({
      message: "Yorum başarıyla kaydedildi",
      review,
    });
  } catch (error) {
    next(error);
  }
};

const updateReview = async (req, res, next) => {
  try {
    const review = await reviewService.updateReview(
      req.user.id,
      Number(req.params.reviewId),
      req.body
    );

    res.json({
      message: "Yorum güncellendi",
      review,
    });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await reviewService.deleteReview(
      req.user.id,
      Number(req.params.reviewId)
    );

    res.json({
      message: "Yorum silindi",
      review,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReviewsByProductId,
  createReview,
  updateReview,
  deleteReview,
};