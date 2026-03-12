import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, summary, refreshCart } = useCart();
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    pincode: '',
    addressLine: '',
    city: '',
    state: ''
  });
  const [placing, setPlacing] = useState(false);

  const shippingAddress = useMemo(() => {
    const { fullName, phone, pincode, addressLine, city, state } = form;
    return `${fullName}, ${phone}, ${addressLine}, ${city}, ${state} - ${pincode}`;
  }, [form]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!cartItems.length) return;

    setPlacing(true);
    try {
      const response = await placeOrder({ shippingAddress });
      await refreshCart();
      navigate('/order-confirmation', { state: { order: response.data } });
    } finally {
      setPlacing(false);
    }
  };

  return (
    <section className="checkout-page">
      <form className="panel checkout-form" onSubmit={onSubmit}>
        <h2>Shipping Address</h2>
        <div className="form-grid">
          <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={onChange} required />
          <input name="phone" placeholder="Phone Number" value={form.phone} onChange={onChange} required />
          <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={onChange} required />
          <input name="city" placeholder="City" value={form.city} onChange={onChange} required />
          <input name="state" placeholder="State" value={form.state} onChange={onChange} required />
          <input
            className="span-2"
            name="addressLine"
            placeholder="House no, Building, Street, Area"
            value={form.addressLine}
            onChange={onChange}
            required
          />
        </div>

        <button className="buy-btn" type="submit" disabled={placing || !cartItems.length}>
          {placing ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>

      <aside className="panel order-summary">
        <h3>Order Summary</h3>
        {cartItems.map((item) => (
          <div className="summary-item" key={item.id}>
            <span>{item.name} × {item.quantity}</span>
            <strong>₹{Number(item.item_total).toLocaleString('en-IN')}</strong>
          </div>
        ))}
        <div className="summary-row total-row">
          <span>Total</span>
          <strong>₹{Number(summary.total || 0).toLocaleString('en-IN')}</strong>
        </div>
      </aside>
    </section>
  );
}

export default Checkout;
