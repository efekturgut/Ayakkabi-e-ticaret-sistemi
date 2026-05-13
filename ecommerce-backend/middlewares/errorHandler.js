const errorHandler = (err, req, res, next) => {
  console.error("Hata:", err.message);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || "Sunucu hatası"
  });
};

module.exports = errorHandler;