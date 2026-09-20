import { Request, Response } from 'express';
import { DesignModel, IDesign } from '../models/Design';
import { AuthRequest } from '../middleware/auth';

export async function getAllDesigns(req: Request, res: Response): Promise<void> {
  try {
    const { roomType, category, style, search, featured, sort } = req.query;

    let designs = DesignModel.find();

    // Filter by roomType
    if (roomType && typeof roomType === 'string' && roomType !== 'all') {
      const normalizedRoom = roomType.toLowerCase().replace(/\s+/g, '-');
      designs = designs.filter(d => 
        (d.roomType && d.roomType.toLowerCase() === normalizedRoom) ||
        d.category.toLowerCase().includes(roomType.toLowerCase())
      );
    }

    // Filter by category
    if (category && typeof category === 'string' && category !== 'all') {
      designs = designs.filter(d => d.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by style
    if (style && typeof style === 'string' && style !== 'all') {
      designs = designs.filter(d => d.style.toLowerCase().includes(style.toLowerCase()));
    }

    // Filter by featured
    if (featured === 'true') {
      designs = designs.filter(d => d.featured === true);
    }

    // Search query
    if (search && typeof search === 'string' && search.trim()) {
      const q = search.toLowerCase().trim();
      designs = designs.filter(d => 
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.tags.some(tag => tag.toLowerCase().includes(q)) ||
        d.style.toLowerCase().includes(q) ||
        (d.materials && d.materials.some(m => m.toLowerCase().includes(q)))
      );
    }

    // Sorting
    if (sort === 'views') {
      designs.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
    } else if (sort === 'title') {
      designs.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // Default: newest first
      designs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    res.json({
      success: true,
      count: designs.length,
      designs,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch designs.' });
  }
}

export async function getDesignById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const design = DesignModel.findById(id);

    if (!design) {
      res.status(404).json({ success: false, error: 'Design portfolio project not found.' });
      return;
    }

    // Increment view count
    DesignModel.findByIdAndUpdate(id, {
      viewCount: (design.viewCount || 0) + 1
    });

    res.json({
      success: true,
      design: {
        ...design,
        viewCount: (design.viewCount || 0) + 1
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch design details.' });
  }
}

export async function createDesign(req: AuthRequest, res: Response): Promise<void> {
  try {
    const {
      title,
      category,
      roomType,
      style,
      images,
      description,
      tags,
      areaSqFt,
      yearCompleted,
      budgetRange,
      palette,
      materials,
      featured,
    } = req.body;

    const newDesign = DesignModel.insertOne({
      title: title.trim(),
      category: category.trim(),
      roomType: roomType || category.toLowerCase().replace(/\s+/g, '-'),
      style: style.trim(),
      images: Array.isArray(images) ? images : [images],
      description: description || '',
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : []),
      designerId: req.user?.id || 'admin',
      designerName: req.user?.name || 'Eleanor Vance',
      areaSqFt: Number(areaSqFt) || undefined,
      yearCompleted: Number(yearCompleted) || new Date().getFullYear(),
      budgetRange: budgetRange || '$30,000 - $50,000',
      featured: Boolean(featured),
      viewCount: 0,
      palette: Array.isArray(palette) ? palette : ['#EFECE6', '#C7B299', '#8C7A6B', '#2C2B29'],
      materials: Array.isArray(materials) ? materials : ['Natural Wood', 'Stone', 'Linen'],
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      message: 'Portfolio design created successfully.',
      design: newDesign,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to create design.' });
  }
}

export async function updateDesign(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const existing = DesignModel.findById(id);

    if (!existing) {
      res.status(404).json({ success: false, error: 'Design not found.' });
      return;
    }

    const updated = DesignModel.findByIdAndUpdate(id, req.body);

    res.json({
      success: true,
      message: 'Design updated successfully.',
      design: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update design.' });
  }
}

export async function deleteDesign(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const deleted = DesignModel.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ success: false, error: 'Design not found.' });
      return;
    }

    res.json({
      success: true,
      message: 'Design deleted successfully.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to delete design.' });
  }
}
