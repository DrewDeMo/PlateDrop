import type { APIContext } from 'astro';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

export async function GET(context: APIContext) {
  const siteUrl = context.site?.toString() || 'https://platedrop.fit';
  
  // Define static pages
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'daily' }, // Homepage
    { url: 'about', priority: '0.8', changefreq: 'monthly' },
    { url: 'contact', priority: '0.7', changefreq: 'monthly' },
    { url: 'faq', priority: '0.8', changefreq: 'monthly' },
    { url: 'guides', priority: '0.9', changefreq: 'weekly' },
    { url: 'privacy-policy', priority: '0.5', changefreq: 'yearly' },
    { url: 'terms', priority: '0.5', changefreq: 'yearly' },
    { url: 'affiliate-disclosure', priority: '0.5', changefreq: 'yearly' },
    { url: 'editorial-policy', priority: '0.6', changefreq: 'yearly' },
  ];

  // Get guide pages dynamically
  const guidePages: Array<{ url: string; priority: string; changefreq: string }> = [];
  try {
    const guidesDir = join(process.cwd(), 'src', 'pages', 'guides');
    const files = await readdir(guidesDir);
    
    for (const file of files) {
      if (file.endsWith('.md') || (file.endsWith('.astro') && file !== 'index.astro')) {
        const slug = file.replace(/\.(md|astro)$/, '');
        guidePages.push({
          url: `guides/${slug}`,
          priority: '0.9',
          changefreq: 'monthly'
        });
      }
    }
  } catch (error) {
    console.error('Error reading guides directory:', error);
  }

  // Combine all pages
  const allPages = [...staticPages, ...guidePages];

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${allPages.map(page => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}