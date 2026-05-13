const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

// Public routes
router.get("/", productController.getAllProducts);
router.get("/search", productController.searchProducts);

// Admin product routes
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  productController.createProduct
);

router.patch(
  "/:id",
  authMiddleware,
  adminMiddleware,
  productController.updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  productController.deleteProduct
);

// Admin product variant routes
router.post(
  "/:productId/variants",
  authMiddleware,
  adminMiddleware,
  productController.createProductVariant
);

router.patch(
  "/variants/:variantId",
  authMiddleware,
  adminMiddleware,
  productController.updateProductVariant
);

router.delete(
  "/variants/:variantId",
  authMiddleware,
  adminMiddleware,
  productController.deleteProductVariant
);

// Bu en altta kalmalı
router.get("/:id", productController.getProductById);

module.exports = router;