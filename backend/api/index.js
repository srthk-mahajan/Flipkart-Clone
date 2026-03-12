import dotenv from 'dotenv';
import app from '../src/app.js';
import { initDatabase, pool } from '../src/models/db.js';

dotenv.config();

let dbInitialized = false;
let dbInitPromise = null;
const DB_INIT_TIMEOUT_MS = Number(process.env.DB_INIT_TIMEOUT_MS || 8000);
const SHOULD_BOOTSTRAP_SCHEMA_ON_COLD_START =
  process.env.DB_BOOTSTRAP_ON_COLD_START === 'true' || process.env.NODE_ENV !== 'production';

const withTimeout = async (promise, timeoutMs, errorMessage) => {
  let timeoutId;

  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
      })
    ]);
  } finally {
    clearTimeout(timeoutId);
  }
};

const ensureDatabaseReady = async () => {
  if (dbInitialized) return;

  if (!SHOULD_BOOTSTRAP_SCHEMA_ON_COLD_START) {
    dbInitialized = true;
    return;
  }

  if (!dbInitPromise) {
    dbInitPromise = (async () => {
      const checkResult = await pool.query(
        `
        SELECT
          to_regclass('public.users') AS users_table,
          to_regclass('public.products') AS products_table,
          to_regclass('public.cart_items') AS cart_items_table,
          to_regclass('public.orders') AS orders_table,
          to_regclass('public.order_items') AS order_items_table;
        `
      );

      const row = checkResult.rows[0] || {};
      const schemaReady = row.users_table && row.products_table && row.cart_items_table && row.orders_table && row.order_items_table;

      if (!schemaReady) {
        await initDatabase();
      }

      dbInitialized = true;
    })().finally(() => {
      dbInitPromise = null;
    });
  }

  await dbInitPromise;
};

export default async function handler(req, res) {
  if (!req.url?.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: 'Not Found'
    });
  }

  try {
    await withTimeout(ensureDatabaseReady(), DB_INIT_TIMEOUT_MS, 'Database initialization timed out');
  } catch (error) {
    console.error('Database initialization failed:', error.message);
    return res.status(503).json({
      success: false,
      message: 'Service temporarily unavailable. Please try again shortly.'
    });
  }

  return app(req, res);
}
