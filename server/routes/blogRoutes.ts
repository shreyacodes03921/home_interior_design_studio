import { Router } from 'express';
import {
  getAllBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/blogController';
import { authenticateUser, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', getAllBlogs);
router.get('/:slug', getBlogBySlug);

router.post('/', authenticateUser, requireAdmin, createBlog);
router.put('/:id', authenticateUser, requireAdmin, updateBlog);
router.delete('/:id', authenticateUser, requireAdmin, deleteBlog);

export default router;
