import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiShoppingCart, FiSearch, FiMapPin, FiUser, FiChevronDown, FiX } from 'react-icons/fi';
import { useCart } from '../context/CartContext.jsx';
import { loginUser, signupUser } from '../services/api.js';

const categories = [
  { key: 'all', label: 'For You', icon: '🛍️', backendCategory: 'all' },
  { key: 'fashion', label: 'Fashion', icon: '👕', backendCategory: 'fashion' },
  { key: 'mobiles', label: 'Mobiles', icon: '📱', backendCategory: 'electronics' },
  { key: 'beauty', label: 'Beauty', icon: '💄', backendCategory: 'fashion' },
  { key: 'electronics', label: 'Electronics', icon: '💻', backendCategory: 'electronics' },
  { key: 'home', label: 'Home', icon: '🪑', backendCategory: 'home' },
  { key: 'appliances', label: 'Appliances', icon: '📺', backendCategory: 'appliances' },
  { key: 'toys', label: 'Toys, ba...', icon: '🧸', backendCategory: 'all' },
  { key: 'food', label: 'Food & H...', icon: '🥫', backendCategory: 'home' },
  { key: 'auto', label: 'Auto Acc...', icon: '🪖', backendCategory: 'all' },
  { key: 'sports', label: 'Sports & ...', icon: '🏏', backendCategory: 'all' },
  { key: 'books', label: 'Books & ...', icon: '📚', backendCategory: 'books' },
  { key: 'furniture', label: 'Furniture', icon: '🛋️', backendCategory: 'home' }
];

function Navbar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { itemCount } = useCart();
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ fullName: '', emailOrMobile: '', password: '' });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [userName, setUserName] = useState(() => {
    const raw = localStorage.getItem('flipkartCloneAuthUser');
    if (!raw) return '';
    try {
      return JSON.parse(raw)?.name || '';
    } catch {
      return '';
    }
  });

  const activeCategory = useMemo(() => searchParams.get('nav') || 'all', [searchParams]);

  const onSearchSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams);

    if (searchValue.trim()) {
      params.set('search', searchValue.trim());
    } else {
      params.delete('search');
    }

    navigate(`/?${params.toString()}`);
  };

  const onCategoryClick = (categoryConfig) => {
    const params = new URLSearchParams(searchParams);

    params.set('nav', categoryConfig.key);
    params.delete('search');

    if (categoryConfig.backendCategory === 'all') {
      params.delete('category');
    } else {
      params.set('category', categoryConfig.backendCategory);
    }

    navigate(`/?${params.toString()}`);
  };

  const onAuthInput = (event) => {
    const { name, value } = event.target;
    setAuthForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitAuth = (event) => {
    event.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    const action = async () => {
      const payload = {
        email: authForm.emailOrMobile,
        password: authForm.password
      };

      let response;
      if (authMode === 'signup') {
        response = await signupUser({ ...payload, name: authForm.fullName.trim() });
      } else {
        response = await loginUser(payload);
      }

      localStorage.setItem('flipkartCloneAuthUser', JSON.stringify(response.data));
      setUserName(response.data.name);
      setShowLoginModal(false);
      setAuthForm({ fullName: '', emailOrMobile: '', password: '' });
      navigate('/');
      window.location.reload();
    };

    action().catch((error) => {
      const message = error?.response?.data?.message || 'Authentication failed';
      setAuthError(message);
    }).finally(() => {
      setAuthLoading(false);
    });
  };

  const logout = () => {
    localStorage.removeItem('flipkartCloneAuthUser');
    setUserName('');
    window.location.reload();
  };

  return (
    <header className="navbar-wrapper">
      <div className="service-strip">
        <div className="service-chip active">🟨 Flipkart</div>
        <div className="service-chip">⚡ Minutes</div>
        <div className="service-chip">✈️ Travel</div>
        <div className="service-chip">🛒 Grocery</div>
      </div>

      <div className="topbar">
        <Link className="brand" to="/">
          <span className="brand-mark">f</span>
          <div>
            <strong>Flipkart</strong>
            <small>Clone</small>
          </div>
        </Link>

        <form className="search-form" onSubmit={onSearchSubmit}>
          <FiSearch />
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search for Products, Brands and More"
          />
        </form>

        <div className="top-links">
          <span className="delivery desktop-only">
            <FiMapPin />
            201301 <span>Select delivery location</span>
          </span>

          <button className="nav-action" onClick={() => setShowLoginModal(true)}>
            <FiUser />
            {userName || 'Login'}
            <FiChevronDown size={14} />
          </button>

          {userName ? (
            <Link className="nav-action desktop-only" to="/orders">
              Orders
            </Link>
          ) : null}

          {userName ? (
            <button className="logout-chip desktop-only" onClick={logout}>
              Logout
            </button>
          ) : null}

          <button className="nav-action desktop-only">
            More
            <FiChevronDown size={14} />
          </button>

          <Link className="cart-link" to="/cart">
            <FiShoppingCart />
            Cart
            {itemCount > 0 ? <span className="badge">{itemCount}</span> : null}
          </Link>
        </div>
      </div>

      <nav className="category-nav">
        {categories.map((category) => (
          <button
            key={category.key}
            className={activeCategory === category.key ? 'active' : ''}
            onClick={() => onCategoryClick(category)}
          >
            <span className="cat-icon">{category.icon}</span>
            <span>{category.label}</span>
          </button>
        ))}
      </nav>

      {showLoginModal ? (
        <div className="login-modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <div className="login-left">
              <button className="close-login" onClick={() => setShowLoginModal(false)}>
                <FiX />
              </button>
              <h3>Login</h3>
              <p>Get access to your Orders, Wishlist and Recommendations</p>
            </div>
            <div className="login-right">
              <form className="auth-form" onSubmit={submitAuth}>
                <h4>{authMode === 'login' ? 'Login' : 'Create account'}</h4>

                {authMode === 'signup' ? (
                  <input
                    name="fullName"
                    value={authForm.fullName}
                    onChange={onAuthInput}
                    placeholder="Enter full name"
                    required
                  />
                ) : null}

                <input
                  name="emailOrMobile"
                  value={authForm.emailOrMobile}
                  onChange={onAuthInput}
                  placeholder="Enter Email/Mobile number"
                  required
                />

                <input
                  type="password"
                  name="password"
                  value={authForm.password}
                  onChange={onAuthInput}
                  placeholder="Enter password"
                  required
                />

                <p className="muted tiny">
                  By continuing, you agree to Flipkart&apos;s Terms of Use and Privacy Policy.
                </p>

                <button className="buy-btn" type="submit">
                  {authLoading ? 'Please wait...' : authMode === 'login' ? 'Login' : 'Create account'}
                </button>

                {authError ? <p className="auth-error">{authError}</p> : null}
              </form>

              {authMode === 'login' ? (
                <button className="switch-auth" onClick={() => setAuthMode('signup')}>
                  New to Flipkart? Create an account
                </button>
              ) : (
                <button className="switch-auth" onClick={() => setAuthMode('login')}>
                  Already have an account? Login
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default Navbar;
