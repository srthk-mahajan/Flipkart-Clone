import ProductCard from './ProductCard.jsx';

function ProductGrid({ products, onAddToCart, loading }) {
  if (loading) {
    return <div className="panel">Loading products...</div>;
  }

  if (!products.length) {
    return <div className="panel">No products found. Try changing search or category.</div>;
  }

  return (
    <section className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </section>
  );
}

export default ProductGrid;
