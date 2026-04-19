const orderRepository = require("../repositories/orderRepository");
const AppError = require("../utils/AppError");

exports.getOrders = () => {
  const orders = orderRepository.getOrders();

  return {
    status: 200,
    data: orders
  };
};

exports.createOrder = () => {
  const cart = orderRepository.getCart();

  if (cart.length === 0) {
  throw new AppError("Sepet boş", 400);
}


  for (const item of cart) {
    const product = orderRepository.getProductById(item.productId);

if (!product) {
  throw new AppError(`Ürün bulunamadı. productId: ${item.productId}`, 404);
}
  if (product.stock < item.quantity) {
  throw new AppError(`${product.name} için stok yetersiz`, 400);
}
  }

  for (const item of cart) {
    orderRepository.updateProductStock(item.productId, item.quantity);
  }

  const totalPrice = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const newOrder = {
    id: Date.now(),
    items: [...cart],
    totalPrice,
    status: "pending"
  };

  orderRepository.saveOrder(newOrder);
  orderRepository.clearCart();

  return {
    status: 201,
    data: {
      message: "Sipariş oluşturuldu",
      order: newOrder
    }
  };
};

exports.updateOrderStatus = (id, status) => {
  const order = orderRepository.getOrderById(id);

if (!order) {
  throw new AppError("Sipariş bulunamadı", 404);
}
  const validStatuses = ["pending", "shipped", "delivered"];

 if (!status || !validStatuses.includes(status)) {
  throw new AppError(
    "Geçerli bir status girin: pending, shipped, delivered",
    400
  );
}
  order.status = status;

  let notification = "";

  if (status === "pending") {
    notification = "Siparişiniz alındı";
  } else if (status === "shipped") {
    notification = "Siparişiniz kargoya verildi";
  } else if (status === "delivered") {
    notification = "Siparişiniz teslim edildi";
  }

  return {
    status: 200,
    data: {
      message: "Sipariş durumu güncellendi",
      notification,
      order
    }
  };
};