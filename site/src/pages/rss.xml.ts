import rss from '@astrojs/rss';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function GET(context: any) {
  const siteUrl = 'https://platedrop.fit';
  
  // Load today's deals
  let deals: any[] = [];
  try {
    const dealsPath = join(process.cwd(), '..', 'data', 'deals-today.json');
    const fileContent = await readFile(dealsPath, 'utf-8');
    const dealsData = JSON.parse(fileContent);
    deals = dealsData.products || [];
  } catch (error) {
    console.error('Error loading deals for RSS:', error);
  }

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Create RSS items - one for today's deals collection
  const items = [];
  
  if (deals.length > 0) {
    // Create a summary of today's deals
    const topDeals = deals
      .sort((a: any, b: any) => b.discount_pct - a.discount_pct)
      .slice(0, 10);
    
    const dealsList = topDeals.map((deal: any) =>
      `• ${deal.name} - ${deal.discount_pct}% off (${deal.current_price})`
    ).join('\n');

    items.push({
      title: `PlateDrop Daily Deals - ${formattedDate}`,
      link: `${siteUrl}`,
      description: `Today's top home gym equipment deals:\n\n${dealsList}\n\nVisit PlateDrop for full details and more deals.`,
      pubDate: today,
      guid: `${siteUrl}deals/${today.toISOString().split('T')[0]}`,
    });
  } else {
    // Add a placeholder item when no deals are available
    items.push({
      title: `PlateDrop Daily Deals - ${formattedDate}`,
      link: `${siteUrl}`,
      description: `No deals available yet. Our automated system runs daily at 2 AM UTC to fetch the latest deals. Check back soon for the best home gym equipment deals!`,
      pubDate: today,
      guid: `${siteUrl}deals/${today.toISOString().split('T')[0]}`,
    });
  }

  return rss({
    title: 'PlateDrop - Daily Home Gym Deals',
    description: 'Daily curated deals on home gym equipment including power racks, barbells, dumbbells, and cardio machines. Updated every 24 hours.',
    site: siteUrl,
    items: items,
    customData: `<language>en-us</language>
    <lastBuildDate>${today.toUTCString()}</lastBuildDate>
    <ttl>1440</ttl>`,
    stylesheet: '/rss-styles.xsl',
  });
}