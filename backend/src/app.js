import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174'
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    }
  })
);

import { pool } from './models/db.js';

app.use(express.json());

app.get('/api/ping', (req, res) => {
  res.status(200).json({ success: true, message: 'pong' });
});

app.get('/api/health', async (req, res) => {
  try {
    // Ping the database to keep Serverless Postgres awake
    await pool.query('SELECT 1');
    res.status(200).json({ success: true, message: 'Backend and Database are running' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database connection failed' });
  }
});

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
