import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/product/ProductCard";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    brand: "",
    size: "",
    minPrice: "",
    maxPrice: "",
    page: 1,
    limit: 12,
  });

  const fetchProducts = async (customFilters = filters) => {
    try {
      setLoading(true);

      const params = {
        page: customFilters.page,
        limit: customFilters.limit,
      };

      if (customFilters.search) params.search = customFilters.search;
      if (customFilters.brand) params.brand = customFilters.brand;
      if (customFilters.size) params.size = customFilters.size;
      if (customFilters.minPrice) params.minPrice = customFilters.minPrice;
      if (customFilters.maxPrice) params.maxPrice = customFilters.maxPrice;

      const response = await api.get("/products", { params });
      const data = response.data;

      if (Array.isArray(data)) {
        setProducts(data);
        setPagination(null);
      } else {
        setProducts(data.products || []);
        setPagination(data.pagination || null);
      }
    } catch (error) {
      console.error("Ürünler alınamadı:", error.response?.data || error.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters.page]);

  const handleChange = (event) => {
    setFilters((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
      page: 1,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchProducts(filters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      search: "",
      brand: "",
      size: "",
      minPrice: "",
      maxPrice: "",
      page: 1,
      limit: 12,
    };

    setFilters(emptyFilters);
    fetchProducts(emptyFilters);
  };

  const goToPage = (page) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  return (
    <main className="products-page">
      <section className="products-hero">
        <div className="container">
          <span className="products-hero__badge">Nextstep Koleksiyonu</span>
          <h1>Yeni Sneaker’ını Keşfet.</h1>
          <p>
            Marka, numara, fiyat aralığı ve arama kelimesine göre sneaker
            koleksiyonunu filtrele.
          </p>
        </div>
      </section>

      <section className="container products-layout">
        <aside className="filters-card">
          <h2>Filtreler</h2>

          <form onSubmit={handleSubmit} className="filters-form">
            <div className="filter-group">
              <label>Arama</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleChange}
                placeholder="Air Jordan, Dunk..."
              />
            </div>

            <div className="filter-group">
              <label>Marka</label>
              <select
                name="brand"
                value={filters.brand}
                onChange={handleChange}
              >
                <option value="">Tüm Markalar</option>
                <option value="Nike">Nike</option>
                <option value="Adidas">Adidas</option>
                <option value="New Balance">New Balance</option>
                <option value="Jordan">Jordan</option>
                <option value="Puma">Puma</option>
                <option value="Converse">Converse</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Numara</label>
              <select name="size" value={filters.size} onChange={handleChange}>
                <option value="">Tüm Numaralar</option>
                {["38", "39", "40", "41", "42", "43", "44", "45", "46"].map(
                  (size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="filter-row">
              <div className="filter-group">
                <label>Min ₺</label>
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleChange}
                  placeholder="1000"
                />
              </div>

              <div className="filter-group">
                <label>Max ₺</label>
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleChange}
                  placeholder="8000"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-accent">
              Filtrele
            </button>

            <button type="button" className="btn-outline" onClick={clearFilters}>
              Temizle
            </button>
          </form>
        </aside>

        <div className="products-content">
          <div className="products-toolbar">
            <div>
              <h2>Ürünler</h2>
              <p>
                {loading
                  ? "Ürünler yükleniyor..."
                  : pagination
                  ? `${pagination.total} ürün bulundu`
                  : `${products.length} ürün bulundu`}
              </p>
            </div>

            {pagination && (
              <span>
                Sayfa {pagination.page} / {pagination.totalPages || 1}
              </span>
            )}
          </div>

          {loading ? (
            <div className="products-grid">
              {Array.from({ length: 6 }).map((_, index) => (
                <div className="product-skeleton" key={index} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              Filtrelere uygun ürün bulunamadı.
            </div>
          ) : (
            <>
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard product={product} key={product.id} />
                ))}
              </div>

              {pagination && pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    disabled={!pagination.hasPrevPage}
                    onClick={() => goToPage(pagination.page - 1)}
                  >
                    Önceki
                  </button>

                  <span>
                    {pagination.page} / {pagination.totalPages}
                  </span>

                  <button
                    disabled={!pagination.hasNextPage}
                    onClick={() => goToPage(pagination.page + 1)}
                  >
                    Sonraki
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default Products;