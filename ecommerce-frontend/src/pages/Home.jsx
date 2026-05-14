import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <main>
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__content">
            <span className="hero__badge">Sneaker Commerce Platform</span>

            <h1>
              Step Into <br />
              Your Style.
            </h1>

            <p>
              KicksHub; sneaker ürünlerini keşfetmen, favorilerine eklemen,
              sepete atman ve sipariş oluşturman için tasarlanmış modern bir
              e-commerce deneyimidir.
            </p>

            <div className="hero__actions">
              <Link to="/products" className="btn btn-accent">
                Ürünleri Keşfet
              </Link>

              <Link to="/register" className="btn-outline hero__outline">
                Hemen Başla
              </Link>
            </div>
          </div>

          <div className="hero__visual">
            <div className="shoe-card shoe-card--main">
              <span>NEW DROP</span>
              <h2>Air Jordan Collection</h2>
              <p>Premium sneaker selection</p>
            </div>

            <div className="shoe-card shoe-card--small">
              <strong>42</strong>
              <span>Available Size</span>
            </div>

            <div className="shoe-card shoe-card--price">
              <strong>₺4.999</strong>
              <span>Starting Price</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-features">
        <div className="container home-features__grid">
          <div className="feature-card">
            <span>01</span>
            <h3>Gerçek Ürün Verisi</h3>
            <p>KicksDB entegrasyonu ile sneaker ürünleri backend’e aktarılır.</p>
          </div>

          <div className="feature-card">
            <span>02</span>
            <h3>Numara Bazlı Stok</h3>
            <p>Her ürün için farklı numara ve stok yönetimi yapılır.</p>
          </div>

          <div className="feature-card">
            <span>03</span>
            <h3>Sepet & Sipariş</h3>
            <p>Kullanıcıya özel sepet, kupon ve sipariş akışı desteklenir.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;