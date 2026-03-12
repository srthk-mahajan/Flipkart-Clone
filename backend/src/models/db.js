import pg from 'pg';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('connect', (client) => {
  client.query('SET search_path TO public').catch((error) => {
    console.error('Failed to set search_path on DB connection:', error.message);
  });
});

export const initDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(180) UNIQUE NOT NULL,
        password_hash VARCHAR(255)
      );
    `);

    await client.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
        category VARCHAR(80) NOT NULL,
        stock INT NOT NULL CHECK (stock >= 0),
        image_url TEXT NOT NULL,
        image_urls TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[]
      );
    `);

    await client.query(`
      ALTER TABLE products
      ADD COLUMN IF NOT EXISTS image_urls TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL CHECK (quantity > 0),
        CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_cart_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        CONSTRAINT uq_cart_user_product UNIQUE (user_id, product_id)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
        status VARCHAR(50) NOT NULL DEFAULT 'PLACED',
        shipping_address TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL CHECK (quantity > 0),
        price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
        CONSTRAINT fk_order_item_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        CONSTRAINT fk_order_item_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
      );
    `);

    const demoPasswordHash = crypto.createHash('sha256').update('demo123').digest('hex');
    await client.query(
      `
      INSERT INTO users (name, email, password_hash)
      VALUES ('Demo User', 'demo@flipkartclone.com', $1)
      ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;
      `,
      [demoPasswordHash]
    );

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
