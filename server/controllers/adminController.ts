import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { DesignModel } from '../models/Design';
import { BookingModel } from '../models/Booking';
import { ServiceModel } from '../models/Service';
import { InquiryModel } from '../models/Inquiry';
import { BlogModel } from '../models/Blog';
import { AuthRequest } from '../middleware/auth';
import { getSentEmailLogs } from '../utils/emailService';

export async function getAnalytics(req: AuthRequest, res: Response): Promise<void> {
  try {
    const totalUsers = UserModel.count();
    const totalDesigns = DesignModel.count();
    const totalBookings = BookingModel.count();
    const totalInquiries = InquiryModel.count();
    const totalBlogs = BlogModel.count();

    const bookings = BookingModel.find();
    const designs = DesignModel.find();

    // Category distribution from designs & bookings
    const categoryCounts: Record<string, number> = {};
    designs.forEach(d => {
      categoryCounts[d.category] = (categoryCounts[d.category] || 0) + 1;
    });

    // Style popularity from design views
    const styleViews: Record<string, number> = {};
    designs.forEach(d => {
      styleViews[d.style] = (styleViews[d.style] || 0) + (d.viewCount || 0);
    });

    // Status breakdown for bookings
    const bookingStatusCounts = {
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
    };

    // Estimated revenue from confirmed/completed bookings
    const estimatedPipeline = bookings.reduce((sum, b) => {
      if (b.status === 'cancelled') return sum;
      // Extract rough value from budget or assign standard
      if (b.budget?.includes('120,000') || b.budget?.includes('80,000')) return sum + 100000;
      if (b.budget?.includes('75,000') || b.budget?.includes('50,000')) return sum + 62500;
      if (b.budget?.includes('40,000') || b.budget?.includes('35,000')) return sum + 40000;
      return sum + 25000;
    }, 0);

    // Recent activity logs
    const recentBookings = [...bookings].slice(0, 5);
    const recentEmails = getSentEmailLogs().slice(0, 5);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalDesigns,
        totalBookings,
        totalInquiries,
        totalBlogs,
        estimatedPipeline,
        bookingStatusCounts,
        categoryCounts,
        styleViews,
      },
      recentBookings,
      recentEmails,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to generate analytics.' });
  }
}

export async function getAllUsers(req: AuthRequest, res: Response): Promise<void> {
  try {
    const users = UserModel.find().map(u => {
      const { passwordHash: _, ...safe } = u;
      return safe;
    });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch users.' });
  }
}

export async function updateUserStatus(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { status, role } = req.body;

    // Prevent deactivating own admin account
    if (req.user?.id === id && status === 'deactivated') {
      res.status(400).json({ success: false, error: 'You cannot deactivate your own administrative account.' });
      return;
    }

    const updated = UserModel.findByIdAndUpdate(id, {
      ...(status ? { status } : {}),
      ...(role ? { role } : {}),
    });

    if (!updated) {
      res.status(404).json({ success: false, error: 'User not found.' });
      return;
    }

    const { passwordHash: _, ...safeUser } = updated;
    res.json({
      success: true,
      message: `User ${updated.name} updated.`,
      user: safeUser,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update user status.' });
  }
}
