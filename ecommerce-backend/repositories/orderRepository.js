const cart = require("../data/cart");
const orders = require("../data/orders");
const products = require("../data/products");

exports.getCart = () => cart;

exports.getOrders = () => orders;

exports.getOrderById = (id) => {
  return orders.find((order) => order.id === id);
};

exports.getProductById = (id) => {
  return products.find((product) => product.id === id);
};

exports.updateProductStock = (productId, quantity) => {
  const product = products.find((p) => p.id === productId);

  if (product) {
    product.stock -= quantity;
  }
};

exports.saveOrder = (order) => {
  orders.push(order);
};

exports.clearCart = () => {
  cart.length = 0;
};