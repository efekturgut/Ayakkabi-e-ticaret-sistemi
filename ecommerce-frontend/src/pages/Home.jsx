import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "./Home.css";

const formatPrice = (value) => {
  return `₺${Number(value || 0).toLocaleString("tr-TR")}`;
};

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await api.get("/products", {
        params: {
          page: 1,
          limit: 4,
        },
      });

      const data = response.data;

      if (Array.isArray(data)) {
        setFeaturedProducts(data.slice(0, 4));
      } else {
        setFeaturedProducts((data.products || []).slice(0, 4));
      }
    } catch (error) {
      console.error("Öne çıkan ürünler alınamadı:", error);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const mainProduct = featuredProducts[0];
  const secondProduct = featuredProducts[1];

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="container home-hero__inner">
          <div className="home-hero__content">
            <span className="home-hero__badge">Yeni sezon sneaker seçkisi</span>

            <h1>
              Tarzını tamamlayan
              <br />
              sneaker’ı keşfet.
            </h1>

            <p>
              KicksHub’da popüler sneaker modellerini incele, numarana göre
              stok kontrolü yap, favorilerine ekle ve hızlıca sipariş oluştur.
            </p>

            <div className="home-hero__actions">
              <Link to="/products" className="btn btn-accent">
                Ürünleri Keşfet
              </Link>

              <Link to="/register" className="home-hero__link">
                Hesap oluştur →
              </Link>
            </div>

            <div className="home-hero__stats">
              <div>
                <strong>100+</strong>
                <span>Sneaker modeli</span>
              </div>

              <div>
                <strong>38-46</strong>
                <span>Numara aralığı</span>
              </div>

              <div>
                <strong>%20</strong>
                <span>Kupon fırsatları</span>
              </div>
            </div>
          </div>

          <div className="home-hero__visual">
            <div className="hero-product hero-product--main">
              <div className="hero-product__image">
                {mainProduct?.imageUrl || mainProduct?.image_url ? (
                  <img
                    src={mainProduct.imageUrl || mainProduct.image_url}
                    alt={mainProduct.name}
                  />
                ) : (
                  <span>KicksHub</span>
                )}
              </div>

              <div className="hero-product__info">
                <span>Öne Çıkan</span>
                <h3>{mainProduct?.name || "Premium Sneaker"}</h3>
                <strong>
                  {formatPrice(
                    mainProduct?.discountPrice ||
                      mainProduct?.discount_price ||
                      mainProduct?.price ||
                      4999
                  )}
                </strong>
              </div>
            </div>

            <div className="hero-mini-card hero-mini-card--top">
              <strong>42</strong>
              <span>Stokta numara</span>
            </div>

            <div className="hero-mini-card hero-mini-card--bottom">
              <strong>Ücretsiz</strong>
              <span>Kargo simülasyonu</span>
            </div>

            {secondProduct && (
              <div className="hero-product hero-product--small">
                <div className="hero-product__image">
                  <img
                    src={secondProduct.imageUrl || secondProduct.image_url}
                    alt={secondProduct.name}
                  />
                </div>
                <div className="hero-product__info">
                  <span>Yeni Ürün</span>
                  <h3>{secondProduct.name}</h3>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="home-categories">
        <div className="container">
          <div className="section-head">
            <span>Koleksiyonlar</span>
            <h2>Popüler aramalar</h2>
          </div>

          <div className="category-grid">
            <Link to="/products?brand=Nike" className="category-card">
              <span>01</span>
              <h3>Nike</h3>
              <p>Dunk, Air Max ve günlük sneaker modelleri.</p>
            </Link>

            <Link to="/products?brand=Jordan" className="category-card">
              <span>02</span>
              <h3>Jordan</h3>
              <p>Koleksiyonluk ve ikonik basketbol sneaker’ları.</p>
            </Link>

            <Link to="/products?brand=Adidas" className="category-card">
              <span>03</span>
              <h3>Adidas</h3>
              <p>Samba, Campus ve klasik sokak stili modelleri.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="home-featured">
        <div className="container">
          <div className="section-head section-head--row">
            <div>
              <span>Öne Çıkanlar</span>
              <h2>Yeni gelen sneaker’lar</h2>
            </div>

            <Link to="/products" className="btn-outline">
              Tüm ürünler
            </Link>
          </div>

          <div className="featured-grid">
            {featuredProducts.length === 0 ? (
              <div className="empty-state">Ürünler yükleniyor...</div>
            ) : (
              featuredProducts.map((product) => (
                <Link
                  to={`/products/${product.id}`}
                  className="featured-card"
                  key={product.id}
                >
                  <div className="featured-card__image">
                    {product.imageUrl || product.image_url ? (
                      <img
                        src={product.imageUrl || product.image_url}
                        alt={product.name}
                      />
                    ) : (
                      <span>KicksHub</span>
                    )}
                  </div>

                  <div className="featured-card__body">
                    <span>{product.brand || "Sneaker"}</span>
                    <h3>{product.name}</h3>
                    <strong>
                      {formatPrice(
                        product.discountPrice ||
                          product.discount_price ||
                          product.price
                      )}
                    </strong>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="home-benefits">
        <div className="container benefits-grid">
          <div className="benefit-card">
            <span>01</span>
            <h3>Numara bazlı stok</h3>
            <p>
              Her ürün için farklı numaralar ve stok adetleri ayrı ayrı takip
              edilir.
            </p>
          </div>

          <div className="benefit-card">
            <span>02</span>
            <h3>Favori sistemi</h3>
            <p>
              Beğendiğin ürünleri favorilerine ekleyerek daha sonra hızlıca
              ulaşabilirsin.
            </p>
          </div>

          <div className="benefit-card">
            <span>03</span>
            <h3>Kuponlu sipariş</h3>
            <p>
              Sepetinde kupon kodu kullanarak indirimli sipariş
              oluşturabilirsin.
            </p>
          </div>

          <div className="benefit-card benefit-card--dark">
            <span>KicksHub</span>
            <h3>Modern alışveriş deneyimi</h3>
            <p>
              Ürün, sepet, sipariş ve yönetim paneliyle uçtan uca e-ticaret
              akışı.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;