const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get(
  "/products/:productId/reviews",
  reviewController.getReviewsByProductId
);

router.post(
  "/products/:productId/reviews",
  authMiddleware,
  reviewController.createReview
);

router.patch(
  "/reviews/:reviewId",
  authMiddleware,
  reviewController.updateReview
);

router.delete(
  "/reviews/:reviewId",
  authMiddleware,
  reviewController.deleteReview
);

module.exports = router;