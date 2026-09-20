import { Request, Response } from 'express';
import { BookingModel, IBooking } from '../models/Booking';
import { ServiceModel } from '../models/Service';
import { AuthRequest } from '../middleware/auth';
import { sendBookingConfirmationEmail } from '../utils/emailService';

export async function createBooking(req: AuthRequest, res: Response): Promise<void> {
  try {
    const {
      serviceId,
      date,
      timeSlot,
      userName,
      userEmail,
      userPhone,
      budget,
      roomDetails,
      notes,
    } = req.body;

    const service = ServiceModel.findById(serviceId);
    const serviceName = service ? service.name : (req.body.serviceName || 'Custom Consultation');

    const newBooking = BookingModel.insertOne({
      userId: req.user ? req.user.id : `guest_${Date.now()}`,
      userName: userName || req.user?.name || 'Valued Client',
      userEmail: userEmail || req.user?.email || '',
      userPhone: userPhone || req.user?.phone || '',
      serviceId,
      serviceName,
      date,
      timeSlot: timeSlot || '14:00 - 15:30',
      status: 'pending',
      budget: budget || '$25,000 - $50,000',
      roomDetails: roomDetails || {},
      notes: notes || '',
      createdAt: new Date().toISOString(),
    });

    // Send automated email confirmation via Nodemailer service
    try {
      await sendBookingConfirmationEmail({
        userName: newBooking.userName,
        userEmail: newBooking.userEmail,
        serviceName: newBooking.serviceName,
        date: newBooking.date,
        timeSlot: newBooking.timeSlot,
        budget: newBooking.budget,
        id: newBooking.id,
      });
    } catch (emailErr) {
      console.warn('[Booking] Email dispatch skipped or encountered non-fatal error:', emailErr);
    }

    res.status(201).json({
      success: true,
      message: 'Consultation booking submitted successfully! A confirmation has been dispatched.',
      booking: newBooking,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to submit booking.' });
  }
}

export async function getUserBookings(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authentication required.' });
      return;
    }

    const bookings = BookingModel.find(b => 
      b.userId === req.user!.id || b.userEmail.toLowerCase() === req.user!.email.toLowerCase()
    );

    // Sort newest first
    bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch bookings.' });
  }
}

export async function getAllBookings(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { status, search } = req.query;
    let bookings = BookingModel.find();

    if (status && typeof status === 'string' && status !== 'all') {
      bookings = bookings.filter(b => b.status === status);
    }

    if (search && typeof search === 'string' && search.trim()) {
      const q = search.toLowerCase();
      bookings = bookings.filter(b => 
        b.userName.toLowerCase().includes(q) ||
        b.userEmail.toLowerCase().includes(q) ||
        b.serviceName.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q)
      );
    }

    bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch all bookings.' });
  }
}

export async function getBookingById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const booking = BookingModel.findById(id);

    if (!booking) {
      res.status(404).json({ success: false, error: 'Booking not found.' });
      return;
    }

    // Check ownership or admin
    if (req.user?.role !== 'admin' && booking.userId !== req.user?.id && booking.userEmail !== req.user?.email) {
      res.status(403).json({ success: false, error: 'Access denied.' });
      return;
    }

    res.json({ success: true, booking });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch booking details.' });
  }
}

export async function updateBookingStatus(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { status, designerNotes } = req.body;

    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      res.status(400).json({ success: false, error: `Status must be one of: ${validStatuses.join(', ')}` });
      return;
    }

    const updated = BookingModel.findByIdAndUpdate(id, {
      ...(status ? { status } : {}),
      ...(designerNotes !== undefined ? { designerNotes } : {}),
    });

    if (!updated) {
      res.status(404).json({ success: false, error: 'Booking not found.' });
      return;
    }

    res.json({
      success: true,
      message: `Booking #${id} status updated to ${updated.status}.`,
      booking: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update booking status.' });
  }
}
