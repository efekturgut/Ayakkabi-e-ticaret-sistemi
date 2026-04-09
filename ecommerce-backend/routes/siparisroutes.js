const express = require("express");
const router = express.Router();

const cart = require("../data/cart");
const orders = require("../data/orders");

router.post("/create", (req, res) => {
  if (cart.length === 0) {
    return res.status(400).json({ message: "Sepet boş" });
  }

  const totalPrice = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const newOrder = {
    id: orders.length + 1,
    items: [...cart],
    totalPrice,
    status: "pending",
  };

  orders.push(newOrder);

  res.status(201).json({
    message: "Sipariş oluşturuldu",
    order: newOrder,
  });
});

module.exports = router;