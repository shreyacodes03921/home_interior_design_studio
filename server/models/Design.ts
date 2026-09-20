import { db } from '../config/db';
import { initialDesigns } from '../seed/seedData';

export interface IDesign {
  id: string;
  title: string;
  category: string;
  roomType: 'living-room' | 'bedroom' | 'kitchen' | 'office' | 'bathroom' | 'dining-room' | string;
  style: string;
  images: string[];
  description: string;
  tags: string[];
  designerId: string;
  designerName: string;
  areaSqFt?: number;
  yearCompleted?: number;
  budgetRange?: string;
  featured?: boolean;
  viewCount?: number;
  palette?: string[];
  materials?: string[];
  createdAt: string;
  updatedAt?: string;
}

export const DesignModel = db.initCollection<IDesign>('designs', initialDesigns as IDesign[]);
