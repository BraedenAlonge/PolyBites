const express = require('express');
const router = express.Router();
const { getRestaurantReviews } = require('../controllers/restaurantReviewController');

router.get('/', getRestaurantReviews);

module.exports = router; 