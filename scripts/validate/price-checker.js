/**
 * Price Validation Module
 * Ensures all prices in generated content match source data
 */

/**
 * Extract all price mentions from markdown content
 */
export function extractPrices(markdown) {
  const prices = [];
  
  // Match various price formats: $123, $123.45, $1,234.56
  const priceRegex = /\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g;
  
  let match;
  while ((match = priceRegex.exec(markdown)) !== null) {
    const priceStr = match[1].replace(/,/g, '');
    const price = parseFloat(priceStr);
    prices.push({
      raw: match[0],
      value: price,
      position: match.index
    });
  }
  
  return prices;
}

/**
 * Extract prices from product data
 */
export function getExpectedPrices(products) {
  const expected = new Set();
  
  for (const product of products) {
    expected.add(product.price_current);
    if (product.price_prev) {
      expected.add(product.price_prev);
    }
  }
  
  return Array.from(expected);
}

/**
 * Validate prices in content against source data
 */
export function validatePrices(markdown, products, options = {}) {
  const tolerance = options.tolerance || 0.01; // Allow $0.01 rounding difference
  
  const extractedPrices = extractPrices(markdown);
  const expectedPrices = getExpectedPrices(products);
  
  const errors = [];
  const warnings = [];
  
  // Check each extracted price
  for (const extracted of extractedPrices) {
    const isValid = expectedPrices.some(expected => 
      Math.abs(extracted.value - expected) <= tolerance
    );
    
    if (!isValid) {
      errors.push({
        type: 'invalid_price',
        price: extracted.raw,
        value: extracted.value,
        position: extracted.position,
        message: `Price ${extracted.raw} not found in source data`
      });
    }
  }
  
  // Check if all product prices are mentioned
  for (const product of products) {
    const currentPriceFound = extractedPrices.some(p => 
      Math.abs(p.value - product.price_current) <= tolerance
    );
    
    if (!currentPriceFound) {
      warnings.push({
        type: 'missing_price',
        product: product.title,
        price: product.price_current,
        message: `Current price $${product.price_current} for "${product.title}" not found in content`
      });
    }
  }
  
  return {
    valid: errors.length === 0,
    errors: errors,
    warnings: warnings,
    stats: {
      extracted: extractedPrices.length,
      expected: expectedPrices.length,
      errors: errors.length,
      warnings: warnings.length
    }
  };
}

/**
 * Format validation results for display
 */
export function formatValidationResults(results) {
  const lines = [];
  
  if (results.valid) {
    lines.push('✓ All prices validated successfully');
  } else {
    lines.push(`✗ Price validation failed with ${results.errors.length} errors`);
  }
  
  lines.push(`  Extracted: ${results.stats.extracted} prices`);
  lines.push(`  Expected: ${results.stats.expected} prices`);
  
  if (results.errors.length > 0) {
    lines.push('\nErrors:');
    results.errors.forEach(error => {
      lines.push(`  - ${error.message}`);
    });
  }
  
  if (results.warnings.length > 0) {
    lines.push('\nWarnings:');
    results.warnings.forEach(warning => {
      lines.push(`  - ${warning.message}`);
    });
  }
  
  return lines.join('\n');
}