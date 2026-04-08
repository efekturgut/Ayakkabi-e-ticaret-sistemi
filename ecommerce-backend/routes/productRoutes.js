const express = require("express");
const router = express.Router();
const products = require("../data/products");

// Search
router.get("/search", (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: "Arama kelimesi gerekli" });
  }

  const result = products.filter((product) =>
    product.name.toLowerCase().includes(q.toLowerCase())
  );

  res.json(result);
});

// Tüm ürünler
router.get("/", (req, res) => {
  res.json(products);
});

// Tek ürün
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ message: "Ürün bulunamadı" });
  }

  res.json(product);
});

module.exports = router;