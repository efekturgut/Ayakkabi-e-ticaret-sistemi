const reviewRepository = require("../repositories/reviewRepository");

const getReviewsByProductId = async (productId) => {
  if (!productId || isNaN(productId)) {
    const error = new Error("Geçerli bir ürün ID gerekli");
    error.statusCode = 400;
    throw error;
  }

  return await reviewRepository.getReviewsByProductId(productId);
};

const createReview = async (userId, productId, { rating, comment }) => {
  if (!productId || isNaN(productId)) {
    const error = new Error("Geçerli bir ürün ID gerekli");
    error.statusCode = 400;
    throw error;
  }

  const product = await reviewRepository.productExists(productId);

  if (!product) {
    const error = new Error("Ürün bulunamadı");
    error.statusCode = 404;
    throw error;
  }

  if (!rating || rating < 1 || rating > 5) {
    const error = new Error("Rating 1 ile 5 arasında olmalıdır");
    error.statusCode = 400;
    throw error;
  }

  return await reviewRepository.createReview({
    userId,
    productId,
    rating,
    comment,
  });
};

const updateReview = async (userId, reviewId, { rating, comment }) => {
  if (!reviewId || isNaN(reviewId)) {
    const error = new Error("Geçerli bir yorum ID gerekli");
    error.statusCode = 400;
    throw error;
  }

  if (rating && (rating < 1 || rating > 5)) {
    const error = new Error("Rating 1 ile 5 arasında olmalıdır");
    error.statusCode = 400;
    throw error;
  }

  const review = await reviewRepository.updateReview({
    userId,
    reviewId,
    rating,
    comment,
  });

  if (!review) {
    const error = new Error("Yorum bulunamadı veya bu işlem için yetkin yok");
    error.statusCode = 404;
    throw error;
  }

  return review;
};

const deleteReview = async (userId, reviewId) => {
  if (!reviewId || isNaN(reviewId)) {
    const error = new Error("Geçerli bir yorum ID gerekli");
    error.statusCode = 400;
    throw error;
  }

  const review = await reviewRepository.deleteReview(userId, reviewId);

  if (!review) {
    const error = new Error("Yorum bulunamadı veya bu işlem için yetkin yok");
    error.statusCode = 404;
    throw error;
  }

  return review;
};

module.exports = {
  getReviewsByProductId,
  createReview,
  updateReview,
  deleteReview,
};