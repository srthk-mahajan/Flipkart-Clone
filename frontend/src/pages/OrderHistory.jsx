import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrderHistory } from '../services/api.js';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await getOrderHistory();
        setOrders(response.data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <section className="panel">Loading your order history...</section>;
  }

  return (
    <section className="panel order-history-page">
      <h2>My Orders</h2>

      {!orders.length ? (
        <p>
          No orders yet. <Link to="/">Start shopping</Link>
        </p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <article className="order-card" key={order.id}>
              <div className="order-card-head">
                <strong>Order #{order.id}</strong>
                <span>{new Date(order.created_at).toLocaleString()}</span>
              </div>
              <p className="muted">Status: {order.status}</p>
              <p className="muted">Shipping: {order.shipping_address}</p>
              <p className="order-total">Total: ₹{Number(order.total_amount).toLocaleString('en-IN')}</p>

              <div className="order-items-grid">
                {order.items?.map((item) => (
                  <div className="order-item-row" key={item.id}>
                    <img src={item.image_url} alt={item.name} />
                    <div>
                      <p>{item.name}</p>
                      <small>Qty: {item.quantity}</small>
                    </div>
                    <strong>₹{Number(item.price).toLocaleString('en-IN')}</strong>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default OrderHistory;
