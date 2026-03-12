import { pool } from '../models/db.js';

export const getProducts = async (req, res, next) => {
  try {
    const { search, category } = req.query;

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
      SELECT id, name, description, price, category, stock, image_url
      FROM products
      ${whereClause}
      ORDER BY id ASC;
    `;

    const { rows } = await pool.query(query, values);

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(
      `
      SELECT id, name, description, price, category, stock, image_url
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

    res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    next(error);
  }
};
