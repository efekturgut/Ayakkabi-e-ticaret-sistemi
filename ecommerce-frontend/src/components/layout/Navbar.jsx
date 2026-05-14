import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
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
        <Link to="/" className="navbar__logo">
          KicksHub
        </Link>

        <nav className="navbar__links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Products</NavLink>

          {isAuthenticated && (
            <>
              <NavLink to="/cart">Cart</NavLink>
              <NavLink to="/favorites">Favorites</NavLink>
              <NavLink to="/orders">Orders</NavLink>
            </>
          )}

          {isAuthenticated && isAdmin && <NavLink to="/admin">Admin</NavLink>}
        </nav>

        <div className="navbar__actions">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="navbar__login">
                Login
              </Link>

              <Link to="/register" className="navbar__register">
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="navbar__user">{user?.name}</span>
              <button onClick={handleLogout} className="navbar__logout">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;