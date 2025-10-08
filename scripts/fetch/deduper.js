/**
 * Deduplication module
 * Removes duplicate products and keeps the best deal
 */

/**
 * Calculate similarity between two strings using Levenshtein distance
 */
function calculateSimilarity(str1, str2) {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  const costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) {
      costs[s2.length] = lastValue;
    }
  }
  
  const maxLength = Math.max(s1.length, s2.length);
  return maxLength === 0 ? 1 : 1 - costs[s2.length] / maxLength;
}

/**
 * Check if two products are duplicates
 */
function areDuplicates(product1, product2, threshold = 0.85) {
  // Exact ID match
  if (product1.id === product2.id) {
    return true;
  }
  
  // Same brand and category with similar titles
  if (product1.brand === product2.brand && product1.category === product2.category) {
    const similarity = calculateSimilarity(product1.title, product2.title);
    if (similarity >= threshold) {
      return true;
    }
  }
  
  // Very similar titles regardless of brand
  const titleSimilarity = calculateSimilarity(product1.title, product2.title);
  if (titleSimilarity >= 0.95) {
    return true;
  }
  
  return false;
}

/**
 * Select the best product from a group of duplicates
 * Prioritizes: highest discount > lowest price > most reviews
 */
function selectBestProduct(products) {
  if (products.length === 1) {
    return products[0];
  }
  
  return products.reduce((best, current) => {
    // Prefer higher discount
    if (current.discount_pct > best.discount_pct) {
      return current;
    }
    if (current.discount_pct < best.discount_pct) {
      return best;
    }
    
    // If discount is same, prefer lower price
    if (current.price_current < best.price_current) {
      return current;
    }
    if (current.price_current > best.price_current) {
      return best;
    }
    
    // If price is same, prefer more reviews
    const currentReviews = current.reviews_count || 0;
    const bestReviews = best.reviews_count || 0;
    if (currentReviews > bestReviews) {
      return current;
    }
    
    return best;
  });
}

/**
 * Deduplicate products
 */
export function deduplicateProducts(products, options = {}) {
  const threshold = options.threshold || 0.85;
  const groups = [];
  const processed = new Set();
  
  console.log(`Deduplicating ${products.length} products...`);
  
  // Group duplicates
  for (let i = 0; i < products.length; i++) {
    if (processed.has(i)) continue;
    
    const group = [products[i]];
    processed.add(i);
    
    for (let j = i + 1; j < products.length; j++) {
      if (processed.has(j)) continue;
      
      if (areDuplicates(products[i], products[j], threshold)) {
        group.push(products[j]);
        processed.add(j);
      }
    }
    
    groups.push(group);
  }
  
  // Select best from each group
  const deduplicated = groups.map(group => selectBestProduct(group));
  
  const duplicatesRemoved = products.length - deduplicated.length;
  if (duplicatesRemoved > 0) {
    console.log(`✓ Removed ${duplicatesRemoved} duplicates`);
    console.log(`  ${deduplicated.length} unique products remaining`);
  } else {
    console.log(`✓ No duplicates found`);
  }
  
  return deduplicated;
}

/**
 * Get duplicate groups for analysis
 */
export function findDuplicateGroups(products, threshold = 0.85) {
  const groups = [];
  const processed = new Set();
  
  for (let i = 0; i < products.length; i++) {
    if (processed.has(i)) continue;
    
    const group = [products[i]];
    processed.add(i);
    
    for (let j = i + 1; j < products.length; j++) {
      if (processed.has(j)) continue;
      
      if (areDuplicates(products[i], products[j], threshold)) {
        group.push(products[j]);
        processed.add(j);
      }
    }
    
    if (group.length > 1) {
      groups.push(group);
    }
  }
  
  return groups;
}

/**
 * Sort products by best deals
 */
export function sortByBestDeals(products) {
  return [...products].sort((a, b) => {
    // Primary: discount percentage (descending)
    if (b.discount_pct !== a.discount_pct) {
      return b.discount_pct - a.discount_pct;
    }
    
    // Secondary: price (ascending)
    if (a.price_current !== b.price_current) {
      return a.price_current - b.price_current;
    }
    
    // Tertiary: rating (descending)
    const ratingA = a.rating || 0;
    const ratingB = b.rating || 0;
    return ratingB - ratingA;
  });
}