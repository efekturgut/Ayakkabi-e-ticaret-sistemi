import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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

          {token && (
            <>
              <NavLink to="/cart">Cart</NavLink>
              <NavLink to="/favorites">Favorites</NavLink>
              <NavLink to="/orders">Orders</NavLink>
            </>
          )}

          {user?.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
        </nav>

        <div className="navbar__actions">
          {!token ? (
            <>
              <Link to="/login" className="navbar__login">
                Login
              </Link>

              <Link to="/register" className="navbar__register">
                Register
              </Link>
            </>
          ) : (
            <button onClick={handleLogout} className="navbar__logout">
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;