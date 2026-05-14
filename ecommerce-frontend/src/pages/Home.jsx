import { Link } from "react-router-dom";

const Home = () => {
  return (
    <main className="page">
      <section className="container">
        <h1 className="page-title">Step Into Your Style</h1>

        <p
          style={{
            maxWidth: "600px",
            marginBottom: "20px",
            lineHeight: "1.6",
          }}
        >
          KicksHub, sneaker ürünlerini keşfedebileceğin modern bir e-commerce
          platformudur.
        </p>

        <Link to="/products" className="btn">
          Ürünleri Gör
        </Link>
      </section>
    </main>
  );
};

export default Home;