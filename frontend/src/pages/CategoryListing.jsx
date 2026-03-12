import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { getProducts } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

const supportedCategories = ['all', 'electronics', 'fashion', 'home', 'appliances', 'books'];

const sortOptions = [
  { key: 'popularity', label: 'Popularity' },
  { key: 'price_asc', label: 'Price -- Low to High' },
  { key: 'price_desc', label: 'Price -- High to Low' },
  { key: 'newest', label: 'Newest First' }
];

const knownBrands = [
  'ASUS', 'HP', 'DELL', 'LENOVO', 'SAMSUNG', 'APPLE', 'MOTOROLA', 'NOTHING', 'BOAT', 'JBL',
  'CANON', 'MI', 'PHILIPS', 'IFB', 'PRESTIGE', 'KENT', 'LG', 'BAJAJ', 'HAVELLS', 'EUREKA',
  'CAMPUS', 'FIRE-BOLTT'
];

const firstMatch = (value, regex) => value.match(regex)?.[1]?.trim();

const getBrand = (product) => {
  const title = String(product.name || '').toUpperCase();
  const found = knownBrands.find((brand) => title.includes(brand));
  if (found) return [found];
  return [];
};

const getProcessor = (product) => {
  const source = `${product.name || ''} ${product.description || ''}`.toLowerCase();
  const map = [
    ['core i3', 'Core i3'],
    ['core i5', 'Core i5'],
    ['core i7', 'Core i7'],
    ['core i9', 'Core i9'],
    ['core 5', 'Core 5'],
    ['ryzen 3', 'Ryzen 3'],
    ['ryzen 5', 'Ryzen 5'],
    ['ryzen 7', 'Ryzen 7'],
    ['snapdragon', 'Snapdragon'],
    ['mediatek', 'MediaTek'],
    ['intel celeron', 'Intel Celeron'],
    ['apple m', 'Apple M Series']
  ];

  return map.filter(([token]) => source.includes(token)).map(([, label]) => label);
};

const getType = (product) => {
  const source = `${product.name || ''} ${product.description || ''}`.toLowerCase();
  const map = [
    ['laptop', 'Laptops'],
    ['phone', 'Mobiles'],
    ['earbud', 'Audio'],
    ['speaker', 'Audio'],
    ['watch', 'Wearables'],
    ['camera', 'Camera'],
    ['book', 'Books'],
    ['shirt', 'Clothing'],
    ['jeans', 'Clothing'],
    ['shoe', 'Footwear'],
    ['sneaker', 'Footwear'],
    ['chair', 'Furniture'],
    ['table', 'Furniture'],
    ['kettle', 'Kitchen Appliances'],
    ['microwave', 'Kitchen Appliances'],
    ['air fryer', 'Kitchen Appliances'],
    ['tv', 'Televisions']
  ];

  return map.filter(([token]) => source.includes(token)).map(([, label]) => label);
};

const getRamCapacity = (product) => {
  const source = `${product.name || ''} ${product.description || ''}`;
  const regex = /(\d+\s?GB)\s?(?:DDR\d|LPDDR\d|RAM|UNIFIED MEMORY)/ig;
  return [...source.matchAll(regex)].map((match) => match[1].replace(/\s+/g, ' ').toUpperCase());
};

const getScreenSize = (product) => {
  const source = `${product.name || ''} ${product.description || ''}`;
  const inch = firstMatch(source, /(\d{1,2}(?:\.\d+)?)\s?inch/i);
  if (inch) return [`${inch}"`];
  const cm = firstMatch(source, /(\d{1,2}(?:\.\d+)?)\s?cm/i);
  if (cm) return [`${cm} cm`];
  return [];
};

const getSsdCapacity = (product) => {
  const source = `${product.name || ''} ${product.description || ''}`;
  const regex = /(\d+\s?(?:GB|TB))\s?SSD/ig;
  return [...source.matchAll(regex)].map((match) => match[1].replace(/\s+/g, ' ').toUpperCase());
};

const getGraphicProcessorName = (product) => {
  const source = `${product.name || ''} ${product.description || ''}`.toLowerCase();
  if (source.includes('rtx 3050')) return ['RTX 3050'];
  if (source.includes('graphics')) return ['Integrated Graphics'];
  if (source.includes('gaming')) return ['Gaming Graphics'];
  return [];
};

const getProcessorBrand = (product) => {
  const source = `${product.name || ''} ${product.description || ''}`.toLowerCase();
  const brands = [];
  if (source.includes('intel') || source.includes('core')) brands.push('Intel');
  if (source.includes('ryzen') || source.includes('amd')) brands.push('AMD');
  if (source.includes('mediatek')) brands.push('MediaTek');
  if (source.includes('snapdragon')) brands.push('Qualcomm');
  if (source.includes('apple m')) brands.push('Apple');
  return brands;
};

const getGender = (product) => {
  const source = `${product.name || ''} ${product.description || ''}`.toLowerCase();
  const result = [];
  if (source.includes('women')) result.push('Women');
  if (source.includes('men')) result.push('Men');
  if (!result.length) result.push('Unisex');
  return result;
};

const getBookGenre = (product) => {
  const source = `${product.name || ''} ${product.description || ''}`.toLowerCase();
  const genres = [];
  if (source.includes('algorithm') || source.includes('code') || source.includes('software')) genres.push('Technology');
  if (source.includes('habit') || source.includes('life') || source.includes('motiv')) genres.push('Self Help');
  if (source.includes('money') || source.includes('startup') || source.includes('finance')) genres.push('Business');
  if (source.includes('history') || source.includes('sapiens')) genres.push('History');
  if (!genres.length) genres.push('General');
  return genres;
};

const filterSectionDefs = [
  { key: 'brand', title: 'BRAND', extract: getBrand },
  { key: 'processor', title: 'PROCESSOR', extract: getProcessor },
  { key: 'type', title: 'TYPE', extract: getType },
  { key: 'ramCapacity', title: 'RAM CAPACITY', extract: getRamCapacity },
  { key: 'screenSize', title: 'SCREEN SIZE', extract: getScreenSize },
  { key: 'ssdCapacity', title: 'SSD CAPACITY', extract: getSsdCapacity },
  { key: 'graphicProcessorName', title: 'GRAPHIC PROCESSOR NAME', extract: getGraphicProcessorName },
  { key: 'processorBrand', title: 'PROCESSOR BRAND', extract: getProcessorBrand },
  { key: 'gender', title: 'GENDER', extract: getGender },
  { key: 'genre', title: 'GENRE', extract: getBookGenre }
];

const filterKeysByCategory = {
  all: ['brand', 'type', 'processorBrand'],
  electronics: ['brand', 'processor', 'ramCapacity', 'screenSize', 'ssdCapacity', 'processorBrand', 'type'],
  fashion: ['gender', 'type', 'brand'],
  home: ['type', 'brand'],
  appliances: ['brand', 'type', 'processorBrand'],
  books: ['genre', 'type']
};

const fakeRating = (id) => (3.8 + (id % 12) * 0.1).toFixed(1);
const fakeReviews = (id) => 30 + (id % 80) * 17;

function CategoryListing() {
  const { categoryKey } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fallbackApplied, setFallbackApplied] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    brand: true,
    processor: true,
    type: false,
    ramCapacity: false,
    screenSize: false,
    ssdCapacity: false,
    graphicProcessorName: false,
    processorBrand: false
  });
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addItem } = useCart();

  const selectedCategory = supportedCategories.includes(categoryKey) ? categoryKey : 'all';
  const search = (searchParams.get('search') || '').trim();
  const sortBy = searchParams.get('sort') || 'popularity';
  const inStockOnly = searchParams.get('inStock') === '1';

  useEffect(() => {
    setSelectedFilters({});
    const fetchData = async () => {
      setLoading(true);
      setFallbackApplied(false);
      try {
        const [filtered, full] = await Promise.all([
          getProducts({
            ...(selectedCategory !== 'all' ? { category: selectedCategory } : {}),
            ...(search ? { search } : {})
          }),
          getProducts()
        ]);

        let resultData = filtered?.data || [];

        if (search && !resultData.length) {
          const fallback = await getProducts({
            ...(selectedCategory !== 'all' ? { category: selectedCategory } : {})
          });
          resultData = fallback?.data || [];
          if (resultData.length) {
            setFallbackApplied(true);
          }
        }

        setProducts(resultData);
        setAllProducts(full?.data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, search]);

  const dynamicFilterSections = useMemo(() => {
    const allowedSectionKeys = filterKeysByCategory[selectedCategory] || filterKeysByCategory.all;

    return filterSectionDefs
      .filter((section) => allowedSectionKeys.includes(section.key))
      .map((section) => {
      const counts = products.reduce((acc, product) => {
        const values = section.extract(product);
        values.forEach((value) => {
          acc[value] = (acc[value] || 0) + 1;
        });
        return acc;
      }, {});

        const options = Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 12)
          .map(([value, count]) => ({ value, count }));

        return {
          ...section,
          options
        };
      })
      .filter((section) => section.options.length > 0);
  }, [products, selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts = allProducts.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});
    counts.all = allProducts.length;
    return counts;
  }, [allProducts]);

  const displayProducts = useMemo(() => {
    let filtered = [...products];

    if (inStockOnly) {
      filtered = filtered.filter((item) => Number(item.stock) > 0);
    }

    filtered = filtered.filter((item) => {
      return dynamicFilterSections.every((section) => {
        const selected = selectedFilters[section.key] || [];
        if (!selected.length) return true;

        const values = section.extract(item);
        return selected.some((selectedValue) => values.includes(selectedValue));
      });
    });

    if (sortBy === 'price_asc') {
      filtered.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price_desc') {
      filtered.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => Number(b.id) - Number(a.id));
    }

    return filtered;
  }, [products, inStockOnly, sortBy, dynamicFilterSections, selectedFilters]);

  const setSort = (key) => {
    const next = new URLSearchParams(searchParams);
    next.set('sort', key);
    setSearchParams(next);
  };

  const toggleInStock = () => {
    const next = new URLSearchParams(searchParams);
    if (inStockOnly) {
      next.delete('inStock');
    } else {
      next.set('inStock', '1');
    }
    setSearchParams(next);
  };

  const toggleSection = (sectionKey) => {
    setExpandedSections((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  const toggleFilterValue = (sectionKey, value) => {
    setSelectedFilters((prev) => {
      const current = prev[sectionKey] || [];
      const nextValues = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];

      return {
        ...prev,
        [sectionKey]: nextValues
      };
    });
  };

  const goToCategory = (category) => {
    const next = new URLSearchParams(searchParams);
    if (category === 'all') {
      next.delete('search');
    }
    navigate(`/category/${category}?${next.toString()}`);
  };

  const onAddToCart = async (productId) => {
    await addItem(productId, 1);
  };

  const heading = selectedCategory === 'all' ? 'All Products' : selectedCategory;

  return (
    <section className="listing-layout">
      <aside className="listing-sidebar panel">
        <h3>Filters</h3>

        <div className="filter-block">
          <h4>CATEGORIES</h4>
          {supportedCategories.map((category) => (
            <button
              key={category}
              className={`filter-link ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => goToCategory(category)}
            >
              <span>{category === 'all' ? 'All Categories' : category}</span>
              <small>{categoryCounts[category] || 0}</small>
            </button>
          ))}
        </div>

        <div className="filter-block">
          <h4>AVAILABILITY</h4>
          <label className="check-row">
            <input type="checkbox" checked={inStockOnly} onChange={toggleInStock} />
            In stock only
          </label>
        </div>

        {dynamicFilterSections.map((section) => (
          <div className="filter-block collapsed" key={section.title}>
            <button className="collapse-row" type="button" onClick={() => toggleSection(section.key)}>
              <span>{section.title}</span>
              <span>{expandedSections[section.key] ? '▴' : '▾'}</span>
            </button>

            {expandedSections[section.key] ? (
              <div className="filter-options">
                {section.options.length ? (
                  section.options.map((option) => (
                    <label className="filter-option-row" key={`${section.key}-${option.value}`}>
                      <span>
                        <input
                          type="checkbox"
                          checked={(selectedFilters[section.key] || []).includes(option.value)}
                          onChange={() => toggleFilterValue(section.key, option.value)}
                        />
                        <span>{option.value}</span>
                      </span>
                      <small>{option.count}</small>
                    </label>
                  ))
                ) : (
                  <p className="muted tiny">No options for current selection</p>
                )}
              </div>
            ) : null}
          </div>
        ))}
      </aside>

      <div className="listing-content panel">
        <p className="crumbs">
          <Link to="/">Home</Link> &gt; <span>{heading}</span>
        </p>

        <div className="list-title-row">
          <h2>{heading}</h2>
          <span>
            (Showing 1 – {displayProducts.length} products of {products.length} products)
          </span>
        </div>

        <div className="sort-row">
          <strong>Sort By</strong>
          {sortOptions.map((option) => (
            <button
              key={option.key}
              className={sortBy === option.key ? 'active' : ''}
              onClick={() => setSort(option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {loading ? <div className="panel">Loading products...</div> : null}
        {!loading && fallbackApplied ? (
          <p className="listing-shell-note">No exact match found. Showing popular products from this category.</p>
        ) : null}
        {!loading && !displayProducts.length ? <div className="panel">No products found.</div> : null}

        {!loading && displayProducts.length
          ? displayProducts.map((product) => {
            const oldPrice = Math.round(Number(product.price) * 1.25);
            const discount = Math.max(5, Math.round(((oldPrice - Number(product.price)) / oldPrice) * 100));
            return (
              <article key={product.id} className="listing-row-item">
                <div className="listing-left-col">
                  <button className="heart-corner-btn" onClick={() => toggleWishlist(product.id)}>
                    <FiHeart className={isWishlisted(product.id) ? 'filled' : ''} />
                  </button>

                  <Link to={`/product/${product.id}`} className="listing-thumb">
                    <img src={product.image_url} alt={product.name} loading="lazy" />
                  </Link>

                  <label className="compare-row">
                    <input type="checkbox" /> Add to Compare
                  </label>
                </div>

                <div className="listing-meta">
                  <Link to={`/product/${product.id}`} className="listing-name">
                    {product.name}
                  </Link>
                  <div className="rating-line">
                    <span className="rating-chip">{fakeRating(product.id)} ★</span>
                    <span>{fakeReviews(product.id).toLocaleString('en-IN')} Ratings & Reviews</span>
                  </div>
                  <ul>
                    <li>{product.description}</li>
                    <li>Category: {product.category}</li>
                    <li>{product.stock > 0 ? `${product.stock} units in stock` : 'Currently unavailable'}</li>
                  </ul>
                </div>

                <div className="listing-price">
                  <p className="final-price">₹{Number(product.price).toLocaleString('en-IN')}</p>
                  <p className="mrp">
                    ₹{Number(oldPrice).toLocaleString('en-IN')} <span>{discount}% off</span>
                  </p>
                  <p className="bank-offer">Bank Offer available</p>

                  <button className="wishlist-icon-btn" onClick={() => toggleWishlist(product.id)}>
                    <FiHeart className={isWishlisted(product.id) ? 'filled' : ''} />
                    {isWishlisted(product.id) ? 'Wishlisted' : 'Wishlist'}
                  </button>

                  <button className="primary-btn" onClick={() => onAddToCart(product.id)} disabled={product.stock < 1}>
                    Add to cart
                  </button>
                </div>
              </article>
            );
          })
          : null}
      </div>
    </section>
  );
}

export default CategoryListing;
