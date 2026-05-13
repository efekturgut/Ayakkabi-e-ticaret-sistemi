const adminRepository = require("../repositories/adminRepository");

const getDashboardStats = async () => {
  return await adminRepository.getDashboardStats();
};

module.exports = {
  getDashboardStats,
};