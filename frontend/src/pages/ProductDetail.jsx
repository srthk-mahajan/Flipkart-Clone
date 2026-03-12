import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ImageCarousel from '../components/ImageCarousel.jsx';
import { FiHeart } from 'react-icons/fi';
import { getProductById } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await getProductById(id);
        setProduct(response.data);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="panel">Loading product details...</div>;
  if (!product) return <div className="panel">Product not found</div>;

  const carouselImages = [
    product.image_url,
    `${product.image_url}&v=2`,
    `${product.image_url}&v=3`
  ];

  const onBuyNow = async () => {
    await addItem(product.id, 1);
    navigate('/checkout');
  };

  const specifications = [
    { label: 'Category', value: product.category },
    { label: 'Stock', value: product.stock > 0 ? `${product.stock} units available` : 'Out of stock' },
    { label: 'Price', value: `₹${Number(product.price).toLocaleString('en-IN')}` },
    { label: 'Delivery', value: 'Free delivery in 2-4 days' },
    { label: 'Return Policy', value: '7-day replacement available' }
  ];

  return (
    <section className="product-detail-page">
      <div className="left">
        <ImageCarousel images={carouselImages} />
      </div>
      <div className="right panel">
        <h1>{product.name}</h1>
        <p className="muted">Category: {product.category}</p>
        <p className="detail-price">₹{Number(product.price).toLocaleString('en-IN')}</p>
        <p className={product.stock > 0 ? 'stock in' : 'stock out'}>
          {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
        </p>
        <p>{product.description}</p>

        <div className="spec-table-wrap">
          <h3>Specifications</h3>
          <table className="spec-table">
            <tbody>
              {specifications.map((row) => (
                <tr key={row.label}>
                  <th>{row.label}</th>
                  <td>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="detail-actions">
          <button className="secondary-btn" onClick={() => toggleWishlist(product.id)}>
            <FiHeart className={isWishlisted(product.id) ? 'filled' : ''} />
            {isWishlisted(product.id) ? 'Wishlisted' : 'Add to wishlist'}
          </button>
          <button className="primary-btn" onClick={() => addItem(product.id)} disabled={!product.stock}>
            Add to cart
          </button>
          <button className="buy-btn" onClick={onBuyNow} disabled={!product.stock}>
            Buy now
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
