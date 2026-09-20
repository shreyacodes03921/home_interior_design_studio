import { Router } from 'express';
import {
  register,
  login,
  googleAuth,
  resetPasswordRequest,
  completeResetPassword,
  getMe,
  updateProfile,
  toggleWishlist,
} from '../controllers/authController';
import { authenticateUser } from '../middleware/auth';
import { validateRegister, validateLogin } from '../middleware/validator';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/google', googleAuth);
router.post('/reset-password-request', resetPasswordRequest);
router.post('/reset-password-complete', completeResetPassword);

// Protected user routes
router.get('/me', authenticateUser, getMe);
router.put('/profile', authenticateUser, updateProfile);
router.post('/wishlist', authenticateUser, toggleWishlist);

export default router;
