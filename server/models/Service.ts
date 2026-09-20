import { db } from '../config/db';
import { initialServices } from '../seed/seedData';

export interface IService {
  id: string;
  name: string;
  tier: string;
  description: string;
  priceRange: string;
  category: string;
  deliverables: string[];
  duration: string;
  popular?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export const ServiceModel = db.initCollection<IService>('services', initialServices.map(s => ({
  ...s,
  createdAt: '2025-01-01T00:00:00.000Z'
})) as IService[]);
