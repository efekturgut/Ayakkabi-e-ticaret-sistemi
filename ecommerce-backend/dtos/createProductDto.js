class CreateProductDto {
  constructor(name, price, stock) {
    this.name = name;
    this.price = Number(price);
    this.stock = Number(stock);
  }
}

module.exports = CreateProductDto;