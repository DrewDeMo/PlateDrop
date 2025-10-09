import { readFile } from 'node:fs/promises';

export interface DealProduct {
  id: string;
  title: string;
  brand: string;
  category: string;
  url: string;
  image_url?: string;
  price_current: number;
  price_prev?: number;
  discount_pct: number;
  rating?: number;
  reviews_count?: number;
  retailer: string;
  [key: string]: unknown;
}

interface DealsFile {
  generated_at?: string;
  product_count?: number;
  retailers?: string[];
  products: DealProduct[];
}

const CATEGORY_IMAGE_MAP: Record<string, string> = {
  cardio: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop&q=80',
  racks: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop&q=80',
  dumbbells: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop&q=80',
  barbells: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop&q=80',
  benches: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop&q=80',
  plates: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop&q=80',
  accessories: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop&q=80'
};

export function getCategoryImage(category?: string): string {
  return CATEGORY_IMAGE_MAP[category ?? ''] ?? CATEGORY_IMAGE_MAP.cardio;
}

function resolveDealsFileUrl(): URL {
  return new URL('../../../data/deals-today.json', import.meta.url);
}

export async function loadHomepageDeals(limit = 6): Promise<{ deals: DealProduct[]; generatedAt: string | null }> {
  try {
    const fileUrl = resolveDealsFileUrl();
    const fileContent = await readFile(fileUrl, 'utf-8');
    const dealsData = JSON.parse(fileContent) as DealsFile;

    const sortedDeals = [...(dealsData.products ?? [])]
      .sort((a, b) => (b.discount_pct ?? 0) - (a.discount_pct ?? 0))
      .slice(0, limit)
      .map(product => ({
        ...product,
        image_url: product.image_url ?? getCategoryImage(product.category)
      }));

    return {
      deals: sortedDeals,
      generatedAt: dealsData.generated_at ?? null
    };
  } catch (error) {
    console.error('Error loading deals data:', error);
    return { deals: [], generatedAt: null };
  }
}

export function buildItemListSchema(deals: DealProduct[]) {
  if (!deals.length) {
    return null;
  }

  const priceValidUntil = new Date(Date.now() + 86_400_000).toISOString().split('T')[0];

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: deals.map((deal, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: deal.title,
        description: `${deal.title} - ${Math.round(deal.discount_pct)}% off`,
        image: deal.image_url ?? getCategoryImage(deal.category),
        offers: {
          '@type': 'Offer',
          price: deal.price_current,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: deal.url,
          priceValidUntil
        }
      }
    }))
  };
}
