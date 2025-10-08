/**
 * Data normalization module
 * Converts raw product data from various sources into a standard format
 */

/**
 * Normalize a single product
 */
export function normalizeProduct(rawProduct, retailerId) {
  // Calculate discount percentage if not provided
  let discountPct = rawProduct.discount_pct || 0;
  if (!discountPct && rawProduct.price_prev && rawProduct.price_current) {
    discountPct = ((rawProduct.price_prev - rawProduct.price_current) / rawProduct.price_prev) * 100;
  }
  
  // Generate ID if not provided
  const id = rawProduct.id || generateProductId(rawProduct.title, rawProduct.brand);
  
  // Ensure required fields
  if (!rawProduct.title || !rawProduct.price_current) {
    throw new Error('Product missing required fields: title and price_current');
  }
  
  return {
    id: id,
    title: rawProduct.title.trim(),
    brand: rawProduct.brand?.trim() || 'Unknown',
    category: rawProduct.category?.toLowerCase() || 'general',
    url: rawProduct.url,
    image_url: rawProduct.image_url || null,
    price_current: parseFloat(rawProduct.price_current),
    price_prev: rawProduct.price_prev ? parseFloat(rawProduct.price_prev) : null,
    discount_pct: Math.round(discountPct * 100) / 100,
    rating: rawProduct.rating ? parseFloat(rawProduct.rating) : null,
    reviews_count: rawProduct.reviews_count ? parseInt(rawProduct.reviews_count) : null,
    retailer: retailerId,
    last_seen_utc: rawProduct.last_seen_utc || new Date().toISOString(),
    source_url: rawProduct.source_url || rawProduct.url
  };
}

/**
 * Normalize an array of products
 */
export function normalizeProducts(rawProducts, retailerId) {
  const normalized = [];
  const errors = [];
  
  for (const product of rawProducts) {
    try {
      normalized.push(normalizeProduct(product, retailerId));
    } catch (error) {
      errors.push({
        product: product,
        error: error.message
      });
    }
  }
  
  if (errors.length > 0) {
    console.warn(`⚠ ${errors.length} products failed normalization:`);
    errors.forEach(({ product, error }) => {
      console.warn(`  - ${product.title || 'Unknown'}: ${error}`);
    });
  }
  
  return normalized;
}

/**
 * Generate a stable product ID from title and brand
 */
function generateProductId(title, brand) {
  const text = `${brand || ''}-${title}`.toLowerCase();
  return text
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

/**
 * Validate normalized product data
 */
export function validateNormalizedProduct(product) {
  const errors = [];
  
  // Required fields
  if (!product.id) errors.push('Missing id');
  if (!product.title) errors.push('Missing title');
  if (!product.url) errors.push('Missing url');
  if (typeof product.price_current !== 'number') errors.push('Invalid price_current');
  
  // Price validation
  if (product.price_current <= 0) errors.push('price_current must be positive');
  if (product.price_prev && product.price_prev < product.price_current) {
    errors.push('price_prev cannot be less than price_current');
  }
  
  // Discount validation
  if (product.discount_pct < 0 || product.discount_pct > 100) {
    errors.push('discount_pct must be between 0 and 100');
  }
  
  // Rating validation
  if (product.rating !== null && (product.rating < 0 || product.rating > 5)) {
    errors.push('rating must be between 0 and 5');
  }
  
  // URL validation
  try {
    new URL(product.url);
  } catch {
    errors.push('Invalid URL format');
  }
  
  return {
    valid: errors.length === 0,
    errors: errors
  };
}

/**
 * Filter out invalid products
 */
export function filterValidProducts(products) {
  const valid = [];
  const invalid = [];
  
  for (const product of products) {
    const validation = validateNormalizedProduct(product);
    if (validation.valid) {
      valid.push(product);
    } else {
      invalid.push({
        product: product,
        errors: validation.errors
      });
    }
  }
  
  if (invalid.length > 0) {
    console.warn(`⚠ ${invalid.length} products failed validation:`);
    invalid.forEach(({ product, errors }) => {
      console.warn(`  - ${product.title || product.id}: ${errors.join(', ')}`);
    });
  }
  
  return valid;
}