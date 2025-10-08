#!/usr/bin/env node

/**
 * Main data fetching orchestrator
 * Coordinates fetching from all enabled retailers, normalizes, deduplicates, and saves data
 */

import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { fetchMockData } from './retailers/mock.js';
import { normalizeProducts, filterValidProducts } from './normalizer.js';
import { deduplicateProducts, sortByBestDeals } from './deduper.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '../..');

/**
 * Load retailer configuration
 */
async function loadRetailerConfig() {
  const configPath = join(PROJECT_ROOT, 'data/retailers.json');
  const content = await readFile(configPath, 'utf-8');
  return JSON.parse(content);
}

/**
 * Fetch data from a single retailer
 */
async function fetchFromRetailer(retailer) {
  console.log(`\nFetching from ${retailer.name}...`);
  
  try {
    let products = [];
    
    switch (retailer.type || retailer.id) {
      case 'mock':
        products = await fetchMockData(retailer);
        break;
      
      // Future retailers can be added here
      // case 'rogue':
      //   products = await fetchRogueData(retailer);
      //   break;
      
      default:
        console.warn(`⚠ Unknown retailer type: ${retailer.type || retailer.id}`);
        return [];
    }
    
    console.log(`✓ Fetched ${products.length} products from ${retailer.name}`);
    return products;
    
  } catch (error) {
    console.error(`✗ Error fetching from ${retailer.name}:`, error.message);
    return [];
  }
}

/**
 * Main fetch process
 */
async function main() {
  console.log('='.repeat(60));
  console.log('PlateDrop Data Fetcher');
  console.log('='.repeat(60));
  
  try {
    // Load configuration
    console.log('\n📋 Loading retailer configuration...');
    const config = await loadRetailerConfig();
    const enabledRetailers = config.retailers.filter(r => r.enabled);
    
    console.log(`✓ Found ${enabledRetailers.length} enabled retailers`);
    enabledRetailers.forEach(r => console.log(`  - ${r.name}`));
    
    // Fetch from all retailers
    console.log('\n📦 Fetching product data...');
    const allProducts = [];
    
    for (const retailer of enabledRetailers) {
      const products = await fetchFromRetailer(retailer);
      
      // Normalize products
      if (products.length > 0) {
        const normalized = normalizeProducts(products, retailer.id);
        allProducts.push(...normalized);
      }
      
      // Rate limiting
      if (retailer.rate_limit_ms) {
        await new Promise(resolve => setTimeout(resolve, retailer.rate_limit_ms));
      }
    }
    
    console.log(`\n✓ Total products fetched: ${allProducts.length}`);
    
    // Validate products
    console.log('\n🔍 Validating products...');
    const validProducts = filterValidProducts(allProducts);
    console.log(`✓ ${validProducts.length} valid products`);
    
    // Deduplicate
    console.log('\n🔄 Deduplicating products...');
    const uniqueProducts = deduplicateProducts(validProducts);
    
    // Sort by best deals
    console.log('\n📊 Sorting by best deals...');
    const sortedProducts = sortByBestDeals(uniqueProducts);
    console.log(`✓ Sorted ${sortedProducts.length} products`);
    
    // Save to file
    console.log('\n💾 Saving data...');
    const outputPath = join(PROJECT_ROOT, 'data/deals-today.json');
    const output = {
      generated_at: new Date().toISOString(),
      product_count: sortedProducts.length,
      retailers: enabledRetailers.map(r => r.id),
      products: sortedProducts
    };
    
    await writeFile(outputPath, JSON.stringify(output, null, 2));
    console.log(`✓ Saved to ${outputPath}`);
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('Summary:');
    console.log(`  Total fetched: ${allProducts.length}`);
    console.log(`  Valid: ${validProducts.length}`);
    console.log(`  Unique: ${uniqueProducts.length}`);
    console.log(`  Top discount: ${sortedProducts[0]?.discount_pct.toFixed(1)}%`);
    console.log('='.repeat(60));
    
    // Show top 5 deals
    console.log('\n🏆 Top 5 Deals:');
    sortedProducts.slice(0, 5).forEach((product, i) => {
      console.log(`  ${i + 1}. ${product.title}`);
      console.log(`     $${product.price_current} (${product.discount_pct.toFixed(1)}% off) - ${product.retailer}`);
    });
    
    console.log('\n✅ Fetch complete!\n');
    
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as fetchData };