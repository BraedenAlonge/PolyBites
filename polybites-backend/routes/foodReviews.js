const express = require('express');
const router = express.Router();
const { getFoodReviews, createFoodReview } = require('../controllers/foodReviewController');

router.get('/', getFoodReviews);
router.post('/', createFoodReview);

module.exports = router; 