import { Request, Response, NextFunction } from 'express';

export function validateRegister(req: Request, res: Response, next: NextFunction): void {
  const { name, email, password } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    res.status(400).json({ success: false, error: 'Name must be at least 2 characters long.' });
    return;
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ success: false, error: 'Please provide a valid email address.' });
    return;
  }
  if (!password || password.length < 6) {
    res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
    return;
  }
  next();
}

export function validateLogin(req: Request, res: Response, next: NextFunction): void {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ success: false, error: 'Email and password are required.' });
    return;
  }
  next();
}

export function validateBooking(req: Request, res: Response, next: NextFunction): void {
  const { serviceId, date, userName, userEmail } = req.body;
  if (!serviceId) {
    res.status(400).json({ success: false, error: 'Service selection is required.' });
    return;
  }
  if (!date) {
    res.status(400).json({ success: false, error: 'Consultation date is required.' });
    return;
  }
  if (!userName || !userEmail) {
    res.status(400).json({ success: false, error: 'Name and email are required for booking.' });
    return;
  }
  next();
}

export function validateDesign(req: Request, res: Response, next: NextFunction): void {
  const { title, category, roomType, style, images } = req.body;
  if (!title || !category || !roomType || !style) {
    res.status(400).json({ success: false, error: 'Title, category, roomType, and style are required.' });
    return;
  }
  if (!images || !Array.isArray(images) || images.length === 0) {
    res.status(400).json({ success: false, error: 'At least one design image is required.' });
    return;
  }
  next();
}

export function validateReview(req: Request, res: Response, next: NextFunction): void {
  const { targetId, targetType, rating, comment } = req.body;
  if (!targetId || !targetType || !rating || !comment) {
    res.status(400).json({ success: false, error: 'targetId, targetType, rating, and comment are required.' });
    return;
  }
  if (rating < 1 || rating > 5) {
    res.status(400).json({ success: false, error: 'Rating must be between 1 and 5 stars.' });
    return;
  }
  next();
}
