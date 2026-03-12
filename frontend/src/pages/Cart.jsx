import { Link, useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem.jsx';
import { useCart } from '../context/CartContext.jsx';

function Cart() {
  const navigate = useNavigate();
  const { cartItems, summary, updateItemQuantity, removeItem, loading } = useCart();

  if (loading) {
    return <div className="panel">Loading cart...</div>;
  }

  return (
    <section className="cart-page">
      <div className="cart-list panel">
        <h2>My Cart ({cartItems.length})</h2>
        {cartItems.length ? (
          cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onRemove={removeItem}
              onQuantityChange={updateItemQuantity}
            />
          ))
        ) : (
          <p>
            Your cart is empty. <Link to="/">Explore products</Link>
          </p>
        )}
      </div>

      <aside className="price-box panel">
        <h3>Price Details</h3>
        <div className="summary-row">
          <span>Subtotal</span>
          <strong>₹{Number(summary.subtotal || 0).toLocaleString('en-IN')}</strong>
        </div>
        <div className="summary-row">
          <span>Delivery</span>
          <strong>Free</strong>
        </div>
        <div className="summary-row total-row">
          <span>Total</span>
          <strong>₹{Number(summary.total || 0).toLocaleString('en-IN')}</strong>
        </div>

        <button className="buy-btn" disabled={!cartItems.length} onClick={() => navigate('/checkout')}>
          Proceed to Checkout
        </button>
      </aside>
    </section>
  );
}

export default Cart;
