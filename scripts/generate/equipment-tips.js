#!/usr/bin/env node

/**
 * Equipment Tips Content Generator
 * Generates equipment tips and buying guides using LLM
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { generateContent } from './llm-client.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '../..');

/**
 * Load content topics database
 */
async function loadTopicsData() {
    const dataPath = join(PROJECT_ROOT, 'data/content-topics.json');
    const content = await readFile(dataPath, 'utf-8');
    return JSON.parse(content);
}

/**
 * Load prompt template
 */
async function loadPromptTemplate() {
    const promptPath = join(PROJECT_ROOT, 'llm/prompts/equipment-tips.txt');
    return await readFile(promptPath, 'utf-8');
}

/**
 * Select next unused tip topic
 */
function selectTipTopic(topicsData) {
    const { tips, metadata } = topicsData;
    const usedIds = metadata.usage_tracking.tips_used || [];

    // Find unused tips
    const unusedTips = tips.filter(t => !usedIds.includes(t.id));

    // If all used, reset and start over
    if (unusedTips.length === 0) {
        console.log('   All tips used, resetting cycle...');
        metadata.usage_tracking.tips_used = [];
        return tips[0];
    }

    // Return first unused tip
    return unusedTips[0];
}

/**
 * Mark tip as used
 */
async function markTipAsUsed(topicsData, tipId) {
    const dataPath = join(PROJECT_ROOT, 'data/content-topics.json');

    if (!topicsData.metadata.usage_tracking.tips_used) {
        topicsData.metadata.usage_tracking.tips_used = [];
    }

    topicsData.metadata.usage_tracking.tips_used.push(tipId);
    topicsData.metadata.last_updated = new Date().toISOString().split('T')[0];

    await writeFile(dataPath, JSON.stringify(topicsData, null, 2), 'utf-8');
}

/**
 * Build prompt with tip data
 */
function buildPrompt(template, tip, date) {
    const tipJson = JSON.stringify(tip, null, 2);
    const currentDate = date.toISOString();

    return template
        .replace('{tip_json}', tipJson)
        .replace('{current_date}', currentDate)
        .replace('{tip_title}', tip.title)
        .replace('{category}', tip.category)
        .replace('{primary_keywords}', tip.keywords.join(', '));
}

/**
 * Generate filename for tip post
 */
function generateFilename(date, tip) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // Create URL-friendly slug from tip ID
    const slug = tip.id;

    return `${year}-${month}-${day}-${slug}.md`;
}

/**
 * Save generated content
 */
async function saveContent(content, filename) {
    const contentDir = join(PROJECT_ROOT, 'content/tips');
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
    console.log('PlateDrop Equipment Tips Generator');
    console.log('='.repeat(60));

    try {
        const today = new Date();

        // Load topics database
        console.log('\n📋 Loading tip topics...');
        const topicsData = await loadTopicsData();
        console.log(`✓ Loaded ${topicsData.tips.length} tip topics`);

        // Select tip topic
        console.log('\n🎯 Selecting tip topic...');
        const tip = selectTipTopic(topicsData);
        console.log(`✓ Selected: ${tip.title}`);
        console.log(`   Category: ${tip.category}`);
        console.log(`   Keywords: ${tip.keywords.join(', ')}`);

        const filename = generateFilename(today, tip);

        // Load prompt template
        console.log('\n📝 Loading prompt template...');
        const template = await loadPromptTemplate();
        console.log('✓ Template loaded');

        // Build prompt
        console.log('\n🔨 Building prompt...');
        const prompt = buildPrompt(template, tip, today);
        console.log(`✓ Prompt built (${prompt.length} characters)`);

        // Generate content
        console.log('\n🤖 Generating equipment tip with GPT-4...');
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

        // Mark tip as used
        console.log('\n📊 Updating usage tracking...');
        await markTipAsUsed(topicsData, tip.id);
        console.log('✓ Tip marked as used');

        // Summary
        console.log('\n' + '='.repeat(60));
        console.log('Summary:');
        console.log(`  File: ${filename}`);
        console.log(`  Topic: ${tip.title}`);
        console.log(`  Words: ~${result.content.split(/\s+/).length}`);
        console.log(`  Cost: $${((result.usage.total_tokens / 1000) * 0.03).toFixed(4)}`);
        console.log('='.repeat(60));

        // Preview
        console.log('\n📄 Content Preview (first 500 characters):');
        console.log('-'.repeat(60));
        console.log(result.content.substring(0, 500) + '...');
        console.log('-'.repeat(60));

        console.log('\n✅ Equipment tip generated successfully!\n');

    } catch (error) {
        console.error('\n❌ Error generating tip:', error.message);
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

export { main as generateEquipmentTip };
