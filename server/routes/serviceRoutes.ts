import { Router } from 'express';
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController';
import { authenticateUser, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', getAllServices);
router.get('/:id', getServiceById);

router.post('/', authenticateUser, requireAdmin, createService);
router.put('/:id', authenticateUser, requireAdmin, updateService);
router.delete('/:id', authenticateUser, requireAdmin, deleteService);

export default router;
