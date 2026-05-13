const cartService = require("../services/cartService");

const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCart(req.user.id);
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

const addItemToCart = async (req, res, next) => {
  try {
    const cart = await cartService.addItemToCart(req.user.id, req.body);

    res.status(201).json({
      message: "Ürün sepete eklendi",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

const updateCartItemQuantity = async (req, res, next) => {
  try {
    const cart = await cartService.updateCartItemQuantity(
      req.user.id,
      Number(req.params.itemId),
      Number(req.body.quantity)
    );

    res.json({
      message: "Sepet ürünü güncellendi",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

const removeCartItem = async (req, res, next) => {
  try {
    const cart = await cartService.removeCartItem(
      req.user.id,
      Number(req.params.itemId)
    );

    res.json({
      message: "Ürün sepetten silindi",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const cart = await cartService.clearCart(req.user.id);

    res.json({
      message: "Sepet temizlendi",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
};