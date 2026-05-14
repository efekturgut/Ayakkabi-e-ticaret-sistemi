import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import "./AdminDashboard.css";

const formatPrice = (value) => {
  return `₺${Number(value || 0).toLocaleString("tr-TR")}`;
};

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importLoading, setImportLoading] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);

  const [importQuery, setImportQuery] = useState("");

  const [couponForm, setCouponForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    usageLimit: "",
    expiresAt: "",
  });

  const fetchDashboard = async () => {
    const response = await api.get("/admin/dashboard");
    setDashboard(response.data.dashboard);
  };

  const fetchOrders = async () => {
    const response = await api.get("/orders");
    setOrders(response.data || []);
  };

  const fetchCoupons = async () => {
    const response = await api.get("/coupons");
    setCoupons(response.data.coupons || []);
  };

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      await Promise.all([fetchDashboard(), fetchOrders(), fetchCoupons()]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Admin verileri alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.patch(`/orders/${orderId}/status`, {
        status,
      });

      toast.success("Sipariş durumu güncellendi.");
      await Promise.all([fetchOrders(), fetchDashboard()]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Durum güncellenemedi.");
    }
  };

  const handleImport = async (event) => {
    event.preventDefault();

    if (!importQuery.trim()) {
      toast.error("Import için arama kelimesi gir.");
      return;
    }

    try {
      setImportLoading(true);

      const response = await api.post("/kicksdb/import", {
        query: importQuery,
      });

      toast.success(
        `${response.data.result?.importedCount || 0} ürün import edildi.`
      );

      setImportQuery("");
      await fetchDashboard();
    } catch (error) {
      toast.error(error.response?.data?.message || "Import başarısız.");
    } finally {
      setImportLoading(false);
    }
  };

  const handleCouponChange = (event) => {
    setCouponForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const createCoupon = async (event) => {
    event.preventDefault();

    try {
      setCouponLoading(true);

      const payload = {
        code: couponForm.code,
        discountType: couponForm.discountType,
        discountValue: Number(couponForm.discountValue),
        minOrderAmount: couponForm.minOrderAmount
          ? Number(couponForm.minOrderAmount)
          : 0,
        usageLimit: couponForm.usageLimit
          ? Number(couponForm.usageLimit)
          : null,
        expiresAt: couponForm.expiresAt || null,
      };

      await api.post("/coupons", payload);

      toast.success("Kupon oluşturuldu.");

      setCouponForm({
        code: "",
        discountType: "percentage",
        discountValue: "",
        minOrderAmount: "",
        usageLimit: "",
        expiresAt: "",
      });

      await fetchCoupons();
    } catch (error) {
      toast.error(error.response?.data?.message || "Kupon oluşturulamadı.");
    } finally {
      setCouponLoading(false);
    }
  };

  const toggleCouponStatus = async (coupon) => {
    try {
      await api.patch(`/coupons/${coupon.id}/status`, {
        isActive: !coupon.isActive,
      });

      toast.success("Kupon durumu güncellendi.");
      await fetchCoupons();
    } catch (error) {
      toast.error(error.response?.data?.message || "Kupon güncellenemedi.");
    }
  };

  if (loading) {
    return (
      <main className="admin-page">
        <section className="container">
          <div className="empty-state">Admin panel yükleniyor...</div>
        </section>
      </main>
    );
  }

  const summary = dashboard?.summary || {};

  return (
    <main className="admin-page">
      <section className="admin-hero">
        <div className="container admin-hero__inner">
          <div>
            <span>Admin Control Center</span>
            <h1>KicksHub Dashboard</h1>
            <p>
              Ürünleri, siparişleri, kuponları ve KicksDB import akışını buradan
              yönet.
            </p>
          </div>

          <button className="btn btn-accent" onClick={fetchAdminData}>
            Refresh Data
          </button>
        </div>
      </section>

      <section className="container admin-content">
        <div className="stats-grid">
          <div className="stat-card">
            <span>Total Products</span>
            <strong>{summary.totalProducts || 0}</strong>
          </div>

          <div className="stat-card">
            <span>Total Users</span>
            <strong>{summary.totalUsers || 0}</strong>
          </div>

          <div className="stat-card">
            <span>Total Orders</span>
            <strong>{summary.totalOrders || 0}</strong>
          </div>

          <div className="stat-card stat-card--accent">
            <span>Total Revenue</span>
            <strong>{formatPrice(summary.totalRevenue)}</strong>
          </div>

          <div className="stat-card">
            <span>Pending Orders</span>
            <strong>{summary.pendingOrders || 0}</strong>
          </div>
        </div>

        <div className="admin-grid">
          <section className="admin-panel">
            <div className="admin-panel__head">
              <div>
                <h2>Recent Orders</h2>
                <p>Sipariş durumlarını buradan güncelle.</p>
              </div>
            </div>

            <div className="admin-orders">
              {orders.length === 0 ? (
                <div className="empty-state">Sipariş bulunamadı.</div>
              ) : (
                orders.slice(0, 8).map((order) => (
                  <article className="admin-order-card" key={order.id}>
                    <div>
                      <span>#{order.id}</span>
                      <h3>{order.customerName}</h3>
                      <p>{order.customerEmail}</p>
                    </div>

                    <strong>
                      {formatPrice(order.finalPrice || order.totalPrice)}
                    </strong>

                    <select
                      value={order.status}
                      onChange={(event) =>
                        updateOrderStatus(order.id, event.target.value)
                      }
                    >
                      <option value="pending">pending</option>
                      <option value="confirmed">confirmed</option>
                      <option value="preparing">preparing</option>
                      <option value="shipped">shipped</option>
                      <option value="delivered">delivered</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </article>
                ))
              )}
            </div>
          </section>

          <aside className="admin-side">
            <section className="admin-panel">
              <h2>KicksDB Import</h2>
              <p className="admin-muted">
                Örnek: Nike Dunk, Air Jordan 1, Adidas Samba, New Balance 550.
              </p>

              <form onSubmit={handleImport} className="admin-form">
                <div className="form-group">
                  <label>Search Query</label>
                  <input
                    value={importQuery}
                    onChange={(event) => setImportQuery(event.target.value)}
                    placeholder="Nike Dunk"
                  />
                </div>

                <button className="btn btn-accent" disabled={importLoading}>
                  {importLoading ? "Import ediliyor..." : "Import Products"}
                </button>
              </form>
            </section>

            <section className="admin-panel">
              <h2>Create Coupon</h2>

              <form onSubmit={createCoupon} className="admin-form">
                <div className="form-group">
                  <label>Code</label>
                  <input
                    name="code"
                    value={couponForm.code}
                    onChange={handleCouponChange}
                    placeholder="WELCOME10"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Discount Type</label>
                  <select
                    name="discountType"
                    value={couponForm.discountType}
                    onChange={handleCouponChange}
                  >
                    <option value="percentage">percentage</option>
                    <option value="fixed">fixed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Discount Value</label>
                  <input
                    type="number"
                    name="discountValue"
                    value={couponForm.discountValue}
                    onChange={handleCouponChange}
                    placeholder="10"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Min Order Amount</label>
                  <input
                    type="number"
                    name="minOrderAmount"
                    value={couponForm.minOrderAmount}
                    onChange={handleCouponChange}
                    placeholder="1000"
                  />
                </div>

                <div className="form-group">
                  <label>Usage Limit</label>
                  <input
                    type="number"
                    name="usageLimit"
                    value={couponForm.usageLimit}
                    onChange={handleCouponChange}
                    placeholder="100"
                  />
                </div>

                <div className="form-group">
                  <label>Expires At</label>
                  <input
                    type="date"
                    name="expiresAt"
                    value={couponForm.expiresAt}
                    onChange={handleCouponChange}
                  />
                </div>

                <button className="btn btn-accent" disabled={couponLoading}>
                  {couponLoading ? "Oluşturuluyor..." : "Create Coupon"}
                </button>
              </form>
            </section>
          </aside>
        </div>

        <div className="admin-grid admin-grid--bottom">
          <section className="admin-panel">
            <div className="admin-panel__head">
              <div>
                <h2>Low Stock</h2>
                <p>Stoku azalan varyantlar.</p>
              </div>
            </div>

            <div className="low-stock-list">
              {(dashboard?.lowStockProducts || []).length === 0 ? (
                <div className="empty-state">Stok problemi yok.</div>
              ) : (
                dashboard.lowStockProducts.map((item) => (
                  <article className="low-stock-card" key={item.variantId}>
                    <div>
                      <h3>{item.productName}</h3>
                      <p>
                        Size {item.size} / SKU: {item.sku}
                      </p>
                    </div>
                    <strong>{item.stock} left</strong>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel__head">
              <div>
                <h2>Coupons</h2>
                <p>Aktif / pasif kupon yönetimi.</p>
              </div>
            </div>

            <div className="coupon-list">
              {coupons.length === 0 ? (
                <div className="empty-state">Kupon bulunamadı.</div>
              ) : (
                coupons.map((coupon) => (
                  <article className="coupon-card" key={coupon.id}>
                    <div>
                      <h3>{coupon.code}</h3>
                      <p>
                        {coupon.discountType} / {coupon.discountValue}
                      </p>
                      <span>
                        Used: {coupon.usedCount} /{" "}
                        {coupon.usageLimit || "limitsiz"}
                      </span>
                    </div>

                    <button
                      className={coupon.isActive ? "active" : "passive"}
                      onClick={() => toggleCouponStatus(coupon)}
                    >
                      {coupon.isActive ? "Active" : "Passive"}
                    </button>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default AdminDashboard;