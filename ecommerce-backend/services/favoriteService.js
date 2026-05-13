const favoriteRepository = require("../repositories/favoriteRepository");

const getFavorites = async (userId) => {
  return await favoriteRepository.getFavoritesByUserId(userId);
};

const addFavorite = async (userId, productId) => {
  if (!productId || isNaN(productId)) {
    const error = new Error("Geçerli bir ürün ID gerekli");
    error.statusCode = 400;
    throw error;
  }

  const product = await favoriteRepository.productExists(productId);

  if (!product) {
    const error = new Error("Ürün bulunamadı");
    error.statusCode = 404;
    throw error;
  }

  await favoriteRepository.addFavorite(userId, productId);

  return await favoriteRepository.getFavoritesByUserId(userId);
};

const removeFavorite = async (userId, productId) => {
  if (!productId || isNaN(productId)) {
    const error = new Error("Geçerli bir ürün ID gerekli");
    error.statusCode = 400;
    throw error;
  }

  const deletedFavorite = await favoriteRepository.removeFavorite(
    userId,
    productId
  );

  if (!deletedFavorite) {
    const error = new Error("Favori bulunamadı");
    error.statusCode = 404;
    throw error;
  }

  return await favoriteRepository.getFavoritesByUserId(userId);
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
};