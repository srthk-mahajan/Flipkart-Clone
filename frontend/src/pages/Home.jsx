import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid.jsx';
import { getProducts } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';

const sidebarCategories = ['all', 'electronics', 'fashion', 'home', 'appliances', 'books'];

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addItem } = useCart();

  const category = useMemo(() => searchParams.get('category') || 'all', [searchParams]);
  const search = useMemo(() => searchParams.get('search') || '', [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (category !== 'all') params.category = category;
        if (search) params.search = search;

        const [filteredResponse, allResponse] = await Promise.all([
          getProducts(params),
          getProducts()
        ]);

        setProducts(filteredResponse.data || []);
        setAllProducts(allResponse.data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, search]);

  const onSidebarCategory = (selectedCategory) => {
    const params = new URLSearchParams(searchParams);
    if (selectedCategory === 'all') {
      params.delete('category');
    } else {
      params.set('category', selectedCategory);
    }
    setSearchParams(params);
  };

  const hasActiveFilter = category !== 'all' || Boolean(search);
  const displayProducts = useMemo(() => {
    if (products.length > 0) return products;
    if (hasActiveFilter) return allProducts;
    return allProducts;
  }, [products, hasActiveFilter, allProducts]);

  const topHeroCards = useMemo(() => {
    const defaults = [
      {
        id: 'hero-1',
        title: 'Tech at lowest prices',
        subtitle: 'Up to 50% Off',
        image_url: allProducts[0]?.image_url || 'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=900'
      },
      {
        id: 'hero-2',
        title: 'Acer Swift Neo OLED AI',
        subtitle: 'Starts ₹50,490*',
        image_url: allProducts[3]?.image_url || 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900'
      },
      {
        id: 'hero-3',
        title: 'OnePlus Nord Buds',
        subtitle: 'Launch offers live',
        image_url: allProducts[2]?.image_url || 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=900'
      }
    ];

    return defaults;
  }, [allProducts]);
  const interestingFinds = useMemo(() => allProducts.slice(3, 7), [allProducts]);
  const grabOrGone = useMemo(() => allProducts.slice(7, 11), [allProducts]);

  const electronicsQuickItems = useMemo(() => {
    const labels = [
      'New Launches',
      'Headsets',
      'Wearables',
      'Grooming',
      'Cases & Covers',
      'Camera',
      'Power Bank',
      'Gaming',
      'Smart devices',
      'Networking',
      'Laptops',
      'Tablets',
      'IT Peripherals',
      '2 Wheeler',
      'Accessories',
      'Mobile Chargers',
      'Storage',
      'Healthcare',
      'Gaming Hub'
    ];

    return labels.map((label, index) => ({
      label,
      image: allProducts[index % Math.max(allProducts.length, 1)]?.image_url || 'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=200'
    }));
  }, [allProducts]);

  return (
    <div className="home-page">
      {!hasActiveFilter ? (
        <>
          <div className="promo-strip">
            {topHeroCards.map((product) => (
              <article key={product.id} className="promo-card">
                <div className="promo-overlay">
                  <span className="promo-badge">BIG SAVING DAYS</span>
                  <h3>{product.title}</h3>
                  <p>{product.subtitle}</p>
                  <button>Know more</button>
                </div>
                <img src={product.image_url} alt={product.title} />
              </article>
            ))}
          </div>
          <div className="hero-dots" aria-hidden>
            <span />
            <span />
            <span className="active" />
            <span />
            <span />
          </div>

          <section className="subcat-strip">
            {electronicsQuickItems.map((item) => (
              <div className="subcat-item" key={item.label}>
                <div className="subcat-icon">
                  <img src={item.image} alt={item.label} />
                </div>
                <span>{item.label}</span>
              </div>
            ))}
          </section>

          <section className="deal-section">
            <h2>Interesting finds</h2>
            <div className="deal-grid">
              {interestingFinds.map((item) => (
                <article key={item.id} className="deal-item">
                  <img src={item.image_url} alt={item.name} />
                  <p>{item.name}</p>
                  <strong>From ₹{Number(item.price).toLocaleString('en-IN')}</strong>
                </article>
              ))}
            </div>
          </section>

          <section className="deal-section">
            <h2>Grab or gone</h2>
            <div className="deal-grid">
              {grabOrGone.map((item) => (
                <article key={item.id} className="deal-item">
                  <img src={item.image_url} alt={item.name} />
                  <p>{item.name}</p>
                  <strong>Min 40% Off</strong>
                </article>
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className="home-layout">
          <aside className="sidebar">
            <h3>Filters</h3>
            <p className="muted">Category</p>
            <div className="category-list">
              {sidebarCategories.map((cat) => (
                <button key={cat} className={cat === category ? 'active' : ''} onClick={() => onSidebarCategory(cat)}>
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              ))}
            </div>
          </aside>

          <div className="listing-section">
            <div className="section-header">
              <h2>{category === 'all' ? 'Interesting finds' : `${category} picks`}</h2>
              {search ? <span>Search: “{search}”</span> : null}
            </div>
            {hasActiveFilter && !products.length && !loading ? (
              <p className="listing-shell-note">No exact match found, showing popular products instead.</p>
            ) : null}
            <ProductGrid products={displayProducts} loading={loading} onAddToCart={addItem} />
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;
