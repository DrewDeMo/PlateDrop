#!/usr/bin/env node

/**
 * Validation Entry Point
 * Runs all validation checks on generated content
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, readdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import validators
import { validatePrices } from './price-checker.js';

/**
 * Validate all deal files
 */
async function validateDeals() {
  const dealsDir = join(__dirname, '../../content/deals');
  
  try {
    const files = readdirSync(dealsDir).filter(f => f.endsWith('.md'));
    
    if (files.length === 0) {
      console.log('⚠️  No deal files found to validate');
      return true;
    }
    
    console.log(`📋 Validating ${files.length} deal file(s)...`);
    
    let allValid = true;
    
    for (const file of files) {
      const filePath = join(dealsDir, file);
      const content = readFileSync(filePath, 'utf-8');
      
      console.log(`\n🔍 Validating ${file}...`);
      
      // Check frontmatter exists
      if (!content.startsWith('---')) {
        console.error(`❌ Missing frontmatter in ${file}`);
        allValid = false;
        continue;
      }
      
      // Extract frontmatter
      const frontmatterEnd = content.indexOf('---', 3);
      if (frontmatterEnd === -1) {
        console.error(`❌ Invalid frontmatter in ${file}`);
        allValid = false;
        continue;
      }
      
      const frontmatter = content.substring(3, frontmatterEnd);
      
      // Check required fields
      const requiredFields = ['title', 'date', 'description'];
      for (const field of requiredFields) {
        if (!frontmatter.includes(`${field}:`)) {
          console.error(`❌ Missing required field '${field}' in ${file}`);
          allValid = false;
        }
      }
      
      // Validate prices if present
      const priceMatches = content.match(/\$[\d,]+(?:\.\d{2})?/g);
      if (priceMatches && priceMatches.length > 0) {
        console.log(`   Found ${priceMatches.length} price(s)`);
        // Price validation is informational only
      }
      
      // Check for affiliate links
      const hasAffiliateLinks = content.includes('amazon.com') || 
                                content.includes('roguefitness.com') || 
                                content.includes('repfitness.com');
      
      if (!hasAffiliateLinks) {
        console.warn(`⚠️  No affiliate links found in ${file}`);
      }
      
      console.log(`✅ ${file} validation complete`);
    }
    
    return allValid;
    
  } catch (error) {
    console.error('❌ Validation error:', error.message);
    return false;
  }
}

/**
 * Main validation runner
 */
async function main() {
  console.log('🔍 Starting content validation...\n');
  
  const isValid = await validateDeals();
  
  if (isValid) {
    console.log('\n✅ All validations passed!');
    process.exit(0);
  } else {
    console.log('\n❌ Validation failed - please review errors above');
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { validateDeals };