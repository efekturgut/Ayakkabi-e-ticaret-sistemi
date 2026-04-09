const express = require("express");
const router = express.Router();

// Fake veri (geçici)
let orders = [];

// 📌 Tüm siparişleri getir
router.get("/", (req, res) => {
  res.json(orders);
});

// 📌 Yeni sipariş oluştur
router.post("/", (req, res) => {
  const newOrder = {
    id: Date.now(),
    items: req.body.items || [],
    total: req.body.total || 0,
    status: "Hazırlanıyor"
  };

  orders.push(newOrder);
  res.status(201).json(newOrder);
});

// 📌 Sipariş durumunu güncelle
router.put("/:id", (req, res) => {
  const order = orders.find(o => o.id == req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Sipariş bulunamadı" });
  }

  order.status = req.body.status || order.status;

  res.json(order);
});

// 📌 Sipariş sil
router.delete("/:id", (req, res) => {
  orders = orders.filter(o => o.id != req.params.id);

  res.json({ message: "Sipariş silindi" });
});

module.exports = router;