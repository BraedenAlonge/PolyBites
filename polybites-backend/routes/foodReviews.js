import express from 'express';
import { getFoodReviews } from '../controllers/foodReviewController.js';

const router = express.Router();
const { getFoodReviews, createFoodReview } = require('../controllers/foodReviewController');

router.get('/', getFoodReviews);
router.post('/', createFoodReview);

export default router;