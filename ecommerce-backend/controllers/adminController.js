const adminService = require("../services/adminService");

const getDashboardStats = async (req, res, next) => {
  try {
    const dashboard = await adminService.getDashboardStats();

    res.json({
      dashboard,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};