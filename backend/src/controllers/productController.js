import { pool } from '../models/db.js';

const PRODUCT_RESPONSE_CACHE_TTL_MS = Number(process.env.PRODUCT_RESPONSE_CACHE_TTL_MS || 60_000);
const productResponseCache = new Map();

const getProductsCacheKey = ({ search, category }) => {
  const normalizedSearch = String(search || '').trim().toLowerCase();
  const normalizedCategory = String(category || '').trim().toLowerCase();
  return `search=${normalizedSearch}&category=${normalizedCategory}`;
};

const getCachedProductsResponse = (key) => {
  const cached = productResponseCache.get(key);
  if (!cached) return null;

  if (Date.now() > cached.expiresAt) {
    productResponseCache.delete(key);
    return null;
  }

  return cached.payload;
};

const setCachedProductsResponse = (key, payload) => {
  productResponseCache.set(key, {
    payload,
    expiresAt: Date.now() + PRODUCT_RESPONSE_CACHE_TTL_MS
  });
};

const getProductByIdCacheKey = (id) => `id=${id}`;

export const getProducts = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const cacheKey = getProductsCacheKey({ search, category });
    const cachedPayload = getCachedProductsResponse(cacheKey);

    if (cachedPayload) {
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
      return res.status(200).json(cachedPayload);
    }

    const filters = [];
    const values = [];

    if (search) {
      values.push(`%${search}%`);
      filters.push(`name ILIKE $${values.length}`);
    }

    if (category) {
      values.push(category);
      filters.push(`LOWER(category) = LOWER($${values.length})`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const query = `
      SELECT id, name, description, price, category, stock, image_url, image_urls
      FROM products
      ${whereClause}
      ORDER BY id ASC;
    `;

    const { rows } = await pool.query(query, values);

    // Edge Caching: Cache products for 60 seconds on Vercel Edge
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');

    const payload = {
      success: true,
      count: rows.length,
      data: rows
    };

    setCachedProductsResponse(cacheKey, payload);
    res.status(200).json(payload);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cacheKey = getProductByIdCacheKey(id);
    const cachedPayload = getCachedProductsResponse(cacheKey);

    if (cachedPayload) {
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
      return res.status(200).json(cachedPayload);
    }

    const { rows } = await pool.query(
      `
      SELECT id, name, description, price, category, stock, image_url, image_urls
      FROM products
      WHERE id = $1;
      `,
      [id]
    );

    if (!rows[0]) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Edge Caching
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');

    const payload = {
      success: true,
      data: rows[0]
    };

    setCachedProductsResponse(cacheKey, payload);
    res.status(200).json(payload);
  } catch (error) {
    next(error);
  }
};
