import dotenv from 'dotenv';
import app from '../src/app.js';
import { initDatabase, pool } from '../src/models/db.js';

dotenv.config();

let dbInitialized = false;
let dbInitPromise = null;

const ensureDatabaseReady = async () => {
  if (dbInitialized) return;

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
  await ensureDatabaseReady();

  return app(req, res);
}
