import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    const result = await login(formData);

    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate("/products");
  };

  return (
    <main className="page">
      <section className="container auth-page">
        <div className="auth-card">
          <h1 className="page-title">Giriş Yap</h1>
          <p className="auth-desc">
  KicksHub hesabına giriş yaparak sepetini, favorilerini ve siparişlerini
  yönetebilirsin.
</p>

          {error && <p className="form-error">{error}</p>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="user@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Şifre"
                required
              />
            </div>

            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Giriş yapılıyor..." : "Login"}
            </button>
          </form>

          <p className="auth-switch">
            Hesabın yok mu? <Link to="/register">Kayıt ol</Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;