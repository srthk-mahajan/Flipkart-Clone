import { Link } from 'react-router-dom';

function ProductCard({ product, onAddToCart }) {
  const discountLabel = 'Up to 20% Off';

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-image-wrap">
        <img src={product.image_url} alt={product.name} loading="lazy" />
      </Link>
      <div className="product-info">
        <Link to={`/product/${product.id}`} className="product-title">
          {product.name}
        </Link>
        <p className="price-row">₹{Number(product.price).toLocaleString('en-IN')}</p>
        <p className="discount-text">{discountLabel}</p>
        <button className="primary-btn" onClick={() => onAddToCart(product.id)}>
          Add to Cart
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
