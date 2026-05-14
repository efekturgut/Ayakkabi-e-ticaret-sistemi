import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "./ProductDetail.css";

const formatPrice = (value) => {
  return `₺${Number(value || 0).toLocaleString("tr-TR")}`;
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingCart, setAddingCart] = useState(false);

  const imageUrl = product?.imageUrl || product?.image_url;
  const discountPrice = product?.discountPrice || product?.discount_price;
  const finalPrice = discountPrice || product?.price;

  const availableVariants = useMemo(() => {
    return product?.variants?.filter((variant) => variant.stock > 0) || [];
  }, [product]);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/products/${id}`);
      const productData = response.data;

      setProduct(productData);

      const firstAvailableVariant =
        productData.variants?.find((variant) => variant.stock > 0) || null;

      setSelectedVariant(firstAvailableVariant);
    } catch (error) {
      console.error("Ürün detayı alınamadı:", error);
      toast.error("Ürün detayı alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Sepete eklemek için giriş yapmalısın.");
      navigate("/login");
      return;
    }

    if (!selectedVariant) {
      toast.error("Lütfen bir numara seç.");
      return;
    }

    try {
      setAddingCart(true);

      await api.post("/cart", {
        productId: product.id,
        variantId: selectedVariant.id,
        quantity,
      });

      toast.success("Ürün sepete eklendi.");
      navigate("/cart");
    } catch (error) {
      toast.error(error.response?.data?.message || "Sepete eklenemedi.");
    } finally {
      setAddingCart(false);
    }
  };

  if (loading) {
    return (
      <main className="page">
        <section className="container">
          <div className="detail-loading">Ürün yükleniyor...</div>
        </section>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="page">
        <section className="container">
          <div className="empty-state">Ürün bulunamadı.</div>
        </section>
      </main>
    );
  }

  return (
    <main className="detail-page">
      <section className="container detail-layout">
        <div className="detail-gallery">
          <div className="detail-image-card">
            {imageUrl ? (
              <img src={imageUrl} alt={product.name} />
            ) : (
              <div className="detail-placeholder">KicksHub</div>
            )}

            {discountPrice && (
              <span className="detail-sale-badge">İNDİRİM</span>
            )}
          </div>
        </div>

        <div className="detail-info">
          <Link to="/products" className="detail-back">
            ← Ürünlere dön
          </Link>

          <div className="detail-meta">
            <span>{product.brand || "Bilinmeyen Marka"}</span>
            <span>{product.category || "Sneaker"}</span>
          </div>

          <h1>{product.name}</h1>

          <p className="detail-color">
            {product.color || "Renk bilgisi yok"}
          </p>

          <p className="detail-desc">
            {product.description ||
              "Premium sneaker deneyimi için seçilmiş özel ürün."}
          </p>

          <div className="detail-price">
            {discountPrice && (
              <span className="detail-old-price">
                {formatPrice(product.price)}
              </span>
            )}
            <strong>{formatPrice(finalPrice)}</strong>
          </div>

          <div className="detail-section">
            <div className="detail-section__head">
              <h3>Numara Seç</h3>
              <span>{availableVariants.length} numara stokta</span>
            </div>

            <div className="size-grid">
              {product.variants?.map((variant) => (
                <button
                  key={variant.id}
                  disabled={variant.stock <= 0}
                  className={
                    selectedVariant?.id === variant.id ? "selected" : ""
                  }
                  onClick={() => setSelectedVariant(variant)}
                >
                  <strong>{variant.size}</strong>
                  <small>
                    {variant.stock > 0 ? `${variant.stock} stok` : "Yok"}
                  </small>
                </button>
              ))}
            </div>
          </div>

          <div className="detail-actions">
            <div className="quantity-box">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                onClick={() =>
                  setQuantity((prev) =>
                    selectedVariant
                      ? Math.min(selectedVariant.stock, prev + 1)
                      : prev + 1
                  )
                }
              >
                +
              </button>
            </div>

            <button
              className="btn btn-accent detail-cart-btn"
              onClick={handleAddToCart}
              disabled={addingCart || !selectedVariant}
            >
              {addingCart ? "Ekleniyor..." : "Sepete Ekle"}
            </button>
          </div>

          <div className="detail-perks">
            <div>
              <strong>Güvenli Alışveriş</strong>
              <span>Token tabanlı kullanıcı ve sipariş akışı</span>
            </div>
            <div>
              <strong>Stok Kontrollü</strong>
              <span>Numara bazlı stok takibi</span>
            </div>
            <div>
              <strong>Kupon Destekli</strong>
              <span>İndirim kodu ile sipariş oluşturma</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductDetail;