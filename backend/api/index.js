import dotenv from 'dotenv';
import app from '../src/app.js';
import { initDatabase } from '../src/models/db.js';

dotenv.config();

let dbInitialized = false;

export default async function handler(req, res) {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }

  return app(req, res);
}
