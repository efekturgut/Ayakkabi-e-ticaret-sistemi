const express = require("express");
const router = express.Router();
const cart = require("../data/cart");
const products = require("../data/products");

router.get("/", (req, res) => {
  const totalPrice = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  res.json({
    items: cart,
    totalPrice,
  });
});

router.post("/add", (req, res) => {
  const { productId, quantity } = req.body;

  const product = products.find((p) => p.id === Number(productId));

  if (!product) {
    return res.status(404).json({ message: "Ürün bulunamadı" });
  }

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: "Geçerli bir adet girin" });
  }

  if (quantity > product.stock) {
    return res.status(400).json({ message: "Yeterli stok yok" });
  }

  const existingItem = cart.find((item) => item.productId === product.id);

  if (existingItem) {
    if (existingItem.quantity + quantity > product.stock) {
      return res.status(400).json({ message: "Stok aşılıyor" });
    }

    existingItem.quantity += quantity;
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
    });
  }

  res.json({
    message: "Ürün sepete eklendi",
    cart,
  });
});

module.exports = router;