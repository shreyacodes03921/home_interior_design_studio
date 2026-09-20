import { Router } from 'express';
import {
  getAnalytics,
  getAllUsers,
  updateUserStatus,
} from '../controllers/adminController';
import { authenticateUser, requireAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticateUser);
router.use(requireAdmin);

router.get('/analytics', getAnalytics);
router.get('/users', getAllUsers);
router.patch('/users/:id', updateUserStatus);

export default router;
