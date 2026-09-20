import { Router } from 'express';
import {
  submitInquiry,
  getAllInquiries,
  updateInquiryStatus,
} from '../controllers/inquiryController';
import { authenticateUser, requireAdmin } from '../middleware/auth';

const router = Router();

router.post('/', submitInquiry);
router.get('/', authenticateUser, requireAdmin, getAllInquiries);
router.patch('/:id/status', authenticateUser, requireAdmin, updateInquiryStatus);

export default router;
