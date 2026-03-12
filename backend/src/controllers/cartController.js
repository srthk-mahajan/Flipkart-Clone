import { pool } from '../models/db.js';

const getEffectiveUserId = (req) => Number(req.body.userId || req.query.userId || process.env.DEFAULT_USER_ID || 1);

export const getCartItems = async (req, res, next) => {
  try {
    const userId = getEffectiveUserId(req);

    const { rows } = await pool.query(
      `
      SELECT
        ci.id,
        ci.user_id,
        ci.product_id,
        ci.quantity,
        p.name,
        p.price,
        p.stock,
        p.image_url,
        p.category,
        (ci.quantity * p.price) AS item_total
      FROM cart_items ci
      INNER JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = $1
      ORDER BY ci.id ASC;
      `,
      [userId]
    );

    const subtotal = rows.reduce((acc, item) => acc + Number(item.item_total), 0);

    res.status(200).json({
      success: true,
      data: rows,
      summary: {
        subtotal,
        total: subtotal
      }
    });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const userId = getEffectiveUserId(req);
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'productId is required' });
    }

    const productResult = await pool.query('SELECT id, stock FROM products WHERE id = $1', [productId]);
    const product = productResult.rows[0];

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const cartItemResult = await pool.query(
      'SELECT id, quantity FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );

    if (cartItemResult.rows[0]) {
      const existing = cartItemResult.rows[0];
      const updatedQuantity = existing.quantity + Number(quantity);

      if (updatedQuantity > product.stock) {
        return res.status(400).json({ success: false, message: 'Requested quantity exceeds stock' });
      }

      await pool.query('UPDATE cart_items SET quantity = $1 WHERE id = $2', [updatedQuantity, existing.id]);
    } else {
      if (Number(quantity) > product.stock) {
        return res.status(400).json({ success: false, message: 'Requested quantity exceeds stock' });
      }

      await pool.query(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3)',
        [userId, productId, Number(quantity)]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Item added to cart'
    });
  } catch (error) {
    next(error);
  }
};

export const updateCartQuantity = async (req, res, next) => {
  try {
    const userId = getEffectiveUserId(req);
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: 'quantity should be greater than 0' });
    }

    const cartItemResult = await pool.query(
      `
      SELECT ci.id, ci.product_id, p.stock
      FROM cart_items ci
      INNER JOIN products p ON ci.product_id = p.id
      WHERE ci.id = $1 AND ci.user_id = $2;
      `,
      [id, userId]
    );

    const cartItem = cartItemResult.rows[0];

    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    if (Number(quantity) > cartItem.stock) {
      return res.status(400).json({ success: false, message: 'Requested quantity exceeds stock' });
    }

    await pool.query('UPDATE cart_items SET quantity = $1 WHERE id = $2', [Number(quantity), id]);

    res.status(200).json({
      success: true,
      message: 'Cart quantity updated'
    });
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (req, res, next) => {
  try {
    const userId = getEffectiveUserId(req);
    const { id } = req.params;

    const deleteResult = await pool.query('DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING id', [id, userId]);

    if (!deleteResult.rows[0]) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Cart item removed'
    });
  } catch (error) {
    next(error);
  }
};
