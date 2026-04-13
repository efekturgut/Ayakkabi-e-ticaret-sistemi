const orderService = require("../services/orderService");

exports.createOrder = (req, res) => {
  const result = orderService.createOrder();

  res.status(result.status).json(result.data);
};