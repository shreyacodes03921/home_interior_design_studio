import { db } from '../config/db';
import { initialBookings } from '../seed/seedData';

export interface IBooking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  serviceId: string;
  serviceName: string;
  date: string;
  timeSlot?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  designerNotes?: string;
  budget?: string;
  roomDetails?: {
    roomType?: string;
    approxSqFt?: number;
    propertyAddress?: string;
    timeline?: string;
    stylePreference?: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export const BookingModel = db.initCollection<IBooking>('bookings', initialBookings as IBooking[]);
