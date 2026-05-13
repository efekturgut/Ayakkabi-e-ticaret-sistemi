const cartRepository = require("../repositories/cartRepository");

const getCart = async () => {
  const items = await cartRepository.getCartItems();

  const cartTotal = items.reduce((sum, item) => {
    return sum + Number(item.totalPrice);
  }, 0);

  return {
    items,
    cartTotal,
  };
};

const addItemToCart = async ({ productId, variantId, quantity }) => {
  if (!productId || !variantId) {
    const error = new Error("productId ve variantId zorunludur");
    error.statusCode = 400;
    throw error;
  }

  const itemQuantity = quantity || 1;

  if (itemQuantity < 1) {
    const error = new Error("Adet en az 1 olmalıdır");
    error.statusCode = 400;
    throw error;
  }

  const variant = await cartRepository.getVariantById(variantId);

  if (!variant) {
    const error = new Error("Ürün varyantı bulunamadı");
    error.statusCode = 404;
    throw error;
  }

  if (variant.stock < itemQuantity) {
    const error = new Error("Yeterli stok yok");
    error.statusCode = 400;
    throw error;
  }

  await cartRepository.addItemToCart({
    productId,
    variantId,
    quantity: itemQuantity,
  });

  return await getCart();
};

const updateCartItemQuantity = async (cartItemId, quantity) => {
  if (!quantity || quantity < 1) {
    const error = new Error("Geçerli bir adet giriniz");
    error.statusCode = 400;
    throw error;
  }

  const updatedItem = await cartRepository.updateCartItemQuantity(
    cartItemId,
    quantity
  );

  if (!updatedItem) {
    const error = new Error("Sepet ürünü bulunamadı");
    error.statusCode = 404;
    throw error;
  }

  return await getCart();
};

const removeCartItem = async (cartItemId) => {
  const deletedItem = await cartRepository.removeCartItem(cartItemId);

  if (!deletedItem) {
    const error = new Error("Sepet ürünü bulunamadı");
    error.statusCode = 404;
    throw error;
  }

  return await getCart();
};

const clearCart = async () => {
  await cartRepository.clearCart();

  return {
    items: [],
    cartTotal: 0,
  };
};

module.exports = {
  getCart,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
};