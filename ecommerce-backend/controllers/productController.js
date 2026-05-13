const productService = require("../services/productService");

const getAllProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(Number(req.params.id));
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const searchProducts = async (req, res, next) => {
  try {
    const products = await productService.searchProducts(req.query.q);
    res.json(products);
  } catch (error) {
    next(error);
  }
};


const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);

    res.status(201).json({
      message: "Ürün başarıyla oluşturuldu",
      product,
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(
      Number(req.params.id),
      req.body
    );

    res.json({
      message: "Ürün başarıyla güncellendi",
      product,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await productService.deleteProduct(Number(req.params.id));

    res.json({
      message: "Ürün pasife alındı",
      product,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getAllProducts,
  getProductById,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};