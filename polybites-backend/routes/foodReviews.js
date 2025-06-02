const express = require('express');
const router = express.Router();
const { getFoodReviews } = require('../controllers/foodReviewController');

router.get('/', getFoodReviews);

module.exports = router; 