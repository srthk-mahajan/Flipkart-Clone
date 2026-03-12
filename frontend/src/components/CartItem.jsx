function CartItem({ item, onRemove, onQuantityChange }) {
  return (
    <article className="cart-item">
      <img src={item.image_url} alt={item.name} />
      <div className="cart-item-content">
        <h3>{item.name}</h3>
        <p className="muted">Category: {item.category}</p>
        <p className="price">₹{Number(item.price).toLocaleString('en-IN')}</p>

        <div className="quantity-row">
          <label htmlFor={`qty-${item.id}`}>Qty</label>
          <select
            id={`qty-${item.id}`}
            value={item.quantity}
            onChange={(e) => onQuantityChange(item.id, Number(e.target.value))}
          >
            {Array.from({ length: Math.min(item.stock, 10) }, (_, idx) => idx + 1).map((qty) => (
              <option key={qty} value={qty}>
                {qty}
              </option>
            ))}
          </select>
          <button className="danger-link" onClick={() => onRemove(item.id)}>
            Remove
          </button>
        </div>
      </div>
      <div className="cart-item-total">₹{Number(item.item_total).toLocaleString('en-IN')}</div>
    </article>
  );
}

export default CartItem;
