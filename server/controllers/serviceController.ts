import { Request, Response } from 'express';
import { ServiceModel, IService } from '../models/Service';
import { AuthRequest } from '../middleware/auth';

export async function getAllServices(req: Request, res: Response): Promise<void> {
  try {
    const services = ServiceModel.find();
    res.json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch services.' });
  }
}

export async function getServiceById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const service = ServiceModel.findById(id);

    if (!service) {
      res.status(404).json({ success: false, error: 'Service package not found.' });
      return;
    }

    res.json({ success: true, service });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch service.' });
  }
}

export async function createService(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { name, tier, description, priceRange, category, deliverables, duration, popular } = req.body;
    
    if (!name || !priceRange || !category) {
      res.status(400).json({ success: false, error: 'Name, priceRange, and category are required.' });
      return;
    }

    const newService = ServiceModel.insertOne({
      name: name.trim(),
      tier: tier || 'Custom',
      description: description || '',
      priceRange: priceRange.trim(),
      category: category.trim(),
      deliverables: Array.isArray(deliverables) ? deliverables : (typeof deliverables === 'string' ? deliverables.split('\n').filter(Boolean) : []),
      duration: duration || '3-4 Weeks',
      popular: Boolean(popular),
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      message: 'Service package created successfully.',
      service: newService,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to create service.' });
  }
}

export async function updateService(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const updated = ServiceModel.findByIdAndUpdate(id, req.body);

    if (!updated) {
      res.status(404).json({ success: false, error: 'Service package not found.' });
      return;
    }

    res.json({
      success: true,
      message: 'Service package updated successfully.',
      service: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update service.' });
  }
}

export async function deleteService(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const deleted = ServiceModel.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ success: false, error: 'Service package not found.' });
      return;
    }

    res.json({ success: true, message: 'Service package deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to delete service.' });
  }
}
