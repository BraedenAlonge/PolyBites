const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const restaurantRoutes = require('./routes/restaurants');
const userRoutes = require('./routes/users');
const foodRoutes = require('./routes/foods');
const foodReviewRoutes = require('./routes/foodReviews');
const restaurantReviewRoutes = require('./routes/restaurantReviews');

app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.send('PolyBites Backend is running!');
});

// API Routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/users', userRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/food-reviews', foodReviewRoutes);
app.use('/api/restaurant-reviews', restaurantReviewRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
