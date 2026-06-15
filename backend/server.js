import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import testRoutes from './routes/testRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables from .env
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = appContent();

function appContent() {
  const serverApp = express();

  // Middleware
  serverApp.use(cors());
  serverApp.use(express.json({ limit: '50mb' })); // Allow parsing of large JSON payloads (base64 image uploads)
  serverApp.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Root endpoint
  serverApp.get('/', (req, res) => {
    res.send('API is running...');
  });

  // API Routes
  serverApp.use('/api/test', testRoutes);
  serverApp.use('/api/products', productRoutes);
  serverApp.use('/api/users', userRoutes);

  // Error Handling Middleware
  serverApp.use(notFound);
  serverApp.use(errorHandler);

  return serverApp;
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
