# PlateDrop Implementation Guide

## Quick Start Summary

This guide provides step-by-step instructions for implementing PlateDrop. Each phase builds on the previous one, creating a fully automated content generation and publishing system.

---

## Technology Stack Decisions

### Static Site Generator: **Astro**
**Why Astro over Eleventy:**
- Superior performance (partial hydration, zero JS by default)
- Modern DX with TypeScript support
- Built-in image optimization
- Better SEO out of the box
- Content collections with type safety
- Growing ecosystem and active development

### LLM Provider: **OpenAI GPT-4**
**Why GPT-4 over GPT-3.5:**
- Better instruction following (critical for price accuracy)
- More consistent output format
- Better at avoiding hallucinations
- Worth the cost for content quality
- Can be swapped later via abstraction layer

### Initial Data Strategy: **Mock Seed Data**
**Why start with mocks:**
- Test entire pipeline without external dependencies
- Validate LLM prompts and output
- Ensure validation systems work correctly
- Easy to add real sources later
- No rate limiting or scraping concerns during development

---

## Phase-by-Phase Implementation

### Phase 1: Foundation Setup

**Goal:** Create project structure and initialize all necessary files

**Steps:**
1. Initialize Node.js project with modern tooling
2. Set up Astro with TypeScript
3. Create complete directory structure
4. Configure git with comprehensive .gitignore
5. Set up environment variable management
6. Install core dependencies

**Key Files to Create:**
- `package.json` with all dependencies
- `tsconfig.json` for TypeScript
- `.gitignore` for Node/Astro
- `.env.example` with all required variables
- `README.md` with setup instructions

**Dependencies:**
```json
{
  "dependencies": {
    "astro": "^4.0.0",
    "@astrojs/rss": "^4.0.0",
    "@astrojs/sitemap": "^3.0.0",
    "openai": "^4.0.0",
    "dotenv": "^16.0.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "prettier": "^3.0.0",
    "eslint": "^8.0.0"
  }
}
```

---

### Phase 2: Astro Site Configuration

**Goal:** Build production-ready static site with all layouts and components

**Components to Build:**

1. **Layouts:**
   - `BaseLayout.astro` - Global wrapper with SEO
   - `DealLayout.astro` - Daily deals template
   - `GuideLayout.astro` - Evergreen guide template

2. **Components:**
   - `Header.astro` - Site navigation
   - `Footer.astro` - Links + disclosures
   - `DealCard.astro` - Product display card
   - `AdUnit.astro` - AdSense placeholder
   - `RelatedPosts.astro` - Content recommendations
   - `SEO.astro` - Meta tags and structured data

3. **Pages:**
   - `index.astro` - Homepage with latest deals
   - `deals/[slug].astro` - Dynamic deal pages
   - `guides/[slug].astro` - Dynamic guide pages
   - `rss.xml.js` - RSS feed generator
   - `sitemap.xml.js` - Sitemap generator

**Astro Config Features:**
```javascript
export default defineConfig({
  site: 'https://platedrop.com',
  integrations: [
    sitemap(),
    rss()
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-light'
    }
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  }
});
```

**SEO Requirements:**
- Unique title and description per page
- Open Graph tags for social sharing
- JSON-LD structured data (Article schema)
- Canonical URLs
- Proper heading hierarchy (single H1)
- Alt text for all images

---

### Phase 3: Data Pipeline

**Goal:** Fetch, normalize, and deduplicate product data

**Architecture:**
```
Retailer Sources → Fetchers → Normalizer → Deduper → deals-today.json
```

**Key Scripts:**

1. **`scripts/fetch/index.js`** - Main orchestrator
   - Reads retailer configs
   - Calls individual fetchers
   - Handles errors gracefully
   - Logs progress

2. **`scripts/fetch/retailers/mock.js`** - Mock data generator
   - Creates realistic test data
   - Includes price variations
   - Simulates different retailers
   - Ensures data diversity

3. **`scripts/fetch/normalizer.js`** - Data standardization
   - Converts to common schema
   - Calculates discount percentages
   - Validates required fields
   - Handles missing data

4. **`scripts/fetch/deduper.js`** - Duplicate removal
   - Fuzzy title matching
   - Brand + category grouping
   - Keeps best deal per product
   - Logs removed duplicates

**Normalized Data Schema:**
```typescript
interface NormalizedProduct {
  id: string;              // Stable slug
  title: string;           // Product name
  brand: string;           // Manufacturer
  category: string;        // Equipment type
  url: string;             // Affiliate URL
  image_url: string;       // Product image
  price_current: number;   // Current price
  price_prev?: number;     // Previous price
  discount_pct: number;    // Calculated discount
  rating?: number;         // 0-5 stars
  reviews_count?: number;  // Review count
  retailer: string;        // Source retailer
  last_seen_utc: string;   // ISO timestamp
  source_url: string;      // Original URL
}
```

**Retailer Configuration:**
```json
{
  "retailers": [
    {
      "id": "mock",
      "name": "Mock Data",
      "enabled": true,
      "type": "mock",
      "product_count": 15
    },
    {
      "id": "rogue",
      "name": "Rogue Fitness",
      "enabled": false,
      "base_url": "https://www.roguefitness.com",
      "deals_endpoint": "/deals",
      "affiliate_params": {
        "param_name": "tag",
        "tag_value": "env:ROGUE_AFFILIATE_TAG"
      }
    }
  ]
}
```

---

### Phase 4: LLM Orchestration

**Goal:** Generate high-quality, accurate content using GPT-4

**Key Components:**

1. **`scripts/generate/llm-client.js`** - OpenAI abstraction
   - Handles API calls
   - Implements retry logic
   - Manages rate limiting
   - Logs token usage
   - Supports provider swapping

2. **`scripts/generate/daily-deals.js`** - Daily post generator
   - Loads product data
   - Selects top N deals (by discount)
   - Constructs prompt with data
   - Calls LLM
   - Saves Markdown output

3. **`scripts/generate/evergreen-guide.js`** - Guide generator
   - Selects topic from backlog
   - Aggregates relevant products
   - Generates comprehensive guide
   - Includes methodology section

**Prompt Engineering Best Practices:**

1. **Be Explicit About Data Usage:**
   ```
   CRITICAL: Use ONLY the provided JSON data for all prices, 
   discounts, and ratings. Do NOT estimate or invent any numbers.
   ```

2. **Specify Output Format:**
   ```
   Output must be valid Markdown with:
   - H2 for product names
   - H3 for subsections
   - Bullet lists for features
   - Exact affiliate URLs as provided
   ```

3. **Set Tone and Style:**
   ```
   Use friendly, neutral tone. Write for beginners.
   Keep paragraphs to 2-3 sentences. No medical claims.
   ```

4. **Provide Examples:**
   ```
   Example product section:
   ## Rogue Echo Bike — Unlimited Cardio Potential
   
   The Rogue Echo Bike delivers a full-body cardio workout...
   ```

**Daily Deals Prompt Template:**
```
You are a home gym equipment expert writing today's deal roundup.

STRICT RULES:
1. Use ONLY the provided product data for prices and discounts
2. Do NOT invent or estimate any numbers
3. Include affiliate links exactly as provided
4. Keep paragraphs to 2-3 sentences
5. Use friendly, neutral tone - no medical claims

FORMAT:
Title: "Home Gym Deals — [Month] [Day], [Year]"

Intro (2-3 sentences about today's savings)

For each product:
## [Product Name] — [Benefit Phrase]

[What it is, current price, previous price, discount %, 1-2 features]

**Who it's for:**
- [Space consideration]
- [Budget consideration]
- [Training style consideration]

[View deal: affiliate_url]

Outro: [Tip of the day] + [Price disclaimer]

PRODUCT DATA:
{product_json}

Generate the Markdown now.
```

**LLM Client Configuration:**
```javascript
const config = {
  model: 'gpt-4',
  temperature: 0.7,
  max_tokens: 2000,
  top_p: 1,
  frequency_penalty: 0.3,  // Reduce repetition
  presence_penalty: 0.1,   // Encourage variety
  timeout: 60000,          // 60 second timeout
  max_retries: 3,
  retry_delay: 2000        // 2 second base delay
};
```

---

### Phase 5: Validation Systems

**Goal:** Ensure content accuracy and compliance

**Validation Layers:**

1. **Price Validation** (`scripts/validate/price-checker.js`)
   - Extract all price mentions from Markdown
   - Parse currency values
   - Compare against source JSON
   - Allow ±$0.01 tolerance for rounding
   - Reject if any mismatch

2. **Link Validation** (`scripts/validate/link-checker.js`)
   - Extract all URLs from Markdown
   - Verify domain matches expected retailer
   - Check affiliate parameter present
   - Verify parameter value correct
   - Test link accessibility (optional)

3. **Content Quality** (`scripts/validate/content-lint.js`)
   - Word count within range
   - Exactly one H1 (title)
   - No prohibited terms (medical claims)
   - No fabricated specifications
   - Proper Markdown structure
   - Unique content (similarity check)

4. **Schema Validation** (`scripts/validate/schema-validator.js`)
   - Validate JSON against schemas
   - Check required fields present
   - Verify data types correct
   - Ensure value ranges valid

**Validation Flow:**
```javascript
async function validateContent(markdown, sourceData) {
  const results = {
    prices: await validatePrices(markdown, sourceData),
    links: await validateLinks(markdown, sourceData),
    quality: await validateQuality(markdown),
    schema: await validateSchema(sourceData)
  };
  
  const isValid = Object.values(results).every(r => r.passed);
  
  if (!isValid) {
    throw new ValidationError('Content validation failed', results);
  }
  
  return results;
}
```

**Error Handling:**
- Log all validation failures
- Include specific error details
- Suggest fixes when possible
- Fail workflow if critical errors
- Allow warnings for minor issues

---

### Phase 6: GitHub Actions Workflows

**Goal:** Automate daily and weekly content generation

**Nightly Workflow** (`.github/workflows/nightly-deals.yml`):

```yaml
name: Generate Daily Deals

on:
  schedule:
    - cron: '0 2 * * *'  # 02:00 UTC daily
  workflow_dispatch:      # Manual trigger for testing

env:
  NODE_VERSION: '20'

jobs:
  generate-deals:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Fetch product data
        run: node scripts/fetch/index.js
        env:
          AMAZON_ASSOC_TAG: ${{ secrets.AMAZON_ASSOC_TAG }}
          ROGUE_AFFILIATE_TAG: ${{ secrets.ROGUE_AFFILIATE_TAG }}
      
      - name: Generate daily post
        run: node scripts/generate/daily-deals.js
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          SITE_NAME: ${{ secrets.SITE_NAME }}
      
      - name: Validate content
        run: node scripts/validate/index.js
      
      - name: Commit and push changes
        run: |
          git config user.name "PlateDrop Bot"
          git config user.email "bot@platedrop.com"
          git add content/deals data/deals-today.json
          git diff --staged --quiet || git commit -m "Daily deals: $(date +%Y-%m-%d)"
          git push
      
      - name: Notify on failure
        if: failure()
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: 'Daily deals workflow failed',
              body: 'The nightly deals generation failed. Check the workflow logs.'
            })
```

**Weekly Guide Workflow** (`.github/workflows/weekly-guides.yml`):

```yaml
name: Generate Weekly Guide

on:
  schedule:
    - cron: '0 3 * * 1'  # 03:00 UTC Mondays
  workflow_dispatch:

env:
  NODE_VERSION: '20'

jobs:
  generate-guide:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Select guide topic
        run: node scripts/generate/select-topic.js
      
      - name: Generate guide content
        run: node scripts/generate/evergreen-guide.js
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          SITE_NAME: ${{ secrets.SITE_NAME }}
      
      - name: Validate content
        run: node scripts/validate/index.js
      
      - name: Commit and push changes
        run: |
          git config user.name "PlateDrop Bot"
          git config user.email "bot@platedrop.com"
          git add content/guides data/guide-topics.json
          git diff --staged --quiet || git commit -m "New guide: $(cat .guide-title)"
          git push
      
      - name: Notify on failure
        if: failure()
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: 'Weekly guide workflow failed',
              body: 'The weekly guide generation failed. Check the workflow logs.'
            })
```

**Workflow Best Practices:**
- Use `workflow_dispatch` for manual testing
- Cache npm dependencies for speed
- Use secrets for all sensitive data
- Implement failure notifications
- Add retry logic for transient failures
- Log detailed progress information

---

### Phase 7: Policy Pages & Compliance

**Goal:** Create legally compliant disclosure pages

**Required Pages:**

1. **Privacy Policy** (`content/pages/privacy-policy.md`)
   - Data collection practices
   - Cookie usage
   - Third-party services (AdSense, Analytics)
   - User rights
   - Contact information

2. **Affiliate Disclosure** (`content/pages/affiliate-disclosure.md`)
   - Clear statement about affiliate relationships
   - Explanation of how affiliate links work
   - Disclosure that site earns commissions
   - Statement about honest recommendations

3. **Terms of Service** (`content/pages/terms.md`)
   - Site usage terms
   - Content accuracy disclaimer
   - Price change disclaimer
   - Limitation of liability

4. **Contact Page** (`content/pages/contact.md`)
   - Email address
   - Response time expectations
   - Topics for contact

**Inline Disclosures:**
- Add affiliate disclosure to footer
- Include price disclaimer on deal pages
- Mark affiliate links clearly

**Example Affiliate Disclosure:**
```markdown
# Affiliate Disclosure

PlateDrop participates in affiliate marketing programs. When you click 
on links to products and make a purchase, we may earn a commission at 
no additional cost to you.

We only recommend products we believe offer genuine value to home gym 
enthusiasts. Our editorial content is not influenced by affiliate 
relationships, and we maintain strict standards for accuracy and 
transparency.

All prices and availability are subject to change. We verify pricing 
daily, but retailers may update their prices at any time.
```

---

### Phase 8: SEO & Analytics

**Goal:** Maximize discoverability and track performance

**SEO Implementation:**

1. **Meta Tags** (in BaseLayout.astro):
```astro
<head>
  <title>{title} | PlateDrop</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonicalURL} />
  
  <!-- Open Graph -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonicalURL} />
  <meta property="og:image" content={ogImage} />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImage} />
</head>
```

2. **Structured Data** (JSON-LD):
```javascript
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": title,
  "description": description,
  "image": ogImage,
  "datePublished": publishDate,
  "dateModified": modifiedDate,
  "author": {
    "@type": "Organization",
    "name": "PlateDrop"
  }
};
```

3. **Sitemap Configuration**:
```javascript
export default sitemap({
  filter: (page) => !page.includes('/admin/'),
  changefreq: 'daily',
  priority: 0.7,
  lastmod: new Date()
});
```

4. **robots.txt**:
```
User-agent: *
Allow: /

Sitemap: https://platedrop.com/sitemap.xml
```

**Analytics Setup:**

1. **Cloudflare Analytics** (automatic with Cloudflare Pages)
   - Page views
   - Unique visitors
   - Geographic data
   - No cookie consent required

2. **Google Search Console**:
   - Add verification meta tag
   - Submit sitemap
   - Monitor indexing status
   - Track search queries

3. **AdSense Integration** (after approval):
```astro
<!-- In AdUnit.astro -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={ADSENSE_CLIENT_ID}"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client={ADSENSE_CLIENT_ID}
     data-ad-slot="1234567890"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

---

### Phase 9: Documentation

**Goal:** Create comprehensive operational documentation

**README.md Structure:**
```markdown
# PlateDrop

Automated home gym deals and guides platform.

## Quick Start
## Architecture
## Development
## Deployment
## Environment Variables
## Troubleshooting
## Contributing
```

**RUNBOOK.md Structure:**
```markdown
# PlateDrop Operations Runbook

## Daily Operations
## Incident Response
## Common Issues
## Maintenance Tasks
## Monitoring
## Escalation
```

**Key Documentation:**
- Setup instructions
- Environment variable reference
- Workflow trigger instructions
- Debugging guide
- Prompt tuning guide
- Adding new retailers
- Performance optimization

---

### Phase 10: Testing & Launch

**Goal:** Validate entire system before production

**Testing Checklist:**

1. **Unit Tests:**
   - [ ] Normalizer functions
   - [ ] Deduper logic
   - [ ] Validation functions
   - [ ] Link builder

2. **Integration Tests:**
   - [ ] Fetch → Normalize → Dedupe pipeline
   - [ ] Generate → Validate → Publish pipeline
   - [ ] LLM client with retries

3. **End-to-End Tests:**
   - [ ] Full nightly workflow
   - [ ] Full weekly workflow
   - [ ] Manual trigger workflows

4. **Content Quality:**
   - [ ] Generate 5 sample deal posts
   - [ ] Generate 3 sample guides
   - [ ] Verify all prices accurate
   - [ ] Verify all links work
   - [ ] Check content uniqueness

5. **Performance:**
   - [ ] Lighthouse audit (≥90 mobile)
   - [ ] Core Web Vitals passing
   - [ ] Build time <2 minutes
   - [ ] Deploy time <3 minutes

6. **SEO:**
   - [ ] Sitemap generates correctly
   - [ ] RSS feed valid
   - [ ] Meta tags unique per page
   - [ ] Structured data valid
   - [ ] robots.txt accessible

7. **Compliance:**
   - [ ] Policy pages complete
   - [ ] Affiliate disclosures present
   - [ ] Price disclaimers included
   - [ ] No medical claims

**Launch Sequence:**

1. **Week -1: Pre-launch**
   - Complete all testing
   - Generate seed content (10 guides)
   - Set up monitoring
   - Configure Cloudflare Pages

2. **Day 0: Soft Launch**
   - Deploy to production
   - Enable nightly workflow
   - Monitor first automated run
   - Verify deployment successful

3. **Week 1: Monitoring**
   - Check daily workflow success
   - Review generated content quality
   - Monitor site performance
   - Fix any issues

4. **Week 2: Optimization**
   - Refine prompts based on output
   - Adjust validation thresholds
   - Optimize build performance
   - Add more data sources

5. **Week 3: Growth**
   - Enable weekly guide workflow
   - Submit to Search Console
   - Apply for AdSense
   - Share initial content

6. **Week 4+: Iteration**
   - Monitor analytics
   - Expand retailer sources
   - Refine content strategy
   - Track affiliate performance

---

## Critical Success Factors

1. **Content Accuracy:** Never compromise on price/spec accuracy
2. **Automation Reliability:** Workflows must run successfully 99%+ of time
3. **Performance:** Site must be fast (Lighthouse ≥90)
4. **Compliance:** All disclosures and policies must be clear
5. **Uniqueness:** Every piece of content must be unique

---

## When to Pause and Get User Input

**Required User Actions:**
1. Provide OpenAI API key
2. Provide affiliate tags (Amazon, etc.)
3. Set up GitHub repository
4. Configure Cloudflare Pages connection
5. Add GitHub Secrets
6. Review and approve generated content samples
7. Apply for AdSense (after 30 days)
8. Set up custom domain (optional)

**Decision Points:**
1. Approve prompt templates before use
2. Review first generated content
3. Approve retailer sources to add
4. Decide on ad placement
5. Approve guide topic backlog

---

## Next Steps

This implementation guide provides the complete roadmap. The next action is to:

1. **Review this plan** and confirm approach
2. **Switch to Code mode** to begin implementation
3. **Start with Phase 1** (Foundation setup)
4. **Proceed sequentially** through all phases

Each phase will be implemented completely before moving to the next, ensuring a solid foundation at every step.
