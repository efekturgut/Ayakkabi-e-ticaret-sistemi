const express = require("express");
const router = express.Router();

const orderService = require("../services/orderService");
const cart = require("../data/cart");
const orders = require("../data/orders");
const products = require("../data/products");

// Tüm siparişleri getir
router.get("/", (req, res) => {
  res.json(orders);
});

// Sepetten sipariş oluştur
router.post("/create", (req, res) => {
  const result = orderService.createOrder();
  res.status(result.status).json(result.data);
});
// Sipariş durumunu güncelle
router.put("/:id/status", (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return res.status(404).json({ message: "Sipariş bulunamadı" });
  }

  const validStatuses = ["pending", "shipped", "delivered"];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      message: "Geçerli bir status girin: pending, shipped, delivered"
    });
  }

  order.status = status;

  let notification = "";

  if (status === "pending") {
    notification = "Siparişiniz alındı";
  } else if (status === "shipped") {
    notification = "Siparişiniz kargoya verildi";
  } else if (status === "delivered") {
    notification = "Siparişiniz teslim edildi";
  }

  res.json({
    message: "Sipariş durumu güncellendi",
    notification,
    order
  });
});

module.exports = router;