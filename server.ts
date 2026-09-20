import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import authRoutes from './server/routes/authRoutes';
import designRoutes from './server/routes/designRoutes';
import serviceRoutes from './server/routes/serviceRoutes';
import bookingRoutes from './server/routes/bookingRoutes';
import blogRoutes from './server/routes/blogRoutes';
import reviewRoutes from './server/routes/reviewRoutes';
import inquiryRoutes from './server/routes/inquiryRoutes';
import adminRoutes from './server/routes/adminRoutes';
import { errorHandler } from './server/middleware/errorHandler';
import { DesignModel } from './server/models/Design';
import { BlogModel } from './server/models/Blog';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON and urlencoded requests with generous limits for image uploads
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // Request logger in dev
  app.use((req, res, next) => {
    if (req.url.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.url}`);
    }
    next();
  });

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Atelier Luxe Interior Design Platform API',
      timestamp: new Date().toISOString(),
    });
  });

  // Dynamic SEO: Sitemap.xml
  app.get('/sitemap.xml', (req, res) => {
    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const designs = DesignModel.find();
    const blogs = BlogModel.find();

    const staticUrls = [
      '',
      '/portfolio',
      '/services',
      '/about',
      '/blog',
      '/contact',
      '/booking',
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    staticUrls.forEach(url => {
      xml += `  <url>\n    <loc>${baseUrl}${url}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });

    designs.forEach(d => {
      xml += `  <url>\n    <loc>${baseUrl}/portfolio/${d.id}</loc>\n    <lastmod>${d.createdAt.split('T')[0]}</lastmod>\n    <priority>0.9</priority>\n  </url>\n`;
    });

    blogs.forEach(b => {
      xml += `  <url>\n    <loc>${baseUrl}/blog/${b.slug}</loc>\n    <lastmod>${b.publishedDate}</lastmod>\n    <priority>0.7</priority>\n  </url>\n`;
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });

  // Dynamic SEO: Robots.txt
  app.get('/robots.txt', (req, res) => {
    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const content = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /dashboard\nSitemap: ${baseUrl}/sitemap.xml\n`;
    res.header('Content-Type', 'text/plain');
    res.send(content);
  });

  // Mount API Routers
  app.use('/api/auth', authRoutes);
  app.use('/api/designs', designRoutes);
  app.use('/api/services', serviceRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/blogs', blogRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/inquiries', inquiryRoutes);
  app.use('/api/admin', adminRoutes);

  // Centralized error handler for all /api routes
  app.use('/api', errorHandler);

  // Serve Frontend
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Atelier Luxe] Server running on http://localhost:${PORT}`);
  });
}

startServer();
