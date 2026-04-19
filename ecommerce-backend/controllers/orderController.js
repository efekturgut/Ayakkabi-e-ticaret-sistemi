const orderService = require("../services/orderService");

exports.getOrders = (req, res, next) => {
  try {
    const result = orderService.getOrders();
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
};

exports.createOrder = (req, res, next) => {
  try {
    const result = orderService.createOrder();
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    const result = orderService.updateOrderStatus(id, status);
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
};