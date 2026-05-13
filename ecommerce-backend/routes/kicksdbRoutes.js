const express = require("express");
const router = express.Router();

const kicksdbService = require("../services/kicksdbService");

router.get("/search", async (req, res, next) => {
  try {
    const query = req.query.q || "nike";

    const data = await kicksdbService.searchSneakers(query);

    res.json(data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;