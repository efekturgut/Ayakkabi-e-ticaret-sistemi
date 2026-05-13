const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    const error = new Error("Admin yetkisi gerekli");
    error.statusCode = 403;
    return next(error);
  }

  next();
};

module.exports = adminMiddleware;