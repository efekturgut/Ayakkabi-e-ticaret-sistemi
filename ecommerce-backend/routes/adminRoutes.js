const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/dashboard", adminController.getDashboardStats);

module.exports = router;