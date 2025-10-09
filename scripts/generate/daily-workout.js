#!/usr/bin/env node

/**
 * Daily Workout Content Generator
 * Generates daily workout posts using LLM
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
    const promptPath = join(PROJECT_ROOT, 'llm/prompts/daily-workout.txt');
    return await readFile(promptPath, 'utf-8');
}

/**
 * Select next unused workout topic
 */
function selectWorkoutTopic(topicsData) {
    const { workouts, metadata } = topicsData;
    const usedIds = metadata.usage_tracking.workouts_used || [];

    // Find unused workouts
    const unusedWorkouts = workouts.filter(w => !usedIds.includes(w.id));

    // If all used, reset and start over
    if (unusedWorkouts.length === 0) {
        console.log('   All workouts used, resetting cycle...');
        metadata.usage_tracking.workouts_used = [];
        return workouts[0];
    }

    // Return first unused workout
    return unusedWorkouts[0];
}

/**
 * Mark workout as used
 */
async function markWorkoutAsUsed(topicsData, workoutId) {
    const dataPath = join(PROJECT_ROOT, 'data/content-topics.json');

    if (!topicsData.metadata.usage_tracking.workouts_used) {
        topicsData.metadata.usage_tracking.workouts_used = [];
    }

    topicsData.metadata.usage_tracking.workouts_used.push(workoutId);
    topicsData.metadata.last_updated = new Date().toISOString().split('T')[0];

    await writeFile(dataPath, JSON.stringify(topicsData, null, 2), 'utf-8');
}

/**
 * Build prompt with workout data
 */
function buildPrompt(template, workout, date) {
    const workoutJson = JSON.stringify(workout, null, 2);
    const currentDate = date.toISOString();

    return template
        .replace('{workout_json}', workoutJson)
        .replace('{current_date}', currentDate)
        .replace('{workout_title}', workout.title)
        .replace('{difficulty_level}', workout.difficulty)
        .replace('{workout_duration}', workout.duration)
        .replace('{equipment_list}', JSON.stringify(workout.equipment))
        .replace('{primary_keywords}', workout.keywords.join(', '));
}

/**
 * Generate filename for workout post
 */
function generateFilename(date, workout) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // Create URL-friendly slug from workout ID
    const slug = workout.id;

    return `${year}-${month}-${day}-${slug}.md`;
}

/**
 * Save generated content
 */
async function saveContent(content, filename) {
    const contentDir = join(PROJECT_ROOT, 'content/workouts');
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
    console.log('PlateDrop Daily Workout Generator');
    console.log('='.repeat(60));

    try {
        const today = new Date();

        // Load topics database
        console.log('\n📋 Loading workout topics...');
        const topicsData = await loadTopicsData();
        console.log(`✓ Loaded ${topicsData.workouts.length} workout topics`);

        // Select workout topic
        console.log('\n🎯 Selecting workout topic...');
        const workout = selectWorkoutTopic(topicsData);
        console.log(`✓ Selected: ${workout.title}`);
        console.log(`   Difficulty: ${workout.difficulty}`);
        console.log(`   Duration: ${workout.duration}`);
        console.log(`   Equipment: ${workout.equipment.join(', ')}`);

        const filename = generateFilename(today, workout);

        // Load prompt template
        console.log('\n📝 Loading prompt template...');
        const template = await loadPromptTemplate();
        console.log('✓ Template loaded');

        // Build prompt
        console.log('\n🔨 Building prompt...');
        const prompt = buildPrompt(template, workout, today);
        console.log(`✓ Prompt built (${prompt.length} characters)`);

        // Generate content
        console.log('\n🤖 Generating workout content with GPT-4...');
        console.log('   This may take 30-60 seconds...');

        const result = await generateContent(prompt, {
            model: 'gpt-4',
            temperature: 0.7,
            maxTokens: 3000
        });

        console.log(`\n✓ Content generated successfully!`);
        console.log(`   Duration: ${result.duration}s`);
        console.log(`   Tokens: ${result.usage.total_tokens}`);
        console.log(`   Cost: $${((result.usage.total_tokens / 1000) * 0.03).toFixed(4)}`);

        // Save content
        console.log('\n💾 Saving content...');
        const filepath = await saveContent(result.content, filename);
        console.log(`✓ Saved to ${filepath}`);

        // Mark workout as used
        console.log('\n📊 Updating usage tracking...');
        await markWorkoutAsUsed(topicsData, workout.id);
        console.log('✓ Workout marked as used');

        // Summary
        console.log('\n' + '='.repeat(60));
        console.log('Summary:');
        console.log(`  File: ${filename}`);
        console.log(`  Topic: ${workout.title}`);
        console.log(`  Words: ~${result.content.split(/\s+/).length}`);
        console.log(`  Cost: $${((result.usage.total_tokens / 1000) * 0.03).toFixed(4)}`);
        console.log('='.repeat(60));

        // Preview
        console.log('\n📄 Content Preview (first 500 characters):');
        console.log('-'.repeat(60));
        console.log(result.content.substring(0, 500) + '...');
        console.log('-'.repeat(60));

        console.log('\n✅ Daily workout post generated successfully!\n');

    } catch (error) {
        console.error('\n❌ Error generating workout:', error.message);
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

export { main as generateDailyWorkout };
