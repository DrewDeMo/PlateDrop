# How PlateDrop's Automated Content System Works

## Overview

PlateDrop uses GitHub Actions to automatically generate daily deal content using AI (GPT-4). The system runs every night and updates the website with fresh deals.

---

## The Automated Pipeline

### 1. **GitHub Actions Workflow** (`.github/workflows/nightly-deals.yml`)

**Schedule:** Runs daily at 2 AM UTC (10 PM EST / 9 PM EDT)

**Steps:**
1. Fetches product data from retailers
2. Generates AI content with GPT-4
3. Validates the content
4. Commits changes to repository
5. Cloudflare auto-deploys the updated site

### 2. **Data Fetching** (`scripts/fetch/index.js`)

**Current Status:** Using mock data generator

**What it does:**
- Generates 10-15 mock products with realistic data
- Includes: prices, discounts, ratings, reviews
- Saves to `data/deals-today.json`

**Future:** Will connect to real retailer APIs:
- Amazon Product Advertising API
- Rogue Fitness data feed
- REP Fitness product catalog
- Web scraping for other retailers

### 3. **AI Content Generation** (`scripts/generate/daily-deals.js`)

**What it does:**
- Reads product data from `data/deals-today.json`
- Sends to GPT-4 with specialized prompts
- Generates markdown content for deals
- Saves to `content/deals/` directory

**AI Prompt:** Located in `llm/prompts/daily-deals.txt`
- Instructs GPT-4 on tone, style, and format
- Ensures consistent, engaging content
- Focuses on value and authenticity

### 4. **Website Display** (`site/src/pages/index.astro`)

**How it works:**
- Reads `data/deals-today.json` at build time
- Sorts deals by discount percentage
- Displays top 6 deals on homepage
- Maps categories to appropriate images
- Shows all deal details (price, discount, ratings)

**Key Features:**
- Real-time data from GitHub Actions
- Automatic image selection by category
- Fallback message if no deals available
- Responsive grid layout

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Actions (Nightly)                  │
│                      Runs at 2 AM UTC                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Step 1: Fetch Product Data                      │
│         scripts/fetch/index.js (Mock Data)                   │
│                                                               │
│  Generates: data/deals-today.json                            │
│  Contains: 10-15 products with prices, discounts, etc.       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│         Step 2: Generate AI Content (GPT-4)                  │
│         scripts/generate/daily-deals.js                      │
│                                                               │
│  Reads: data/deals-today.json                                │
│  Uses: llm/prompts/daily-deals.txt                           │
│  Creates: content/deals/YYYY-MM-DD.md                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Step 3: Validate Content                        │
│            scripts/validate/index.js                         │
│                                                               │
│  Checks: Required fields, price formats, links               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│         Step 4: Commit & Push to GitHub                      │
│                                                               │
│  Commits: data/deals-today.json + content/deals/*.md         │
│  Triggers: Cloudflare Pages deployment                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│         Step 5: Cloudflare Builds & Deploys                  │
│                                                               │
│  Astro builds site with new data                             │
│  Homepage reads data/deals-today.json                        │
│  Site goes live with updated deals                           │
└─────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
PlateDrop/
├── .github/workflows/
│   └── nightly-deals.yml          # GitHub Actions workflow
│
├── data/
│   └── deals-today.json            # Generated product data (14 products)
│
├── content/
│   └── deals/
│       └── YYYY-MM-DD.md           # AI-generated daily posts
│
├── scripts/
│   ├── fetch/
│   │   ├── index.js                # Fetches product data
│   │   ├── normalizer.js           # Normalizes data format
│   │   ├── deduper.js              # Removes duplicates
│   │   └── retailers/
│   │       └── mock.js             # Mock data generator
│   │
│   ├── generate/
│   │   ├── daily-deals.js          # GPT-4 content generator
│   │   └── llm-client.js           # OpenAI API client
│   │
│   └── validate/
│       ├── index.js                # Content validator
│       └── price-checker.js        # Price validation
│
├── llm/
│   └── prompts/
│       └── daily-deals.txt         # GPT-4 prompt template
│
└── site/
    └── src/
        └── pages/
            └── index.astro         # Homepage (displays deals)
```

---

## Current Status

### ✅ Working
- GitHub Actions workflow runs successfully
- Mock data generation (14 products)
- AI content generation with GPT-4
- Automatic commits and deployment
- Homepage displays generated deals
- Real images from Unsplash
- Responsive design with animations

### 🔄 Using Mock Data
- Product data is currently generated (not from real retailers)
- Placeholder images in `deals-today.json` (replaced with Unsplash on display)
- Mock retailer URLs

### 📋 To Implement (Real Data)
- Amazon Product Advertising API integration
- Rogue Fitness affiliate data feed
- REP Fitness product scraping
- Real product images from retailers
- Actual affiliate links with tracking

---

## How to Test Locally

### 1. Run the Data Fetch
```bash
node scripts/fetch/index.js
```
This generates `data/deals-today.json` with mock products.

### 2. Generate AI Content
```bash
export OPENAI_API_KEY="your-key-here"
node scripts/generate/daily-deals.js
```
This creates markdown files in `content/deals/`.

### 3. Build the Site
```bash
cd site
npm run build
npm run preview
```
Visit http://localhost:4321 to see the deals.

---

## How to Trigger Manually

### Via GitHub Actions UI
1. Go to repository → Actions tab
2. Select "Generate Daily Deals" workflow
3. Click "Run workflow" button
4. Wait 2-3 minutes for completion

### Via Git Push
Any push to the main branch triggers Cloudflare deployment (but not the deals generation).

---

## Cost Breakdown

### Per Run (Daily)
- **Data Fetching:** Free (mock data)
- **GPT-4 API:** ~$0.09 per run
- **GitHub Actions:** Free (2,000 minutes/month)
- **Cloudflare Pages:** Free (500 builds/month)

### Monthly
- **Total:** ~$2.70/month ($0.09 × 30 days)

---

## Troubleshooting

### No Deals Showing on Homepage

**Check:**
1. Does `data/deals-today.json` exist?
2. Does it contain products array?
3. Run workflow manually to regenerate

**Fix:**
```bash
# Regenerate data locally
node scripts/fetch/index.js
git add data/deals-today.json
git commit -m "Regenerate deals data"
git push
```

### Workflow Fails

**Common Issues:**
- OpenAI API key expired or invalid
- API rate limit exceeded
- Network timeout

**Check:**
- GitHub Actions logs
- Repository secrets are set correctly
- OpenAI account has credits

### Deals Look Wrong

**Check:**
- `llm/prompts/daily-deals.txt` for prompt issues
- GPT-4 response in workflow logs
- Validation errors in logs

---

## Customization

### Change Deal Count on Homepage

Edit `site/src/pages/index.astro`:
```javascript
// Change from 6 to desired number
deals = dealsData.products
  .sort((a, b) => b.discount_pct - a.discount_pct)
  .slice(0, 6)  // ← Change this number
```

### Modify AI Prompt

Edit `llm/prompts/daily-deals.txt` to change:
- Writing tone and style
- Content structure
- Focus areas (e.g., more technical details)

### Change Schedule

Edit `.github/workflows/nightly-deals.yml`:
```yaml
schedule:
  - cron: '0 2 * * *'  # Change time here (UTC)
```

### Add New Product Categories

1. Update mock data generator in `scripts/fetch/retailers/mock.js`
2. Add category images in `site/src/pages/index.astro`
3. Update category filters if needed

---

## Future Enhancements

### Phase 1: Real Data Integration
- [ ] Amazon Product Advertising API
- [ ] Rogue Fitness data feed
- [ ] REP Fitness scraper
- [ ] Real product images

### Phase 2: Advanced Features
- [ ] Price history tracking
- [ ] Deal alerts via email
- [ ] User accounts and saved deals
- [ ] Comparison tables

### Phase 3: Content Expansion
- [ ] AI-generated buying guides
- [ ] Product reviews
- [ ] Category landing pages
- [ ] Blog posts

---

## Key Takeaways

1. **Fully Automated:** Runs every night without manual intervention
2. **AI-Powered:** GPT-4 generates engaging, unique content daily
3. **Cost-Effective:** ~$3/month for AI generation
4. **Scalable:** Easy to add more retailers and products
5. **Modern Stack:** Astro + GitHub Actions + Cloudflare Pages

The system is designed to be low-maintenance while providing fresh, engaging content daily. Once real retailer integrations are added, it will become a powerful deal aggregation platform.