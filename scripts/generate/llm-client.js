#!/usr/bin/env node

/**
 * LLM Client Abstraction Layer
 * Handles OpenAI API calls with retry logic and error handling
 */

import OpenAI from 'openai';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * Create OpenAI client
 */
function createClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }
  
  return new OpenAI({ apiKey });
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate content with retry logic
 */
export async function generateContent(prompt, options = {}) {
  const {
    model = 'gpt-4',
    temperature = 0.7,
    maxTokens = 2500,
    maxRetries = 3,
    retryDelay = 2000,
    timeout = 60000
  } = options;
  
  const client = createClient();
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`\n🤖 Calling OpenAI API (attempt ${attempt}/${maxRetries})...`);
      console.log(`   Model: ${model}`);
      console.log(`   Max tokens: ${maxTokens}`);
      
      const startTime = Date.now();
      
      const completion = await Promise.race([
        client.chat.completions.create({
          model: model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert home gym equipment writer. You write accurate, helpful content based strictly on provided data.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: temperature,
          max_tokens: maxTokens,
          top_p: 1,
          frequency_penalty: 0.3,
          presence_penalty: 0.1
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), timeout)
        )
      ]);
      
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      const content = completion.choices[0].message.content;
      const usage = completion.usage;
      
      console.log(`✓ Generated content in ${duration}s`);
      console.log(`   Tokens used: ${usage.total_tokens} (prompt: ${usage.prompt_tokens}, completion: ${usage.completion_tokens})`);
      console.log(`   Estimated cost: $${((usage.total_tokens / 1000) * 0.03).toFixed(4)}`);
      
      return {
        content: content,
        usage: usage,
        model: model,
        duration: parseFloat(duration)
      };
      
    } catch (error) {
      lastError = error;
      console.error(`✗ Attempt ${attempt} failed:`, error.message);
      
      // Don't retry on certain errors
      if (error.message.includes('API key') || error.message.includes('authentication')) {
        throw error;
      }
      
      // Wait before retrying
      if (attempt < maxRetries) {
        const delay = retryDelay * attempt; // Exponential backoff
        console.log(`   Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }
  
  throw new Error(`Failed after ${maxRetries} attempts. Last error: ${lastError.message}`);
}

/**
 * Validate API key
 */
export async function validateApiKey() {
  try {
    const client = createClient();
    await client.models.list();
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get available models
 */
export async function listModels() {
  const client = createClient();
  const models = await client.models.list();
  return models.data
    .filter(m => m.id.includes('gpt'))
    .map(m => m.id)
    .sort();
}

/**
 * Estimate token count (rough approximation)
 */
export function estimateTokens(text) {
  // Rough estimate: ~4 characters per token
  return Math.ceil(text.length / 4);
}

/**
 * Estimate cost for a request
 */
export function estimateCost(promptTokens, completionTokens, model = 'gpt-4') {
  const pricing = {
    'gpt-4': { prompt: 0.03, completion: 0.06 },
    'gpt-4-turbo': { prompt: 0.01, completion: 0.03 },
    'gpt-3.5-turbo': { prompt: 0.0015, completion: 0.002 }
  };
  
  const rates = pricing[model] || pricing['gpt-4'];
  const promptCost = (promptTokens / 1000) * rates.prompt;
  const completionCost = (completionTokens / 1000) * rates.completion;
  
  return {
    prompt: promptCost,
    completion: completionCost,
    total: promptCost + completionCost
  };
}

// CLI testing
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Testing LLM client...\n');
  
  // Test API key
  console.log('Validating API key...');
  const isValid = await validateApiKey();
  
  if (isValid) {
    console.log('✓ API key is valid\n');
    
    // Test generation
    const result = await generateContent(
      'Write a single sentence about home gym equipment.',
      { maxTokens: 50 }
    );
    
    console.log('\nGenerated content:');
    console.log(result.content);
  } else {
    console.log('✗ API key is invalid or not set');
    console.log('Set OPENAI_API_KEY in your .env file');
  }
}