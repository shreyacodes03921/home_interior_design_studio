import { Router } from 'express';
import {
  createBooking,
  getUserBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
} from '../controllers/bookingController';
import { authenticateUser, requireAdmin, optionalAuth } from '../middleware/auth';
import { validateBooking } from '../middleware/validator';

const router = Router();

// Allow both logged in users and guests to book a consultation
router.post('/', optionalAuth, validateBooking, createBooking);

// Authenticated user's bookings
router.get('/my-bookings', authenticateUser, getUserBookings);

// Specific booking details
router.get('/:id', authenticateUser, getBookingById);

// Admin-only management
router.get('/', authenticateUser, requireAdmin, getAllBookings);
router.patch('/:id/status', authenticateUser, requireAdmin, updateBookingStatus);

export default router;
