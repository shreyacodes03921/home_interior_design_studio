import { db } from '../config/db';
import { initialReviews } from '../seed/seedData';

export interface IReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  targetType: 'design' | 'service';
  targetId: string;
  rating: number; // 1 to 5
  comment: string;
  verifiedBooking?: boolean;
  createdAt: string;
}

export const ReviewModel = db.initCollection<IReview>('reviews', initialReviews as IReview[]);
