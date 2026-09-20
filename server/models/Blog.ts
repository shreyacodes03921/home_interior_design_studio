import { db } from '../config/db';
import { initialBlogs } from '../seed/seedData';

export interface IBlog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedDate: string;
  tags: string[];
  readTimeMinutes: number;
  createdAt: string;
  updatedAt?: string;
}

export const BlogModel = db.initCollection<IBlog>('blogs', initialBlogs.map(b => ({
  ...b,
  createdAt: new Date(b.publishedDate).toISOString()
})) as IBlog[]);
