import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import "./Cart.css";

const formatPrice = (value) => {
  return `₺${Number(value || 0).toLocaleString("tr-TR")}`;
};

const Cart = () => {
  const [cart, setCart] = useState({ items: [], cartTotal: 0 });
  const [loading, setLoading] = useState(true);
  const [creatingOrder, setCreatingOrder] = useState(false);

  const [checkout, setCheckout] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    address: "",
    couponCode: "",
  });

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get("/cart");
      setCart(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Sepet alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;

    try {
      const response = await api.patch(`/cart/items/${itemId}`, {
        quantity,
      });

      setCart(response.data.cart);
      toast.success("Sepet güncellendi.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Sepet güncellenemedi.");
    }
  };

  const removeItem = async (itemId) => {
    try {
      const response = await api.delete(`/cart/items/${itemId}`);
      setCart(response.data.cart);
      toast.success("Ürün sepetten çıkarıldı.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Ürün silinemedi.");
    }
  };

  const handleCheckoutChange = (event) => {
    setCheckout((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const createOrder = async (event) => {
    event.preventDefault();

    if (cart.items.length === 0) {
      toast.error("Sepet boş.");
      return;
    }

    try {
      setCreatingOrder(true);

      const payload = {
        customerName: checkout.customerName,
        customerEmail: checkout.customerEmail,
        customerPhone: checkout.customerPhone,
        address: checkout.address,
      };

      if (checkout.couponCode) {
        payload.couponCode = checkout.couponCode;
      }

      await api.post("/orders", payload);

      toast.success("Sipariş oluşturuldu.");
      setCart({ items: [], cartTotal: 0 });

      setCheckout({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        address: "",
        couponCode: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Sipariş oluşturulamadı.");
    } finally {
      setCreatingOrder(false);
    }
  };

  if (loading) {
    return (
      <main className="page">
        <section className="container">
          <div className="empty-state">Sepet yükleniyor...</div>
        </section>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <section className="cart-hero">
        <div className="container">
          <span className="products-hero__badge">Checkout Flow</span>
          <h1>Your Cart.</h1>
          <p>Sepetindeki ürünleri kontrol et, kupon kodunu gir ve siparişi tamamla.</p>
        </div>
      </section>

      <section className="container cart-layout">
        <div className="cart-items">
          <div className="cart-head">
            <h2>Sepet</h2>
            <span>{cart.items.length} ürün</span>
          </div>

          {cart.items.length === 0 ? (
            <div className="empty-state">Sepetinde ürün yok.</div>
          ) : (
            cart.items.map((item) => (
              <article className="cart-item" key={item.cartItemId}>
                <div className="cart-item__image">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} />
                  ) : (
                    <span>KicksHub</span>
                  )}
                </div>

                <div className="cart-item__info">
                  <span>{item.brand}</span>
                  <h3>{item.name}</h3>
                  <p>Numara: {item.size}</p>
                  <strong>{formatPrice(item.finalPrice)}</strong>
                </div>

                <div className="cart-item__actions">
                  <div className="quantity-box">
                    <button
                      onClick={() =>
                        updateQuantity(item.cartItemId, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.cartItemId, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="cart-remove"
                    onClick={() => removeItem(item.cartItemId)}
                  >
                    Sil
                  </button>
                </div>

                <div className="cart-item__total">
                  {formatPrice(item.totalPrice)}
                </div>
              </article>
            ))
          )}
        </div>

        <aside className="checkout-card">
          <h2>Checkout</h2>

          <div className="checkout-summary">
            <div>
              <span>Ara toplam</span>
              <strong>{formatPrice(cart.cartTotal)}</strong>
            </div>
            <div>
              <span>Kargo</span>
              <strong>Ücretsiz</strong>
            </div>
          </div>

          <form onSubmit={createOrder} className="checkout-form">
            <div className="form-group">
              <label>Ad Soyad</label>
              <input
                name="customerName"
                value={checkout.customerName}
                onChange={handleCheckoutChange}
                placeholder="Efe Kağan Turgut"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="customerEmail"
                value={checkout.customerEmail}
                onChange={handleCheckoutChange}
                placeholder="efe@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Telefon</label>
              <input
                name="customerPhone"
                value={checkout.customerPhone}
                onChange={handleCheckoutChange}
                placeholder="05555555555"
              />
            </div>

            <div className="form-group">
              <label>Adres</label>
              <textarea
                name="address"
                value={checkout.address}
                onChange={handleCheckoutChange}
                placeholder="İstanbul / Türkiye"
                required
              />
            </div>

            <div className="form-group">
              <label>Kupon Kodu</label>
              <input
                name="couponCode"
                value={checkout.couponCode}
                onChange={handleCheckoutChange}
                placeholder="WELCOME10"
              />
            </div>

            <button
              className="btn btn-accent checkout-btn"
              disabled={creatingOrder || cart.items.length === 0}
            >
              {creatingOrder ? "Oluşturuluyor..." : "Siparişi Tamamla"}
            </button>
          </form>
        </aside>
      </section>
    </main>
  );
};

export default Cart;