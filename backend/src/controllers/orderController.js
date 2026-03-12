import { pool } from '../models/db.js';
import { sendOrderPlacedEmail } from '../services/emailService.js';
import { resolveEffectiveUserId } from '../utils/identity.js';

export const createOrder = async (req, res, next) => {
  const client = await pool.connect();

  try {
    const userId = await resolveEffectiveUserId(req, client);

    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId or guestId is required' });
    }

    const { shippingAddress } = req.body;
    let user = null;

    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: 'shippingAddress is required' });
    }

    await client.query('BEGIN');

    const userResult = await client.query(
      `
      SELECT id, name, email
      FROM users
      WHERE id = $1;
      `,
      [userId]
    );
    user = userResult.rows[0] || null;

    const cartResult = await client.query(
      `
      SELECT ci.product_id, ci.quantity, p.price, p.stock, p.name
      FROM cart_items ci
      INNER JOIN products p ON p.id = ci.product_id
      WHERE ci.user_id = $1;
      `,
      [userId]
    );

    const cartItems = cartResult.rows;

    if (!cartItems.length) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    for (const item of cartItems) {
      if (item.quantity > item.stock) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.name}`
        });
      }
    }

    const totalAmount = cartItems.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);

    const orderInsertResult = await client.query(
      `
      INSERT INTO orders (user_id, total_amount, status, shipping_address)
      VALUES ($1, $2, 'PLACED', $3)
      RETURNING id, user_id, total_amount, status, created_at, shipping_address;
      `,
      [userId, totalAmount, shippingAddress]
    );

    const order = orderInsertResult.rows[0];

    for (const item of cartItems) {
      await client.query(
        `
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES ($1, $2, $3, $4);
        `,
        [order.id, item.product_id, item.quantity, item.price]
      );

      await client.query(
        `
        UPDATE products
        SET stock = stock - $1
        WHERE id = $2;
        `,
        [item.quantity, item.product_id]
      );
    }

    await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

    await client.query('COMMIT');

    const orderPayload = {
      ...order,
      items: cartItems
    };

    const recipientEmail = process.env.ORDER_TO_EMAIL || user?.email;
    void sendOrderPlacedEmail({
      recipientEmail,
      recipientName: user?.name || 'Customer',
      order: orderPayload
    }).catch((emailError) => {
      console.error('Order email notification failed:', emailError?.message || emailError);
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: orderPayload
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const userId = await resolveEffectiveUserId(req);

    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId or guestId is required' });
    }

    const ordersResult = await pool.query(
      `
      SELECT id, user_id, total_amount, status, shipping_address, created_at
      FROM orders
      WHERE user_id = $1
      ORDER BY created_at DESC;
      `,
      [userId]
    );

    const orders = [];

    for (const order of ordersResult.rows) {
      const itemsResult = await pool.query(
        `
        SELECT oi.id, oi.product_id, oi.quantity, oi.price, p.name, p.image_url
        FROM order_items oi
        INNER JOIN products p ON p.id = oi.product_id
        WHERE oi.order_id = $1
        ORDER BY oi.id ASC;
        `,
        [order.id]
      );

      orders.push({
        ...order,
        items: itemsResult.rows
      });
    }

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};
