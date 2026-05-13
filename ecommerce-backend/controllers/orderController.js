const orderService = require("../services/orderService");

const createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrderFromCart(req.body);

    res.status(201).json({
      message: "Sipariş başarıyla oluşturuldu",
      order,
    });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(Number(req.params.id));
    res.json(order);
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatus(
      Number(req.params.id),
      req.body.status
    );

    res.json({
      message: "Sipariş durumu güncellendi",
      order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};