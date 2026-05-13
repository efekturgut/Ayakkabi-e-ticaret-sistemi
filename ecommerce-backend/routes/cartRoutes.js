const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.get("/", cartController.getCart);
router.post("/", cartController.addItemToCart);
router.patch("/items/:itemId", cartController.updateCartItemQuantity);
router.delete("/items/:itemId", cartController.removeCartItem);
router.delete("/", cartController.clearCart);

module.exports = router;