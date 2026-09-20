import { Request, Response } from 'express';
import { ReviewModel, IReview } from '../models/Review';
import { BookingModel } from '../models/Booking';
import { AuthRequest } from '../middleware/auth';

export async function getReviewsForTarget(req: Request, res: Response): Promise<void> {
  try {
    const { targetType, targetId } = req.params;
    let reviews = ReviewModel.find();

    if (targetType && targetId) {
      reviews = reviews.filter(r => r.targetType === targetType && r.targetId === targetId);
    }

    // Calculate average rating
    const avgRating = reviews.length > 0
      ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1))
      : 5.0;

    res.json({
      success: true,
      count: reviews.length,
      averageRating: avgRating,
      reviews,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch reviews.' });
  }
}

export async function getAllReviews(req: Request, res: Response): Promise<void> {
  try {
    const reviews = ReviewModel.find();
    reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch reviews.' });
  }
}

export async function createReview(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authentication required to post a review.' });
      return;
    }

    const { targetType, targetId, rating, comment } = req.body;

    // Check if user has a booking with us to grant verified status
    const hasBooking = BookingModel.findOne(b => 
      b.userId === req.user!.id || b.userEmail.toLowerCase() === req.user!.email.toLowerCase()
    );

    const newReview = ReviewModel.insertOne({
      userId: req.user.id,
      userName: req.user.name,
      userAvatar: req.user.avatar,
      targetType: targetType as 'design' | 'service',
      targetId,
      rating: Number(rating),
      comment: comment.trim(),
      verifiedBooking: Boolean(hasBooking),
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      message: 'Review posted successfully. Thank you for your feedback!',
      review: newReview,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to submit review.' });
  }
}
