import { Router } from 'express';
import {
  getAllDesigns,
  getDesignById,
  createDesign,
  updateDesign,
  deleteDesign,
} from '../controllers/designController';
import { authenticateUser, requireAdmin } from '../middleware/auth';
import { validateDesign } from '../middleware/validator';

const router = Router();

// Public routes
router.get('/', getAllDesigns);
router.get('/:id', getDesignById);

// Admin-protected routes
router.post('/', authenticateUser, requireAdmin, validateDesign, createDesign);
router.put('/:id', authenticateUser, requireAdmin, updateDesign);
router.delete('/:id', authenticateUser, requireAdmin, deleteDesign);

export default router;
