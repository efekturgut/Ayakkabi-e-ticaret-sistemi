const validateCreateProduct = (productDto) => {
  const errors = [];

  if (!productDto.name || productDto.name.trim() === "") {
    errors.push("Ürün adı zorunludur");
  }

  if (isNaN(productDto.price) || productDto.price <= 0) {
    errors.push("Fiyat 0'dan büyük bir sayı olmalıdır");
  }

  if (isNaN(productDto.stock) || productDto.stock < 0) {
    errors.push("Stok 0 veya daha büyük bir sayı olmalıdır");
  }

  return errors;
};

module.exports = { validateCreateProduct };