import { Link } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const finalPrice = product.discountPrice || product.price;

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-card__image-wrap">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} />
        ) : (
          <div className="product-card__placeholder">KicksHub</div>
        )}

        {product.discountPrice && (
          <span className="product-card__discount">Sale</span>
        )}
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
            <span
              key={variant.id}
              className={variant.stock > 0 ? "" : "is-out"}
            >
              {variant.size}
            </span>
          ))}
        </div>

        <div className="product-card__bottom">
          <div>
            {product.discountPrice && (
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