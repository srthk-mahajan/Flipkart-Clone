import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { getProducts } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

function Wishlist() {
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getProducts();
        setProducts(response.data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const wishlistProducts = useMemo(
    () => products.filter((item) => wishlistIds.includes(Number(item.id))),
    [products, wishlistIds]
  );

  return (
    <section className="wishlist-page panel">
      <div className="wishlist-title">
        <h2>My Wishlist</h2>
        <span>{wishlistProducts.length} items</span>
      </div>

      {loading ? <p>Loading wishlist...</p> : null}

      {!loading && !wishlistProducts.length ? (
        <div className="empty-wishlist">
          <FiHeart size={36} />
          <h3>Your wishlist is empty</h3>
          <p>Save your favourite products and buy them later.</p>
          <Link className="primary-btn inline-btn" to="/">
            Continue shopping
          </Link>
        </div>
      ) : null}

      <div className="wishlist-grid">
        {wishlistProducts.map((product) => (
          <article key={product.id} className="wishlist-card">
            <Link to={`/product/${product.id}`}>
              <img src={product.image_url} alt={product.name} />
            </Link>

            <div>
              <Link className="product-title" to={`/product/${product.id}`}>
                {product.name}
              </Link>
              <p className="price-row">₹{Number(product.price).toLocaleString('en-IN')}</p>
              <p className="muted">{product.description}</p>
            </div>

            <div className="wishlist-actions">
              <button className="primary-btn" onClick={() => addItem(product.id)}>
                Add to cart
              </button>
              <button className="danger-link" onClick={() => toggleWishlist(product.id)}>
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Wishlist;
