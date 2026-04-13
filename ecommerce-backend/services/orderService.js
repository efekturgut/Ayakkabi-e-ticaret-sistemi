const orderRepository = require("../repositories/orderRepository");

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
    return {
      status: 400,
      data: { message: "Sepet boş" }
    };
  }

  for (const item of cart) {
    const product = orderRepository.getProductById(item.productId);

    if (!product) {
      return {
        status: 404,
        data: { message: `Ürün bulunamadı. productId: ${item.productId}` }
      };
    }

    if (product.stock < item.quantity) {
      return {
        status: 400,
        data: { message: `${product.name} için stok yetersiz` }
      };
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
    return {
      status: 404,
      data: { message: "Sipariş bulunamadı" }
    };
  }

  const validStatuses = ["pending", "shipped", "delivered"];

  if (!status || !validStatuses.includes(status)) {
    return {
      status: 400,
      data: {
        message: "Geçerli bir status girin: pending, shipped, delivered"
      }
    };
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