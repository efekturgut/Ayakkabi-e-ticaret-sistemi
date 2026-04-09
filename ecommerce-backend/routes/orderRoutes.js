const express = require("express");
const router = express.Router();

const cart = require("../data/cart");
const orders = require("../data/orders");
const products = require("../data/products");

// Tüm siparişleri getir
router.get("/", (req, res) => {
  res.json(orders);
});

// Sepetten sipariş oluştur
router.post("/create", (req, res) => {
  if (cart.length === 0) {
    return res.status(400).json({ message: "Sepet boş" });
  }

  for (let item of cart) {
    const product = products.find((p) => p.id === item.productId);

    if (!product) {
      return res.status(404).json({ message: `${item.name} ürünü bulunamadı` });
    }

    if (product.stock < item.quantity) {
      return res.status(400).json({
        message: `${product.name} için yeterli stok yok`
      });
    }
  }

  for (let item of cart) {
    const product = products.find((p) => p.id === item.productId);
    product.stock -= item.quantity;
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

  res.json({
    message: "Sipariş durumu güncellendi",
    order
  });
});

module.exports = router;