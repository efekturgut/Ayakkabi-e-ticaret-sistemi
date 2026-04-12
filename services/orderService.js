const cart = require("../data/cart");
const orders = require("../data/orders");
const products = require("../data/products");

exports.createOrder = () => {
  if (cart.length === 0) {
    return { status: 400, data: { message: "Sepet boş" } };
  }

  for (let item of cart) {
    const product = products.find(p => p.id === item.productId);

    if (!product) {
      return { status: 404, data: { message: "Ürün bulunamadı" } };
    }

    if (product.stock < item.quantity) {
      return { status: 400, data: { message: "Stok yetersiz" } };
    }
  }

  for (let item of cart) {
    const product = products.find(p => p.id === item.productId);
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

  return {
    status: 201,
    data: {
      message: "Sipariş oluşturuldu",
      notification: "Siparişiniz alındı",
      order: newOrder
    }
  };
};