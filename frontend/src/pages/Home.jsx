import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

function Home() {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [heroStartIndex, setHeroStartIndex] = useState(0);
  const { addItem } = useCart();
  const { wishlistIds } = useWishlist();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const allResponse = await getProducts();
        setAllProducts(allResponse.data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const goToListing = (category, search = '') => {
    const params = new URLSearchParams({ sort: 'popularity' });
    if (search.trim()) {
      params.set('search', search.trim());
    }
    navigate(`/category/${category}?${params.toString()}`);
  };

  const topHeroCards = useMemo(() => {
    return [
      {
        id: 'hero-1',
        title: 'Tech at lowest prices',
        subtitle: 'Up to 50% Off',
        category: 'electronics',
        search: 'phone',
        image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200'
      },
      {
        id: 'hero-2',
        title: 'Acer Swift Neo OLED AI',
        subtitle: 'Starts ₹50,490*',
        category: 'electronics',
        search: 'laptop',
        image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200'
      },
      {
        id: 'hero-3',
        title: 'OnePlus Nord Buds',
        subtitle: 'Launch offers live',
        category: 'electronics',
        search: 'earbuds',
        image_url: 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=1200'
      },
      {
        id: 'hero-4',
        title: 'Style update sale',
        subtitle: 'From ₹499 only',
        category: 'fashion',
        search: 'shirt',
        image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200'
      },
      {
        id: 'hero-5',
        title: 'Smart home picks',
        subtitle: 'Up to 40% Off',
        category: 'home',
        search: 'chair',
        image_url: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=1200'
      },
      {
        id: 'hero-6',
        title: 'Book fair specials',
        subtitle: 'Bestsellers under ₹599',
        category: 'books',
        search: 'book',
        image_url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1200'
      }
    ];
  }, []);

  useEffect(() => {
    if (topHeroCards.length <= 1) return undefined;

    const interval = setInterval(() => {
      setHeroStartIndex((prev) => (prev + 1) % topHeroCards.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [topHeroCards.length]);

  const visibleHeroCards = useMemo(() => {
    const visibleCount = Math.min(3, topHeroCards.length);
    return Array.from({ length: visibleCount }, (_, offset) => {
      const index = (heroStartIndex + offset) % topHeroCards.length;
      return topHeroCards[index];
    });
  }, [topHeroCards, heroStartIndex]);

  const interestingFinds = useMemo(() => allProducts.slice(3, 7), [allProducts]);
  const grabOrGone = useMemo(() => allProducts.slice(7, 11), [allProducts]);
  const wishlistPreview = useMemo(
    () => allProducts.filter((item) => wishlistIds.includes(Number(item.id))).slice(0, 4),
    [allProducts, wishlistIds]
  );

  const electronicsQuickItems = useMemo(() => {
    return [
      {
        label: 'New Launches',
        category: 'electronics',
        search: 'phone',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300'
      },
      {
        label: 'Headsets',
        category: 'electronics',
        search: 'earbuds',
        image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300'
      },
      {
        label: 'Wearables',
        category: 'electronics',
        search: 'watch',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300'
      },
      {
        label: 'Grooming',
        category: 'fashion',
        search: 'shirt',
        image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300'
      },
      {
        label: 'Cases & Covers',
        category: 'electronics',
        search: 'mobile',
        image: 'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=300'
      },
      {
        label: 'Camera',
        category: 'electronics',
        search: 'camera',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300'
      },
      {
        label: 'Power Bank',
        category: 'electronics',
        search: 'power bank',
        image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300'
      },
      {
        label: 'Gaming',
        category: 'electronics',
        search: 'keyboard',
        image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=300'
      },
      {
        label: 'Smart devices',
        category: 'electronics',
        search: 'smart watch',
        image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=300'
      },
      {
        label: 'Networking',
        category: 'electronics',
        search: 'wireless',
        image: 'https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=300'
      }
    ];
  }, []);

  if (loading) {
    return <div className="panel">Loading homepage deals...</div>;
  }

  return (
    <div className="home-page">
      <>
        <div className="promo-strip">
          {visibleHeroCards.map((product) => (
            <article
              key={product.id}
              className="promo-card clickable"
              onClick={() => goToListing(product.category, product.search)}
            >
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
        <div className="hero-dots">
          {topHeroCards.map((card, idx) => (
            <button
              key={card.id}
              type="button"
              className={idx === heroStartIndex ? 'active' : ''}
              onClick={() => setHeroStartIndex(idx)}
              aria-label={`Show slide ${idx + 1}`}
            />
          ))}
        </div>

        <section className="subcat-strip">
          {electronicsQuickItems.map((item) => (
            <button
              className="subcat-item"
              key={item.label}
              onClick={() => goToListing(item.category, item.search)}
            >
              <div className="subcat-icon">
                <img src={item.image} alt={item.label} />
              </div>
              <span>{item.label}</span>
            </button>
          ))}
        </section>

        <section className="deal-section">
          <h2>Interesting finds</h2>
          <div className="deal-grid">
            {interestingFinds.map((item) => (
              <article
                key={item.id}
                className="deal-item clickable"
                onClick={() => goToListing(item.category, item.name)}
              >
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
              <article
                key={item.id}
                className="deal-item clickable"
                onClick={() => goToListing(item.category, item.name)}
              >
                <img src={item.image_url} alt={item.name} />
                <p>{item.name}</p>
                <strong>Min 40% Off</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="wishlist-home-section panel">
          <div className="wishlist-home-head">
            <h2>Wishlist segment</h2>
            <Link to="/wishlist">Open wishlist</Link>
          </div>

          {!wishlistPreview.length ? (
            <p className="muted">No wishlist items yet. Tap the heart icon on listing pages to save products.</p>
          ) : (
            <div className="wishlist-preview-grid">
              {wishlistPreview.map((item) => (
                <article
                  key={item.id}
                  className="wishlist-preview-card clickable"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <Link to={`/product/${item.id}`}>
                    <img src={item.image_url} alt={item.name} />
                  </Link>
                  <p>{item.name}</p>
                  <strong>₹{Number(item.price).toLocaleString('en-IN')}</strong>
                  <button
                    className="primary-btn"
                    onClick={(event) => {
                      event.stopPropagation();
                      addItem(item.id);
                    }}
                  >
                    Add to cart
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </>
    </div>
  );
}

export default Home;
