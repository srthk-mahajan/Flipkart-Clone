import { Link, useLocation } from 'react-router-dom';

function OrderConfirmation() {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) {
    return (
      <section className="panel confirmation-page">
        <h2>No order found</h2>
        <p>Looks like this page was refreshed. You can view your cart and place a new order.</p>
        <Link className="primary-btn inline-btn" to="/cart">
          Go to Cart
        </Link>
      </section>
    );
  }

  return (
    <section className="panel confirmation-page">
      <h2>🎉 Order Confirmed!</h2>
      <p>Your order has been placed successfully.</p>

      <div className="confirmation-meta">
        <p><strong>Order ID:</strong> #{order.id}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Total:</strong> ₹{Number(order.total_amount).toLocaleString('en-IN')}</p>
        <p><strong>Placed On:</strong> {new Date(order.created_at).toLocaleString()}</p>
      </div>

      <h3>Order Items</h3>
      <ul>
        {order.items?.map((item) => (
          <li key={`${order.id}-${item.product_id}`}>
            Product #{item.product_id} × {item.quantity} — ₹{Number(item.price).toLocaleString('en-IN')} each
          </li>
        ))}
      </ul>

      <div className="confirmation-actions">
        <Link className="primary-btn inline-btn" to="/">
          Continue Shopping
        </Link>
      </div>
    </section>
  );
}

export default OrderConfirmation;
