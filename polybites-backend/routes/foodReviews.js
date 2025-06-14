import express from 'express';
import { getFoodReviews, getFoodReviewById, createFoodReview, getFoodReviewsByFoodId, getFoodReviewsByRestaurantId, getFoodReviewDetails, getFoodReviewStats, deleteFoodReview } from '../controllers/foodReviewController.js';

const router = express.Router();

// More specific routes first
router.get('/food-review-details', getFoodReviewDetails);
router.get('/food/:foodId', getFoodReviewsByFoodId);
router.get('/food/:foodId/stats', getFoodReviewStats);
router.get('/restaurant/:restaurantId', getFoodReviewsByRestaurantId);

// Generic routes last
router.get('/', getFoodReviews);
router.post('/', createFoodReview);
router.delete('/:id', deleteFoodReview);
router.get('/:id', getFoodReviewById);

export default router;