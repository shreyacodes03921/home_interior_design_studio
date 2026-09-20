import { Request, Response } from 'express';
import { InquiryModel, IInquiry } from '../models/Inquiry';
import { AuthRequest } from '../middleware/auth';

export async function submitInquiry(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
      return;
    }

    const inquiry = InquiryModel.insertOne({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone || '',
      subject: subject || 'General Consultation Inquiry',
      message: message.trim(),
      status: 'new',
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been received. An Atelier Luxe design associate will respond within 24 hours.',
      inquiry,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to submit inquiry.' });
  }
}

export async function getAllInquiries(req: AuthRequest, res: Response): Promise<void> {
  try {
    const inquiries = InquiryModel.find();
    inquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({
      success: true,
      count: inquiries.length,
      inquiries,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch inquiries.' });
  }
}

export async function updateInquiryStatus(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const valid = ['new', 'contacted', 'resolved'];
    if (!valid.includes(status)) {
      res.status(400).json({ success: false, error: 'Invalid status.' });
      return;
    }

    const updated = InquiryModel.findByIdAndUpdate(id, { status });
    if (!updated) {
      res.status(404).json({ success: false, error: 'Inquiry not found.' });
      return;
    }

    res.json({ success: true, inquiry: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update inquiry.' });
  }
}
