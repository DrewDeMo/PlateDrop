import { randomInt, randomUUID } from 'crypto';

/**
 * Mock data generator for testing the pipeline
 * Generates realistic product data without external API calls
 */

const brands = [
  'Rogue Fitness',
  'REP Fitness',
  'Titan Fitness',
  'PowerBlock',
  'Bowflex',
  'Concept2',
  'Assault Fitness',
  'CAP Barbell',
  'Ironmaster',
  'Fringe Sport'
];

const categories = [
  { name: 'barbells', products: ['Olympic Barbell', 'Power Bar', 'Deadlift Bar', 'Training Bar'] },
  { name: 'racks', products: ['Power Rack', 'Squat Stand', 'Half Rack', 'Folding Rack'] },
  { name: 'dumbbells', products: ['Adjustable Dumbbells', 'Hex Dumbbells', 'Rubber Dumbbells'] },
  { name: 'plates', products: ['Bumper Plates', 'Iron Plates', 'Change Plates', 'Competition Plates'] },
  { name: 'cardio', products: ['Rowing Machine', 'Air Bike', 'Treadmill', 'Ski Erg'] },
  { name: 'benches', products: ['Adjustable Bench', 'Flat Bench', 'Decline Bench', 'FID Bench'] },
  { name: 'accessories', products: ['Resistance Bands', 'Pull-up Bar', 'Dip Station', 'Landmine'] }
];

const retailers = ['Rogue Fitness', 'REP Fitness', 'Amazon', 'Titan Fitness'];

/**
 * Generate a random price within a range
 */
function generatePrice(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

/**
 * Generate a realistic discount percentage
 */
function generateDiscount() {
  const discounts = [5, 10, 15, 20, 25, 30];
  return discounts[randomInt(0, discounts.length)];
}

/**
 * Generate a product slug
 */
function generateSlug(brand, product) {
  return `${brand.toLowerCase().replace(/\s+/g, '-')}-${product.toLowerCase().replace(/\s+/g, '-')}-${randomUUID().slice(0, 8)}`;
}

/**
 * Generate mock product data
 */
export function generateMockProducts(count = 15) {
  const products = [];
  
  for (let i = 0; i < count; i++) {
    const category = categories[randomInt(0, categories.length)];
    const product = category.products[randomInt(0, category.products.length)];
    const brand = brands[randomInt(0, brands.length)];
    const retailer = retailers[randomInt(0, retailers.length)];
    
    // Generate prices
    const priceRanges = {
      barbells: [200, 500],
      racks: [400, 1200],
      dumbbells: [200, 600],
      plates: [100, 400],
      cardio: [500, 2000],
      benches: [150, 500],
      accessories: [20, 150]
    };
    
    const [min, max] = priceRanges[category.name];
    const pricePrev = generatePrice(min, max);
    const discountPct = generateDiscount();
    const priceCurrent = Math.round(pricePrev * (1 - discountPct / 100) * 100) / 100;
    
    // Generate ratings
    const rating = Math.round((4 + Math.random()) * 10) / 10; // 4.0 - 5.0
    const reviewsCount = randomInt(50, 3000);
    
    // Generate affiliate URL
    const baseUrls = {
      'Rogue Fitness': 'https://www.roguefitness.com',
      'REP Fitness': 'https://www.repfitness.com',
      'Amazon': 'https://www.amazon.com',
      'Titan Fitness': 'https://www.titan.fitness'
    };
    
    const affiliateParams = {
      'Rogue Fitness': '?tag=ROGUE_TAG',
      'REP Fitness': '?tag=REP_TAG',
      'Amazon': '?tag=AMAZON_TAG',
      'Titan Fitness': '?tag=TITAN_TAG'
    };
    
    const slug = generateSlug(brand, product);
    const url = `${baseUrls[retailer]}/products/${slug}${affiliateParams[retailer]}`;
    
    products.push({
      id: slug,
      title: `${brand} ${product}`,
      brand: brand,
      category: category.name,
      url: url,
      image_url: `https://placehold.co/600x400/2563eb/ffffff?text=${encodeURIComponent(product)}`,
      price_current: priceCurrent,
      price_prev: pricePrev,
      discount_pct: discountPct,
      rating: rating,
      reviews_count: reviewsCount,
      retailer: retailer,
      last_seen_utc: new Date().toISOString(),
      source_url: `${baseUrls[retailer]}/deals`
    });
  }
  
  return products;
}

/**
 * Main function for CLI usage
 */
export async function fetchMockData(config = {}) {
  const count = config.product_count || 15;
  
  console.log(`Generating ${count} mock products...`);
  const products = generateMockProducts(count);
  
  console.log(`✓ Generated ${products.length} mock products`);
  return products;
}

// Allow running as a script
if (import.meta.url === `file://${process.argv[1]}`) {
  const products = await fetchMockData({ product_count: 15 });
  console.log(JSON.stringify(products, null, 2));
}