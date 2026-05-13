const orderService = require("../services/orderService");

const createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrderFromCart(req.user.id, req.body);

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
    const orders = await orderService.getAllOrders(req.user.id, req.user.role);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(
      req.user.id,
      req.user.role,
      Number(req.params.id)
    );

    res.json(order);
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatus(
      req.user.role,
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