import express from 'express';
import { getFoodReviews, getFoodReviewById, createFoodReview } from '../controllers/foodReviewController.js';

const router = express.Router();

router.get('/', getFoodReviews);
router.get('/:id', getFoodReviewById);
router.post('/', createFoodReview);

export default router;