import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Logo from "./Logo";
import "./Navbar.css";

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Logo />

        <nav className="navbar__links">
          <NavLink to="/">Ana Sayfa</NavLink>
          <NavLink to="/products">Ürünler</NavLink>
          <NavLink to="/cart">Sepet</NavLink>
          <NavLink to="/favorites">Favoriler</NavLink>
          <NavLink to="/orders">Siparişlerim</NavLink>

          {isAuthenticated && isAdmin && <NavLink to="/admin">Yönetim</NavLink>}
        </nav>

        <div className="navbar__actions">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="navbar__login">
                Giriş Yap
              </Link>

              <Link to="/register" className="navbar__register">
                Kayıt Ol
              </Link>
            </>
          ) : (
            <>
              <span className="navbar__user">{user?.name}</span>
              <button onClick={handleLogout} className="navbar__logout">
                Çıkış Yap
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;