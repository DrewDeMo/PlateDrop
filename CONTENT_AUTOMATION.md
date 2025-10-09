# Content Automation System

## Overview

The PlateDrop content automation system generates high-quality, SEO-optimized workout and equipment tip content daily to maintain site freshness and drive organic traffic until affiliate program approval.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Actions Scheduler                  │
│                  (Daily at 6 AM EST, Mon-Fri)               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Content Scheduler                          │
│              (scripts/generate/content-scheduler.js)         │
│                                                              │
│  • Determines content type based on day of week              │
│  • Mon-Fri: Generate workout                                 │
│  • Tue/Thu: Also generate equipment tip                      │
└────────────┬────────────────────────┬───────────────────────┘
             │                        │
             ▼                        ▼
┌────────────────────────┐  ┌────────────────────────┐
│  Workout Generator     │  │  Tips Generator        │
│  (daily-workout.js)    │  │  (equipment-tips.js)   │
│                        │  │                        │
│  • Selects unused      │  │  • Selects unused      │
│    topic from DB       │  │    topic from DB       │
│  • Builds LLM prompt   │  │  • Builds LLM prompt   │
│  • Generates content   │  │  • Generates content   │
│  • Saves to content/   │  │  • Saves to content/   │
│  • Marks as used       │  │  • Marks as used       │
└────────────┬───────────┘  └────────────┬───────────┘
             │                           │
             └───────────┬───────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Content Validator                          │
│              (scripts/validate/content-validator.js)         │
│                                                              │
│  • Validates word count (600-1500 words)                     │
│  • Checks internal links (3-10 links)                        │
│  • Verifies frontmatter fields                               │
│  • Validates SEO metadata                                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Git Commit & Deploy                        │
│                                                              │
│  • Commits new content to repository                         │
│  • Triggers Astro rebuild                                    │
│  • Deploys to production                                     │
└─────────────────────────────────────────────────────────────┘
```

## Content Schedule

### Weekly Schedule

| Day       | Workout | Equipment Tip | Total Posts |
|-----------|---------|---------------|-------------|
| Monday    | ✅      | ❌            | 1           |
| Tuesday   | ✅      | ✅            | 2           |
| Wednesday | ✅      | ❌            | 1           |
| Thursday  | ✅      | ✅            | 2           |
| Friday    | ✅      | ❌            | 1           |
| Saturday  | ❌      | ❌            | 0           |
| Sunday    | ❌      | ❌            | 0           |

**Total:** 5 workouts + 2 tips = 7 posts per week

### Content Rotation

The system uses a topic database ([`data/content-topics.json`](data/content-topics.json)) with:
- **20 workout topics** (expandable to 100+)
- **20 equipment tip topics** (expandable to 100+)

Topics are used sequentially and tracked to avoid duplicates. When all topics are used, the cycle resets automatically.

## File Structure

```
PlateDrop/
├── .github/
│   └── workflows/
│       └── daily-content.yml          # GitHub Actions workflow
├── content/
│   ├── workouts/                      # Generated workout posts
│   │   └── YYYY-MM-DD-workout-slug.md
│   └── tips/                          # Generated equipment tips
│       └── YYYY-MM-DD-tip-slug.md
├── data/
│   └── content-topics.json            # Topic database with usage tracking
├── llm/
│   └── prompts/
│       ├── daily-workout.txt          # Workout generation prompt
│       └── equipment-tips.txt         # Tips generation prompt
└── scripts/
    ├── generate/
    │   ├── content-scheduler.js       # Main scheduler
    │   ├── daily-workout.js           # Workout generator
    │   ├── equipment-tips.js          # Tips generator
    │   └── llm-client.js              # OpenAI API client
    └── validate/
        └── content-validator.js       # Content quality validator
```

## Content Quality Standards

### Workout Posts (800-1200 words)

**Required Elements:**
- Complete frontmatter (title, date, description, keywords, difficulty, duration)
- Introduction (2-3 sentences)
- Equipment list with internal links
- Workout overview
- Warm-up section (5-10 minutes)
- Main workout (5-8 exercises with sets/reps/rest)
- Cool-down section (5-10 minutes)
- Progression tips
- Common mistakes to avoid
- Workout variations
- Related content links

**SEO Requirements:**
- Primary keyword in title and first paragraph
- 3-5 internal links to guides and deals
- Meta description 120-160 characters
- Descriptive headers with keywords

### Equipment Tips (600-800 words)

**Required Elements:**
- Complete frontmatter (title, date, description, keywords, category)
- Introduction explaining the topic
- "Why This Matters" section
- Main content with comparisons or how-to steps
- Buying criteria or selection factors
- Common mistakes to avoid
- Budget considerations (budget/mid-range/premium)
- Practical tips
- Decision framework
- Related resources links

**SEO Requirements:**
- Primary keyword in title and first paragraph
- 4-6 internal links to guides and deals
- Meta description 120-160 characters
- Descriptive headers with keywords

## Manual Usage

### Generate a Single Workout

```bash
node scripts/generate/daily-workout.js
```

### Generate a Single Tip

```bash
node scripts/generate/equipment-tips.js
```

### Run the Full Scheduler

```bash
node scripts/generate/content-scheduler.js
```

### Validate Content

```bash
node scripts/validate/content-validator.js
```

## GitHub Actions Workflow

### Automatic Execution

The workflow runs automatically:
- **Time:** 6:00 AM EST (10:00 AM UTC)
- **Days:** Monday through Friday
- **Trigger:** GitHub Actions cron schedule

### Manual Execution

You can manually trigger the workflow:

1. Go to **Actions** tab in GitHub
2. Select **Generate Daily Content** workflow
3. Click **Run workflow**
4. Select branch (usually `main`)
5. Click **Run workflow** button

### Workflow Steps

1. **Checkout repository** - Gets latest code
2. **Setup Node.js** - Installs Node.js 20
3. **Install dependencies** - Runs `npm ci`
4. **Generate content** - Runs content scheduler
5. **Validate content** - Checks quality standards
6. **Commit and push** - Saves to repository
7. **Generate summary** - Creates workflow summary
8. **Create issue on failure** - Alerts if something fails

## Environment Variables

Required secrets in GitHub repository settings:

```
OPENAI_API_KEY          # OpenAI API key for GPT-4
PRIMARY_SITE_URL        # Your site URL (optional)
SITE_NAME               # Your site name (optional)
```

### Setting Up Secrets

1. Go to repository **Settings**
2. Navigate to **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each required secret

## Cost Estimation

### Per Content Generation

- **Workout post:** ~2,500-3,000 tokens = $0.075-$0.09
- **Equipment tip:** ~2,000-2,500 tokens = $0.06-$0.075

### Monthly Cost

- **Workouts:** 20 posts × $0.08 = $1.60
- **Tips:** 8 posts × $0.07 = $0.56
- **Total:** ~$2.16/month

### Annual Cost

- **Total:** ~$26/year

## Monitoring and Maintenance

### Success Indicators

✅ **Workflow runs successfully**
- Check GitHub Actions tab for green checkmarks
- Review workflow summaries

✅ **Content is generated**
- New files appear in `content/workouts/` and `content/tips/`
- Files have proper frontmatter and structure

✅ **Content is deployed**
- New posts appear on live site
- Sitemap is updated

### Failure Handling

If the workflow fails:

1. **Automatic issue creation** - GitHub creates an issue with details
2. **Check workflow logs** - Review error messages in Actions tab
3. **Common issues:**
   - OpenAI API key expired or invalid
   - Rate limiting (unlikely at this volume)
   - Network connectivity issues
   - Content validation failures

### Manual Intervention

If you need to fix issues:

```bash
# Test locally first
npm install
node scripts/generate/content-scheduler.js

# Validate the output
node scripts/validate/content-validator.js

# If successful, commit manually
git add content/ data/
git commit -m "Manual content generation"
git push
```

## Expanding the System

### Adding More Topics

Edit [`data/content-topics.json`](data/content-topics.json):

```json
{
  "workouts": [
    {
      "id": "new-workout-id",
      "title": "New Workout Title",
      "keywords": ["keyword1", "keyword2"],
      "difficulty": "beginner|intermediate|advanced",
      "duration": "30-45 minutes",
      "equipment": ["barbell", "dumbbells"],
      "focus": "strength|cardio|flexibility"
    }
  ],
  "tips": [
    {
      "id": "new-tip-id",
      "title": "New Tip Title",
      "keywords": ["keyword1", "keyword2"],
      "category": "equipment-selection|maintenance|setup",
      "related_equipment": ["barbells"],
      "related_guides": ["/guides/barbells"]
    }
  ]
}
```

### Adjusting Schedule

Edit [`.github/workflows/daily-content.yml`](.github/workflows/daily-content.yml):

```yaml
on:
  schedule:
    # Change cron expression
    # Format: minute hour day month day-of-week
    - cron: '0 10 * * 1-5'  # 10 AM UTC, Mon-Fri
```

### Modifying Content Templates

Edit prompt templates:
- [`llm/prompts/daily-workout.txt`](llm/prompts/daily-workout.txt)
- [`llm/prompts/equipment-tips.txt`](llm/prompts/equipment-tips.txt)

### Changing Validation Rules

Edit [`scripts/validate/content-validator.js`](scripts/validate/content-validator.js):

```javascript
const VALIDATION_RULES = {
  minWordCount: 600,        // Adjust minimum words
  maxWordCount: 1500,       // Adjust maximum words
  minInternalLinks: 3,      // Adjust minimum links
  maxInternalLinks: 10,     // Adjust maximum links
  // ... other rules
};
```

## SEO Impact

### Expected Traffic Growth

Based on industry benchmarks for fitness content:

**Month 1-2:** 50-200 daily visitors
- Google indexing new content
- Building initial authority

**Month 3-4:** 200-500 daily visitors
- Long-tail keywords ranking
- Internal linking benefits

**Month 5-6:** 500-1,500 daily visitors
- Compound effect of content
- Higher domain authority

**Month 6+:** 1,500-3,000+ daily visitors
- Established content library
- Multiple ranking keywords

### Key Success Factors

1. **Consistency** - Daily fresh content signals to Google
2. **Quality** - Well-structured, helpful content
3. **Internal linking** - Distributes page authority
4. **Long-tail keywords** - Less competition, higher conversion
5. **User engagement** - Longer time on site, lower bounce rate

## Troubleshooting

### Content Not Generating

**Check:**
1. OpenAI API key is valid
2. Workflow is enabled in GitHub Actions
3. Schedule is correct for your timezone
4. No rate limiting from OpenAI

### Content Quality Issues

**Check:**
1. Prompt templates are up to date
2. Validation rules are appropriate
3. Topic database has good keywords
4. LLM temperature setting (0.7 is balanced)

### Deployment Issues

**Check:**
1. Astro build is successful
2. Content directories exist
3. Frontmatter format is correct
4. No syntax errors in markdown

## Support and Updates

### Getting Help

1. Check workflow logs in GitHub Actions
2. Review generated content for quality
3. Test scripts locally before deploying
4. Monitor OpenAI API usage and costs

### Future Enhancements

Potential improvements:
- [ ] Add image generation for featured images
- [ ] Implement A/B testing for titles
- [ ] Add social media auto-posting
- [ ] Create email newsletter from content
- [ ] Add analytics tracking for content performance
- [ ] Implement content refresh for old posts

---

**Last Updated:** 2025-01-09

**Version:** 1.0.0

**Maintainer:** PlateDrop Team
