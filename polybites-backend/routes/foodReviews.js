import express from 'express';
import { getFoodReviews } from '../controllers/foodReviewController.js';

const router = express.Router();

router.get('/', getFoodReviews);

export default router;