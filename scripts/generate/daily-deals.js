#!/usr/bin/env node

/**
 * Daily Deals Content Generator
 * Generates daily deal roundup posts using LLM
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { generateContent } from './llm-client.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '../..');

/**
 * Load deals data
 */
async function loadDealsData() {
  const dataPath = join(PROJECT_ROOT, 'data/deals-today.json');
  const content = await readFile(dataPath, 'utf-8');
  return JSON.parse(content);
}

/**
 * Load prompt template
 */
async function loadPromptTemplate() {
  const promptPath = join(PROJECT_ROOT, 'llm/prompts/daily-deals.txt');
  return await readFile(promptPath, 'utf-8');
}

/**
 * Select top deals for the post
 */
function selectTopDeals(products, count = 8) {
  // Already sorted by best deals in the fetch script
  return products.slice(0, count);
}

/**
 * Build prompt with product data
 */
function buildPrompt(template, products, date) {
  const productJson = JSON.stringify(products, null, 2);
  const currentDate = date.toISOString();
  
  return template
    .replace('{product_json}', productJson)
    .replace('{current_date}', currentDate);
}

/**
 * Generate filename for today's post
 */
function generateFilename(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}.md`;
}

/**
 * Save generated content
 */
async function saveContent(content, filename) {
  const contentDir = join(PROJECT_ROOT, 'content/deals');
  await mkdir(contentDir, { recursive: true });
  
  const filepath = join(contentDir, filename);
  await writeFile(filepath, content, 'utf-8');
  
  return filepath;
}

/**
 * Main generation process
 */
async function main() {
  console.log('='.repeat(60));
  console.log('PlateDrop Daily Deals Generator');
  console.log('='.repeat(60));
  
  try {
    const today = new Date();
    const filename = generateFilename(today);
    
    // Load data
    console.log('\n📋 Loading deals data...');
    const dealsData = await loadDealsData();
    console.log(`✓ Loaded ${dealsData.product_count} products`);
    
    // Select top deals
    console.log('\n🎯 Selecting top deals...');
    const topDeals = selectTopDeals(dealsData.products, 8);
    console.log(`✓ Selected ${topDeals.length} deals for today's post`);
    
    // Show selected deals
    console.log('\nSelected deals:');
    topDeals.forEach((deal, i) => {
      console.log(`  ${i + 1}. ${deal.title} - ${deal.discount_pct}% off ($${deal.price_current})`);
    });
    
    // Load prompt template
    console.log('\n📝 Loading prompt template...');
    const template = await loadPromptTemplate();
    console.log('✓ Template loaded');
    
    // Build prompt
    console.log('\n🔨 Building prompt...');
    const prompt = buildPrompt(template, topDeals, today);
    console.log(`✓ Prompt built (${prompt.length} characters)`);
    
    // Generate content
    console.log('\n🤖 Generating content with GPT-4...');
    console.log('   This may take 30-60 seconds...');
    
    const result = await generateContent(prompt, {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2500
    });
    
    console.log(`\n✓ Content generated successfully!`);
    console.log(`   Duration: ${result.duration}s`);
    console.log(`   Tokens: ${result.usage.total_tokens}`);
    console.log(`   Cost: $${((result.usage.total_tokens / 1000) * 0.03).toFixed(4)}`);
    
    // Save content
    console.log('\n💾 Saving content...');
    const filepath = await saveContent(result.content, filename);
    console.log(`✓ Saved to ${filepath}`);
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('Summary:');
    console.log(`  File: ${filename}`);
    console.log(`  Deals: ${topDeals.length}`);
    console.log(`  Words: ~${result.content.split(/\s+/).length}`);
    console.log(`  Cost: $${((result.usage.total_tokens / 1000) * 0.03).toFixed(4)}`);
    console.log('='.repeat(60));
    
    // Preview
    console.log('\n📄 Content Preview (first 500 characters):');
    console.log('-'.repeat(60));
    console.log(result.content.substring(0, 500) + '...');
    console.log('-'.repeat(60));
    
    console.log('\n✅ Daily deals post generated successfully!\n');
    
  } catch (error) {
    console.error('\n❌ Error generating daily deals:', error.message);
    if (error.message.includes('API key')) {
      console.error('\n💡 Make sure OPENAI_API_KEY is set in your .env file');
    }
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as generateDailyDeals };