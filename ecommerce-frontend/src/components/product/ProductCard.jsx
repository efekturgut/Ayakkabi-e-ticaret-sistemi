import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const imageUrl = product.imageUrl || product.image_url;
  const discountPrice = product.discountPrice || product.discount_price;
  const finalPrice = discountPrice || product.price;

  const handleAddFavorite = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Favoriye eklemek için giriş yapmalısın.");
      navigate("/login");
      return;
    }

    try {
      await api.post(`/favorites/${product.id}`);
      toast.success("Ürün favorilere eklendi.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Favoriye eklenemedi.");
    }
  };

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-card__image-wrap">
        {imageUrl ? (
          <img src={imageUrl} alt={product.name} />
        ) : (
          <div className="product-card__placeholder">KicksHub</div>
        )}

        {discountPrice && <span className="product-card__discount">Sale</span>}

        <button
          className="product-card__favorite"
          onClick={handleAddFavorite}
          title="Favoriye ekle"
        >
          ♥
        </button>
      </Link>

      <div className="product-card__content">
        <div className="product-card__meta">
          <span>{product.brand || "Unknown"}</span>
          <span>{product.category || "Sneaker"}</span>
        </div>

        <Link to={`/products/${product.id}`}>
          <h3>{product.name}</h3>
        </Link>

        <p className="product-card__color">{product.color || "Color not set"}</p>

        <div className="product-card__sizes">
          {product.variants?.slice(0, 5).map((variant) => (
            <span key={variant.id} className={variant.stock > 0 ? "" : "is-out"}>
              {variant.size}
            </span>
          ))}
        </div>

        <div className="product-card__bottom">
          <div>
            {discountPrice && (
              <span className="product-card__old-price">
                ₺{Number(product.price).toLocaleString("tr-TR")}
              </span>
            )}

            <strong>₺{Number(finalPrice).toLocaleString("tr-TR")}</strong>
          </div>

          <Link to={`/products/${product.id}`} className="product-card__btn">
            İncele
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;