import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
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

    const result = await register(formData);

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
          <h1 className="page-title">Kayıt Ol</h1>
          <p className="auth-desc">
  KicksHub hesabını oluştur, sneaker ürünlerini keşfetmeye başla.
</p>

          {error && <p className="form-error">{error}</p>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Efe Kağan Turgut"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="efe@example.com"
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
                placeholder="Şifren"
                required
              />
            </div>

            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Kayıt olunuyor..." : "Register"}
            </button>
          </form>

          <p className="auth-switch">
            Zaten hesabın var mı? <Link to="/login">Giriş yap</Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Register;