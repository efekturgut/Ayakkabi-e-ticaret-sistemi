const express = require("express");
const router = express.Router();
const products = require("../data/products");
const CreateProductDto = require("../dtos/createProductDto");
const { validateCreateProduct } = require("../validations/productValidation");

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



// Yeni ürün ekle
router.post("/", (req, res) => {
  const { name, price, stock } = req.body;

  const productDto = new CreateProductDto(name, price, stock);

  const errors = validateCreateProduct(productDto);

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation hatası",
      errors
    });
  }

  const newProduct = {
    id: products.length + 1,
    name: productDto.name,
    price: productDto.price,
    stock: productDto.stock
  };

  products.push(newProduct);

  res.status(201).json({
    message: "Ürün oluşturuldu",
    product: newProduct
  });
});

module.exports = router;