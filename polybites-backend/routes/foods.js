import express from 'express';
import { getFoods, getFoodById } from '../controllers/foodController.js';

const router = express.Router();

router.get('/', getFoods);
router.get('/:id', getFoodById);

export default router;