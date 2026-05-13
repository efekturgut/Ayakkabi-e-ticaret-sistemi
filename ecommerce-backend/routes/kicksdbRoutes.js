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

router.post("/import", async (req, res, next) => {
  try {
    const query = req.body.query || "nike";

    const result = await kicksdbService.importSneakers(query);

    res.status(201).json({
      message: "KicksDB ürünleri database'e aktarıldı",
      result,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;