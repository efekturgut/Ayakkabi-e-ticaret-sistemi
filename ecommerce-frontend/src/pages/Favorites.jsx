import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { Link } from "react-router-dom";
import "./Favorites.css";

const formatPrice = (value) => {
  return `₺${Number(value || 0).toLocaleString("tr-TR")}`;
};

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await api.get("/favorites");
      setFavorites(response.data.favorites || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Favoriler alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const removeFavorite = async (productId) => {
    try {
      await api.delete(`/favorites/${productId}`);
      toast.success("Ürün favorilerden çıkarıldı.");
      fetchFavorites();
    } catch (error) {
      toast.error(error.response?.data?.message || "Favoriden çıkarılamadı.");
    }
  };

  if (loading) {
    return (
      <main className="page">
        <section className="container">
          <div className="empty-state">Favoriler yükleniyor...</div>
        </section>
      </main>
    );
  }

  return (
    <main className="favorites-page">
      <section className="favorites-hero">
        <div className="container">
          <span>Saved Sneakers</span>
          <h1>Favorilerim</h1>
          <p>Beğendiğin sneaker ürünlerini burada saklayabilirsin.</p>
        </div>
      </section>

      <section className="container favorites-content">
        {favorites.length === 0 ? (
          <div className="empty-state">
            Henüz favori ürünün yok.{" "}
            <Link to="/products" style={{ fontWeight: 900, textDecoration: "underline" }}>
              Ürünleri keşfet
            </Link>
          </div>
        ) : (
          <div className="favorites-grid">
            {favorites.map((item) => (
              <article className="favorite-card" key={item.favoriteId}>
                <Link to={`/products/${item.productId}`} className="favorite-card__image">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} />
                  ) : (
                    <span>KicksHub</span>
                  )}
                </Link>

                <div className="favorite-card__body">
                  <div className="favorite-card__meta">
                    <span>{item.brand || "Unknown"}</span>
                    <span>{item.category || "Sneaker"}</span>
                  </div>

                  <Link to={`/products/${item.productId}`}>
                    <h3>{item.name}</h3>
                  </Link>

                  <p>{item.color || "Color not set"}</p>

                  <div className="favorite-card__bottom">
                    <strong>
                      {formatPrice(item.discountPrice || item.price)}
                    </strong>

                    <button onClick={() => removeFavorite(item.productId)}>
                      Kaldır
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Favorites;