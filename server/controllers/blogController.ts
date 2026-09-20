import { Request, Response } from 'express';
import { BlogModel, IBlog } from '../models/Blog';
import { AuthRequest } from '../middleware/auth';

export async function getAllBlogs(req: Request, res: Response): Promise<void> {
  try {
    const { tag, search } = req.query;
    let blogs = BlogModel.find();

    if (tag && typeof tag === 'string' && tag !== 'all') {
      blogs = blogs.filter(b => b.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
    }

    if (search && typeof search === 'string' && search.trim()) {
      const q = search.toLowerCase();
      blogs = blogs.filter(b => 
        b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        b.content.toLowerCase().includes(q)
      );
    }

    // Sort newest published first
    blogs.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());

    res.json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch blog posts.' });
  }
}

export async function getBlogBySlug(req: Request, res: Response): Promise<void> {
  try {
    const { slug } = req.params;
    const blog = BlogModel.findOne(b => b.slug === slug || b.id === slug);

    if (!blog) {
      res.status(404).json({ success: false, error: 'Article not found.' });
      return;
    }

    res.json({ success: true, blog });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch article.' });
  }
}

export async function createBlog(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { title, excerpt, content, coverImage, tags, readTimeMinutes } = req.body;

    if (!title || !content) {
      res.status(400).json({ success: false, error: 'Title and content are required.' });
      return;
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newBlog = BlogModel.insertOne({
      title: title.trim(),
      slug,
      excerpt: excerpt || content.slice(0, 150) + '...',
      content,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
      author: {
        name: req.user?.name || 'Eleanor Vance',
        role: req.user?.title || 'Principal Creative Director',
        avatar: req.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      },
      publishedDate: new Date().toISOString().split('T')[0],
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : ['Design']),
      readTimeMinutes: Number(readTimeMinutes) || 5,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      message: 'Article published successfully.',
      blog: newBlog,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to publish article.' });
  }
}

export async function updateBlog(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const updated = BlogModel.findByIdAndUpdate(id, req.body);

    if (!updated) {
      res.status(404).json({ success: false, error: 'Article not found.' });
      return;
    }

    res.json({
      success: true,
      message: 'Article updated successfully.',
      blog: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update article.' });
  }
}

export async function deleteBlog(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const deleted = BlogModel.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ success: false, error: 'Article not found.' });
      return;
    }

    res.json({ success: true, message: 'Article removed successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to delete article.' });
  }
}
