import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <main>
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__content">
            <span className="hero__badge">Yeni Sezon Sneaker Koleksiyonu</span>

            <h1>
              Tarzını <br />
              Adımlarınla Göster.
            </h1>

            <p>
              KicksHub’da popüler sneaker modellerini keşfet, numarana göre stok
              kontrolü yap, favorilerine ekle ve güvenli alışveriş akışıyla
              siparişini oluştur.
            </p>

            <div className="hero__actions">
              <Link to="/products" className="btn btn-accent">
                Ürünleri Keşfet
              </Link>

              <Link to="/register" className="btn-outline hero__outline">
                Hesap Oluştur
              </Link>
            </div>
          </div>

          <div className="hero__visual">
            <div className="shoe-card shoe-card--main">
              <span>ÖNE ÇIKAN KOLEKSİYON</span>
              <h2>Air Jordan Seçkisi</h2>
              <p>Popüler modeller, güncel stoklar ve özel fiyatlar.</p>
            </div>

            <div className="shoe-card shoe-card--small">
              <strong>42</strong>
              <span>Stokta Numara</span>
            </div>

            <div className="shoe-card shoe-card--price">
              <strong>₺4.999</strong>
              <span>Başlayan Fiyatlar</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-features">
        <div className="container home-features__grid">
          <div className="feature-card">
            <span>01</span>
            <h3>Gerçek Sneaker Verisi</h3>
            <p>
              Ürünler, KicksDB entegrasyonu ile içe aktarılır ve sistemde
              yönetilebilir hale gelir.
            </p>
          </div>

          <div className="feature-card">
            <span>02</span>
            <h3>Numara Bazlı Stok</h3>
            <p>
              Her ürün için farklı numaralar ve stok adetleri ayrı ayrı takip
              edilir.
            </p>
          </div>

          <div className="feature-card">
            <span>03</span>
            <h3>Sepet ve Sipariş Akışı</h3>
            <p>
              Kullanıcılar ürünleri sepete ekleyebilir, kupon kullanabilir ve
              sipariş oluşturabilir.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;