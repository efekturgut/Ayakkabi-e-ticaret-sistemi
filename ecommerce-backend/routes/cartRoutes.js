const express = require("express");
const router = express.Router();

const cart = require("../data/cart");
const products = require("../data/products");

router.get("/", (req, res) => {
  res.json(cart);
});

router.post("/", (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res.status(400).json({ message: "productId ve quantity gerekli" });
  }

  const product = products.find((p) => p.id === productId);

  if (!product) {
    return res.status(404).json({ message: "Ürün bulunamadı" });
  }

  const existingItem = cart.find((item) => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity
    });
  }

  res.status(201).json({
    message: "Ürün sepete eklendi",
    cart
  });
});

router.delete("/:productId", (req, res) => {
  const productId = Number(req.params.productId);
  const index = cart.findIndex((item) => item.productId === productId);

  if (index === -1) {
    return res.status(404).json({ message: "Sepette ürün bulunamadı" });
  }

  cart.splice(index, 1);

  res.json({
    message: "Ürün sepetten silindi",
    cart
  });
});

module.exports = router;