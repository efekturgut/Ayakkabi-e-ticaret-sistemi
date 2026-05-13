const orderRepository = require("../repositories/orderRepository");

const createOrderFromCart = async (
  userId,
  { customerName, customerEmail, customerPhone, address }
) => {
  if (!customerName || !customerEmail || !address) {
    const error = new Error("customerName, customerEmail ve address zorunludur");
    error.statusCode = 400;
    throw error;
  }

  const cartItems = await orderRepository.getCartItemsForOrder(userId);

  if (cartItems.length === 0) {
    const error = new Error("Sepet boş, sipariş oluşturulamaz");
    error.statusCode = 400;
    throw error;
  }

  for (const item of cartItems) {
    if (Number(item.stock) < Number(item.quantity)) {
      const error = new Error(`${item.name} için yeterli stok yok`);
      error.statusCode = 400;
      throw error;
    }
  }

  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + Number(item.unitPrice) * Number(item.quantity);
  }, 0);

  const order = await orderRepository.createOrder({
    userId,
    totalPrice,
    customerName,
    customerEmail,
    customerPhone,
    address,
  });

  for (const item of cartItems) {
    const unitPrice = Number(item.unitPrice);
    const quantity = Number(item.quantity);
    const itemTotalPrice = unitPrice * quantity;

    await orderRepository.createOrderItem({
      orderId: order.id,
      productId: item.productId,
      variantId: item.variantId,
      quantity,
      unitPrice,
      totalPrice: itemTotalPrice,
    });

    await orderRepository.decreaseVariantStock(item.variantId, quantity);
  }

  await orderRepository.clearCart(userId);

  return await orderRepository.getOrderById(userId, "user", order.id);
};

const getAllOrders = async (userId, role) => {
  if (role === "admin") {
    return await orderRepository.getAllOrdersForAdmin();
  }

  return await orderRepository.getOrdersByUserId(userId);
};

const getOrderById = async (userId, role, orderId) => {
  if (!orderId || isNaN(orderId)) {
    const error = new Error("Geçerli bir sipariş ID gerekli");
    error.statusCode = 400;
    throw error;
  }

  const order = await orderRepository.getOrderById(userId, role, orderId);

  if (!order) {
    const error = new Error("Sipariş bulunamadı");
    error.statusCode = 404;
    throw error;
  }

  return order;
};

const updateOrderStatus = async (role, orderId, status) => {
  if (role !== "admin") {
    const error = new Error("Sipariş durumu güncellemek için admin yetkisi gerekli");
    error.statusCode = 403;
    throw error;
  }

  const allowedStatuses = [
    "pending",
    "confirmed",
    "preparing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!allowedStatuses.includes(status)) {
    const error = new Error("Geçersiz sipariş durumu");
    error.statusCode = 400;
    throw error;
  }

  const updatedOrder = await orderRepository.updateOrderStatus(orderId, status);

  if (!updatedOrder) {
    const error = new Error("Sipariş bulunamadı");
    error.statusCode = 404;
    throw error;
  }

  return updatedOrder;
};

module.exports = {
  createOrderFromCart,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};