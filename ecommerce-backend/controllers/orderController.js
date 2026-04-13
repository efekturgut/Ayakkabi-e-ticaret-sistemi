const orderService = require("../services/orderService");

exports.getOrders = (req, res) => {
  const result = orderService.getOrders();
  res.status(result.status).json(result.data);
};

exports.createOrder = (req, res) => {
  const result = orderService.createOrder();
  res.status(result.status).json(result.data);
};

exports.updateOrderStatus = (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;

  const result = orderService.updateOrderStatus(id, status);
  res.status(result.status).json(result.data);
};