const express = require("express");
const router = express.Router();

const cart = require("../data/cart");
const orders = require("../data/orders");

// Tüm siparişleri getir
router.get("/", (req, res) => {
  res.json(orders);
});

// Sepetten sipariş oluştur
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
    status: "pending"
  };

  orders.push(newOrder);

  cart.length = 0;

  res.status(201).json({
    message: "Sipariş oluşturuldu",
    order: newOrder
  });
});

module.exports = router;