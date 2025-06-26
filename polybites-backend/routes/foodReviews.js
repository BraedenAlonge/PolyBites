import express from 'express';
import { getFoodReviews, getFoodReviewById, createFoodReview, getFoodReviewsByFoodId, getFoodReviewsByRestaurantId, getFoodReviewDetails, getFoodReviewStats, deleteFoodReview, getLike, toggleLike, getReviewLikes } from '../controllers/foodReviewController.js';

const router = express.Router();

// Debug middleware to log all requests
router.use((req, res, next) => {
  console.log('Food Reviews Route:', req.method, req.path, req.params, req.query);
  next();
});

// More specific routes first
router.get('/food-review-details', getFoodReviewDetails);
router.get('/food/:foodId/stats', getFoodReviewStats);
router.get('/food/:foodId', getFoodReviewsByFoodId);
router.get('/restaurant/:restaurantId', getFoodReviewsByRestaurantId);

// Like routes
router.get('/:reviewId/likes', getReviewLikes);
router.post('/:reviewId/toggle-like', toggleLike);
router.get('/:reviewId/like/:userId', getLike);

// Generic routes last
router.get('/', getFoodReviews);
router.post('/', createFoodReview);
router.delete('/:id', deleteFoodReview);
router.get('/:id', getFoodReviewById);

export default router;