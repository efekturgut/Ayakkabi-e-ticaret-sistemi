import { Link } from "react-router-dom";
import "./Footer.css";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
        <Logo size="large" />
          <p>
            Sneaker ürünlerini keşfedebileceğin, favorilerine ekleyebileceğin
            ve güvenli sipariş akışıyla alışveriş yapabileceğin modern
            e-ticaret platformu.
          </p>
        </div>

        <div className="footer__links">
          <div>
            <h3>Sayfalar</h3>
            <Link to="/">Ana Sayfa</Link>
            <Link to="/products">Ürünler</Link>
            <Link to="/favorites">Favoriler</Link>
            <Link to="/orders">Siparişlerim</Link>
          </div>

          <div>
            <h3>Hesap</h3>
            <Link to="/login">Giriş Yap</Link>
            <Link to="/register">Kayıt Ol</Link>
            <Link to="/cart">Sepet</Link>
          </div>

          <div>
            <h3>Özellikler</h3>
            <span>Numara bazlı stok</span>
            <span>Kuponlu sipariş</span>
            <span>Favori ürünler</span>
            <span>Yönetim paneli</span>
          </div>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>© 2026 Nextstep. Tüm hakları saklıdır.</span>
       
      </div>
    </footer>
  );
};

export default Footer;