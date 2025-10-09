#!/usr/bin/env node

/**
 * Content Validator
 * Validates generated content for SEO and quality requirements
 */

import { readFile, readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '../..');

/**
 * Validation rules
 */
const VALIDATION_RULES = {
    minWordCount: 600,
    maxWordCount: 1500,
    minInternalLinks: 3,
    maxInternalLinks: 10,
    requiredFrontmatter: ['title', 'date', 'description'],
    maxTitleLength: 70,
    maxDescriptionLength: 160,
    minDescriptionLength: 120
};

/**
 * Parse frontmatter from markdown
 */
function parseFrontmatter(content) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
    const match = content.match(frontmatterRegex);

    if (!match) {
        return null;
    }

    const frontmatter = {};
    const lines = match[1].split('\n');

    for (const line of lines) {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
            const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
            frontmatter[key.trim()] = value;
        }
    }

    return frontmatter;
}

/**
 * Count words in content
 */
function countWords(content) {
    // Remove frontmatter
    const withoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n/, '');
    // Remove markdown syntax
    const plainText = withoutFrontmatter
        .replace(/#{1,6}\s/g, '')
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
        .replace(/[*_~`]/g, '')
        .replace(/\n+/g, ' ');

    return plainText.split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Count internal links
 */
function countInternalLinks(content) {
    const linkRegex = /\[([^\]]+)\]\(([^\)]+)\)/g;
    const matches = [...content.matchAll(linkRegex)];

    // Filter for internal links (starting with / or relative paths)
    const internalLinks = matches.filter(match => {
        const url = match[2];
        return url.startsWith('/') || (!url.startsWith('http') && !url.startsWith('mailto:'));
    });

    return internalLinks.length;
}

/**
 * Validate a single content file
 */
async function validateFile(filepath) {
    const content = await readFile(filepath, 'utf-8');
    const errors = [];
    const warnings = [];

    // Parse frontmatter
    const frontmatter = parseFrontmatter(content);

    if (!frontmatter) {
        errors.push('Missing or invalid frontmatter');
        return { errors, warnings, valid: false };
    }

    // Check required frontmatter fields
    for (const field of VALIDATION_RULES.requiredFrontmatter) {
        if (!frontmatter[field]) {
            errors.push(`Missing required frontmatter field: ${field}`);
        }
    }

    // Validate title length
    if (frontmatter.title) {
        if (frontmatter.title.length > VALIDATION_RULES.maxTitleLength) {
            warnings.push(`Title too long (${frontmatter.title.length} chars, max ${VALIDATION_RULES.maxTitleLength})`);
        }
    }

    // Validate description length
    if (frontmatter.description) {
        const descLength = frontmatter.description.length;
        if (descLength > VALIDATION_RULES.maxDescriptionLength) {
            warnings.push(`Description too long (${descLength} chars, max ${VALIDATION_RULES.maxDescriptionLength})`);
        } else if (descLength < VALIDATION_RULES.minDescriptionLength) {
            warnings.push(`Description too short (${descLength} chars, min ${VALIDATION_RULES.minDescriptionLength})`);
        }
    }

    // Count words
    const wordCount = countWords(content);
    if (wordCount < VALIDATION_RULES.minWordCount) {
        errors.push(`Content too short (${wordCount} words, min ${VALIDATION_RULES.minWordCount})`);
    } else if (wordCount > VALIDATION_RULES.maxWordCount) {
        warnings.push(`Content very long (${wordCount} words, max ${VALIDATION_RULES.maxWordCount})`);
    }

    // Count internal links
    const linkCount = countInternalLinks(content);
    if (linkCount < VALIDATION_RULES.minInternalLinks) {
        warnings.push(`Few internal links (${linkCount}, recommended min ${VALIDATION_RULES.minInternalLinks})`);
    } else if (linkCount > VALIDATION_RULES.maxInternalLinks) {
        warnings.push(`Many internal links (${linkCount}, recommended max ${VALIDATION_RULES.maxInternalLinks})`);
    }

    return {
        errors,
        warnings,
        valid: errors.length === 0,
        stats: {
            wordCount,
            linkCount,
            titleLength: frontmatter.title?.length || 0,
            descriptionLength: frontmatter.description?.length || 0
        }
    };
}

/**
 * Validate all content in a directory
 */
async function validateDirectory(dirPath) {
    try {
        const files = await readdir(dirPath);
        const mdFiles = files.filter(f => f.endsWith('.md'));

        const results = [];

        for (const file of mdFiles) {
            const filepath = join(dirPath, file);
            const result = await validateFile(filepath);
            results.push({
                file,
                ...result
            });
        }

        return results;
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

/**
 * Main validation process
 */
async function main() {
    console.log('='.repeat(60));
    console.log('Content Validator');
    console.log('='.repeat(60));

    try {
        const workoutsDir = join(PROJECT_ROOT, 'content/workouts');
        const tipsDir = join(PROJECT_ROOT, 'content/tips');

        console.log('\n📋 Validating workout content...');
        const workoutResults = await validateDirectory(workoutsDir);

        console.log('\n📋 Validating tips content...');
        const tipResults = await validateDirectory(tipsDir);

        const allResults = [
            ...workoutResults.map(r => ({ ...r, type: 'workout' })),
            ...tipResults.map(r => ({ ...r, type: 'tip' }))
        ];

        if (allResults.length === 0) {
            console.log('\n⚠️  No content files found to validate\n');
            return;
        }

        // Print results
        console.log('\n' + '='.repeat(60));
        console.log('Validation Results');
        console.log('='.repeat(60));

        let totalValid = 0;
        let totalInvalid = 0;
        let totalWarnings = 0;

        for (const result of allResults) {
            const status = result.valid ? '✅' : '❌';
            console.log(`\n${status} ${result.type}: ${result.file}`);

            if (result.stats) {
                console.log(`   Words: ${result.stats.wordCount}`);
                console.log(`   Links: ${result.stats.linkCount}`);
                console.log(`   Title: ${result.stats.titleLength} chars`);
                console.log(`   Description: ${result.stats.descriptionLength} chars`);
            }

            if (result.errors.length > 0) {
                console.log('   Errors:');
                result.errors.forEach(err => console.log(`     - ${err}`));
                totalInvalid++;
            } else {
                totalValid++;
            }

            if (result.warnings.length > 0) {
                console.log('   Warnings:');
                result.warnings.forEach(warn => console.log(`     - ${warn}`));
                totalWarnings += result.warnings.length;
            }
        }

        // Summary
        console.log('\n' + '='.repeat(60));
        console.log('Summary:');
        console.log(`  Total files: ${allResults.length}`);
        console.log(`  Valid: ${totalValid}`);
        console.log(`  Invalid: ${totalInvalid}`);
        console.log(`  Warnings: ${totalWarnings}`);
        console.log('='.repeat(60));

        if (totalInvalid > 0) {
            console.log('\n⚠️  Some content files have validation errors\n');
            process.exit(1);
        }

        console.log('\n✅ All content validated successfully!\n');

    } catch (error) {
        console.error('\n❌ Validation error:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { validateFile, validateDirectory, main as validateContent };
