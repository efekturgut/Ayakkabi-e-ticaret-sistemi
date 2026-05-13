const orderRepository = require("../repositories/orderRepository");

const createOrderFromCart = async ({
  customerName,
  customerEmail,
  customerPhone,
  address,
}) => {
  if (!customerName || !customerEmail || !address) {
    const error = new Error("customerName, customerEmail ve address zorunludur");
    error.statusCode = 400;
    throw error;
  }

  const cartItems = await orderRepository.getCartItemsForOrder();

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

  await orderRepository.clearCart();

  return await orderRepository.getOrderById(order.id);
};

const getAllOrders = async () => {
  return await orderRepository.getAllOrders();
};

const getOrderById = async (orderId) => {
  if (!orderId || isNaN(orderId)) {
    const error = new Error("Geçerli bir sipariş ID gerekli");
    error.statusCode = 400;
    throw error;
  }

  const order = await orderRepository.getOrderById(orderId);

  if (!order) {
    const error = new Error("Sipariş bulunamadı");
    error.statusCode = 404;
    throw error;
  }

  return order;
};

const updateOrderStatus = async (orderId, status) => {
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