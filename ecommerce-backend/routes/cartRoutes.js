const express = require("express");
const router = express.Router();
const cart = require("../data/cart");

router.get("/", (req, res) => {
  const totalPrice = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  res.json({
    items: cart,
    totalPrice,
  });
});

module.exports = router;