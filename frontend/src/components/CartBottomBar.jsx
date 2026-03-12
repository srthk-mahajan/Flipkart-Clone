import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

function CartBottomBar() {
  const { recentlyAddedItem, clearRecentlyAddedItem, updateItemQuantity } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (recentlyAddedItem) {
      const timer = setTimeout(() => {
        clearRecentlyAddedItem();
      }, 8000); // auto close after 8 seconds
      return () => clearTimeout(timer);
    }
  }, [recentlyAddedItem, clearRecentlyAddedItem]);

  if (!recentlyAddedItem) return null;

  return (
    <div className="cart-bottom-bar appear-from-bottom">
      <div className="cart-bottom-bar-content">
        <div className="cart-bottom-bar-left">
          <img src={recentlyAddedItem.image_url} alt={recentlyAddedItem.name} className="cart-bottom-bar-img" />
          <div className="cart-bottom-bar-info">
            <span className="cart-bottom-bar-title">Added to cart</span>
            <span className="cart-bottom-bar-name">{recentlyAddedItem.name}</span>
            <span className="cart-bottom-bar-price">₹{Number(recentlyAddedItem.price).toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="cart-bottom-bar-actions">
          <div className="quantity-control">
            <label htmlFor="bottom-qty">Qty:</label>
            <select
              id="bottom-qty"
              value={recentlyAddedItem.quantity}
              onChange={(e) => updateItemQuantity(recentlyAddedItem.id, Number(e.target.value))}
            >
              {Array.from({ length: Math.min(recentlyAddedItem.stock, 10) }, (_, idx) => idx + 1).map((qty) => (
                <option key={qty} value={qty}>
                  {qty}
                </option>
              ))}
            </select>
          </div>
          
          <button 
            className="primary-btn proceed-btn" 
            onClick={() => {
              clearRecentlyAddedItem();
              navigate('/cart');
            }}
          >
            Proceed to Cart
          </button>
          
          <button className="icon-btn close-bottom-bar" onClick={clearRecentlyAddedItem} aria-label="Close">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartBottomBar;
