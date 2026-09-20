import { Router } from 'express';
import {
  getReviewsForTarget,
  getAllReviews,
  createReview,
} from '../controllers/reviewController';
import { authenticateUser } from '../middleware/auth';
import { validateReview } from '../middleware/validator';

const router = Router();

router.get('/', getAllReviews);
router.get('/:targetType/:targetId', getReviewsForTarget);
router.post('/', authenticateUser, validateReview, createReview);

export default router;
