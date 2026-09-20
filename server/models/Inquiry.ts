import { db } from '../config/db';
import { initialInquiries } from '../seed/seedData';

export interface IInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'contacted' | 'resolved';
  createdAt: string;
  updatedAt?: string;
}

export const InquiryModel = db.initCollection<IInquiry>('inquiries', initialInquiries as IInquiry[]);
