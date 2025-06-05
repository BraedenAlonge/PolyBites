import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import testRouter from './routes/test.js';
import restaurantRoutes from './routes/restaurants.js';
import profileRoutes from './routes/profiles.js';
import foodRoutes from './routes/foods.js';
import foodReviewRoutes from './routes/foodReviews.js';
import restaurantReviewRoutes from './routes/restaurantReviews.js';

dotenv.config(); // ✅ correct way to load .env in ESM

const app = express(); // <-- ONLY HERE do we declare 'app'

app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.send('PolyBites Backend is running!');
});

// API Routes
app.use('/test', testRouter);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/food-reviews', foodReviewRoutes);
app.use('/api/restaurant-reviews', restaurantReviewRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});