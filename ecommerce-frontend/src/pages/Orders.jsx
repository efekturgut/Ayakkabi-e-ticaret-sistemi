import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import "./Orders.css";

const formatPrice = (value) => {
  return `₺${Number(value || 0).toLocaleString("tr-TR")}`;
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/orders");
      setOrders(response.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Siparişler alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <main className="page">
        <section className="container">
          <div className="empty-state">Siparişler yükleniyor...</div>
        </section>
      </main>
    );
  }

  return (
    <main className="orders-page">
      <section className="container">
        <div className="orders-head">
          <div>
            <span>Sipariş Geçmişi</span>
            <h1>Siparişlerim</h1>
          </div>
          <p>{orders.length} sipariş</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">Henüz siparişin yok.</div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <article className="order-card" key={order.id}>
                <div>
                  <span className="order-id">#{order.id}</span>
                  <h3>{order.customerName}</h3>
                  <p>{order.address}</p>
                </div>

                <div className="order-price">
                  {order.couponCode && <span>{order.couponCode}</span>}
                  <strong>
                    {formatPrice(order.finalPrice || order.totalPrice)}
                  </strong>
                </div>

                <div className={`order-status status-${order.status}`}>
                  {order.status}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Orders;