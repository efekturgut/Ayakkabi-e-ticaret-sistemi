const favoriteService = require("../services/favoriteService");

const getFavorites = async (req, res, next) => {
  try {
    const favorites = await favoriteService.getFavorites(req.user.id);

    res.json({
      favorites,
    });
  } catch (error) {
    next(error);
  }
};

const addFavorite = async (req, res, next) => {
  try {
    const favorites = await favoriteService.addFavorite(
      req.user.id,
      Number(req.params.productId)
    );

    res.status(201).json({
      message: "Ürün favorilere eklendi",
      favorites,
    });
  } catch (error) {
    next(error);
  }
};

const removeFavorite = async (req, res, next) => {
  try {
    const favorites = await favoriteService.removeFavorite(
      req.user.id,
      Number(req.params.productId)
    );

    res.json({
      message: "Ürün favorilerden çıkarıldı",
      favorites,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
};