#!/usr/bin/env node

/**
 * Content Scheduler
 * Determines what type of content to generate based on day of week
 * Monday-Friday: Workouts
 * Tuesday/Thursday: Also generate equipment tips (in addition to workout)
 */

import { generateDailyWorkout } from './daily-workout.js';
import { generateEquipmentTip } from './equipment-tips.js';

/**
 * Get day of week (0 = Sunday, 1 = Monday, etc.)
 */
function getDayOfWeek(date = new Date()) {
    return date.getDay();
}

/**
 * Get day name
 */
function getDayName(dayOfWeek) {
    const days = ['Sunday', 'Saturday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return days[dayOfWeek];
}

/**
 * Determine what content to generate
 */
function getContentSchedule(date = new Date()) {
    const dayOfWeek = getDayOfWeek(date);
    const dayName = getDayName(dayOfWeek);

    const schedule = {
        dayOfWeek,
        dayName,
        generateWorkout: false,
        generateTip: false
    };

    // Monday (1) through Friday (5): Generate workout
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        schedule.generateWorkout = true;
    }

    // Tuesday (2) and Thursday (4): Also generate tip
    if (dayOfWeek === 2 || dayOfWeek === 4) {
        schedule.generateTip = true;
    }

    return schedule;
}

/**
 * Main scheduler process
 */
async function main() {
    console.log('='.repeat(60));
    console.log('PlateDrop Content Scheduler');
    console.log('='.repeat(60));

    try {
        const today = new Date();
        const schedule = getContentSchedule(today);

        console.log(`\n📅 Today is ${schedule.dayName}`);
        console.log(`   Workout: ${schedule.generateWorkout ? '✓ Yes' : '✗ No'}`);
        console.log(`   Tip: ${schedule.generateTip ? '✓ Yes' : '✗ No'}`);

        if (!schedule.generateWorkout && !schedule.generateTip) {
            console.log('\n⏸️  No content scheduled for today (weekend)');
            console.log('   Content generation runs Monday-Friday\n');
            return;
        }

        const results = {
            workout: null,
            tip: null
        };

        // Generate workout if scheduled
        if (schedule.generateWorkout) {
            console.log('\n' + '='.repeat(60));
            console.log('Generating Workout Content');
            console.log('='.repeat(60));

            try {
                await generateDailyWorkout();
                results.workout = 'success';
            } catch (error) {
                console.error(`\n❌ Workout generation failed: ${error.message}`);
                results.workout = 'failed';
            }
        }

        // Generate tip if scheduled
        if (schedule.generateTip) {
            console.log('\n' + '='.repeat(60));
            console.log('Generating Equipment Tip');
            console.log('='.repeat(60));

            try {
                await generateEquipmentTip();
                results.tip = 'success';
            } catch (error) {
                console.error(`\n❌ Tip generation failed: ${error.message}`);
                results.tip = 'failed';
            }
        }

        // Final summary
        console.log('\n' + '='.repeat(60));
        console.log('Content Generation Summary');
        console.log('='.repeat(60));
        console.log(`Date: ${today.toISOString().split('T')[0]}`);
        console.log(`Day: ${schedule.dayName}`);

        if (results.workout) {
            console.log(`Workout: ${results.workout === 'success' ? '✅ Generated' : '❌ Failed'}`);
        }

        if (results.tip) {
            console.log(`Tip: ${results.tip === 'success' ? '✅ Generated' : '❌ Failed'}`);
        }

        console.log('='.repeat(60));

        // Exit with error if any generation failed
        if (results.workout === 'failed' || results.tip === 'failed') {
            console.log('\n⚠️  Some content generation failed. Check logs above.\n');
            process.exit(1);
        }

        console.log('\n✅ All scheduled content generated successfully!\n');

    } catch (error) {
        console.error('\n❌ Scheduler error:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { main as runContentScheduler, getContentSchedule };
