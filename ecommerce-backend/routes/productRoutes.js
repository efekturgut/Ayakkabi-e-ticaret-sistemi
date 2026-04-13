const express = require("express");
const router = express.Router();

const products = require("../data/products");

router.get("/", (req, res) => {
  res.json(products);
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ message: "Ürün bulunamadı" });
  }

  res.json(product);
});

module.exports = router;