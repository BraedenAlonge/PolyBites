import express from 'express';
import { getFoodReviews, getFoodReviewById, createFoodReview, getFoodReviewsByFoodId, getFoodReviewsByRestaurantId, getFoodReviewDetails, getFoodReviewStats } from '../controllers/foodReviewController.js';

const router = express.Router();

router.get('/', getFoodReviews);
router.get('/food-review-details', getFoodReviewDetails);
router.get('/food/:foodId', getFoodReviewsByFoodId);
router.get('/food/:foodId/stats', getFoodReviewStats);
router.get('/restaurant/:restaurantId', getFoodReviewsByRestaurantId);
router.get('/:id', getFoodReviewById);
router.post('/', createFoodReview);

export default router;