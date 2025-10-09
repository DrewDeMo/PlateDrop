# Content Automation Setup Guide

Quick start guide to get your automated content generation system running.

## Prerequisites

- GitHub repository with Actions enabled
- OpenAI API account with GPT-4 access
- Node.js 20+ installed locally (for testing)

## Setup Steps

### 1. Configure GitHub Secrets

Go to your repository **Settings** → **Secrets and variables** → **Actions**

Add the following secret:

```
Name: OPENAI_API_KEY
Value: sk-... (your OpenAI API key)
```

Optional secrets:
```
Name: PRIMARY_SITE_URL
Value: https://platedrop.fit

Name: SITE_NAME
Value: PlateDrop
```

### 2. Create Environment (Optional but Recommended)

1. Go to **Settings** → **Environments**
2. Click **New environment**
3. Name it: `OPENAI_API_KEY`
4. Add the `OPENAI_API_KEY` secret to this environment
5. (Optional) Add protection rules to require approval for production runs

### 3. Enable GitHub Actions

1. Go to **Actions** tab
2. If prompted, click **I understand my workflows, go ahead and enable them**
3. Verify the **Generate Daily Content** workflow appears

### 4. Test the System Locally (Recommended)

Before running in production, test locally:

```bash
# Install dependencies
npm install

# Test workout generation
node scripts/generate/daily-workout.js

# Test tip generation
node scripts/generate/equipment-tips.js

# Test full scheduler
node scripts/generate/content-scheduler.js

# Validate generated content
node scripts/validate/content-validator.js
```

**Note:** You'll need a `.env` file with your OpenAI API key:

```bash
# Create .env file
echo "OPENAI_API_KEY=sk-your-key-here" > .env
```

### 5. Run First Manual Test

1. Go to **Actions** tab
2. Select **Generate Daily Content** workflow
3. Click **Run workflow** dropdown
4. Select `main` branch
5. Click **Run workflow** button
6. Wait 2-3 minutes for completion
7. Check the workflow run for success ✅

### 6. Verify Generated Content

After successful run:

1. Check `content/workouts/` directory for new workout post
2. Check `content/tips/` directory for new tip (if Tuesday/Thursday)
3. Verify `data/content-topics.json` was updated with usage tracking
4. Review the generated content quality

### 7. Monitor First Week

For the first week, monitor:

- ✅ Workflow runs successfully each weekday at 6 AM EST
- ✅ Content is generated and committed
- ✅ Site rebuilds and deploys automatically
- ✅ New posts appear on live site
- ✅ No validation errors

## Troubleshooting First Run

### "OpenAI API key not found"

**Solution:** 
1. Verify secret name is exactly `OPENAI_API_KEY`
2. Check the secret has no extra spaces
3. Ensure environment is configured correctly

### "No content generated"

**Solution:**
1. Check if it's a weekend (no content on Sat/Sun)
2. Review workflow logs for errors
3. Verify OpenAI API has sufficient credits

### "Validation failed"

**Solution:**
1. Review validation errors in workflow logs
2. Check generated content manually
3. Adjust validation rules if needed in `scripts/validate/content-validator.js`

### "Commit failed"

**Solution:**
1. Ensure GitHub Actions has write permissions
2. Check for merge conflicts
3. Verify branch protection rules allow bot commits

## Daily Operation

Once set up, the system runs automatically:

- **Monday-Friday at 6 AM EST:** Generates workout post
- **Tuesday/Thursday at 6 AM EST:** Also generates equipment tip
- **Weekends:** No generation (rest days!)

You can manually trigger anytime via Actions tab.

## Cost Monitoring

Track your OpenAI API usage:

1. Visit [OpenAI Usage Dashboard](https://platform.openai.com/usage)
2. Expected cost: ~$2-3/month
3. Set up billing alerts at $5/month threshold

## Next Steps

After successful setup:

1. ✅ Let it run for 1 week to verify stability
2. ✅ Review generated content quality
3. ✅ Monitor traffic growth in Google Analytics
4. ✅ Add more topics to `data/content-topics.json` as needed
5. ✅ Adjust schedule or content types based on performance

## Getting Help

If you encounter issues:

1. Check [`CONTENT_AUTOMATION.md`](CONTENT_AUTOMATION.md) for detailed documentation
2. Review workflow logs in GitHub Actions
3. Test scripts locally to isolate issues
4. Check OpenAI API status page

## Quick Reference

### Manual Commands

```bash
# Generate workout
node scripts/generate/daily-workout.js

# Generate tip
node scripts/generate/equipment-tips.js

# Run scheduler (respects day of week)
node scripts/generate/content-scheduler.js

# Validate all content
node scripts/validate/content-validator.js
```

### Important Files

- **Workflow:** `.github/workflows/daily-content.yml`
- **Topics:** `data/content-topics.json`
- **Prompts:** `llm/prompts/daily-workout.txt` and `llm/prompts/equipment-tips.txt`
- **Generated:** `content/workouts/` and `content/tips/`

### Workflow Schedule

```
Monday    6 AM EST: 1 workout
Tuesday   6 AM EST: 1 workout + 1 tip
Wednesday 6 AM EST: 1 workout
Thursday  6 AM EST: 1 workout + 1 tip
Friday    6 AM EST: 1 workout
```

**Total:** 5 workouts + 2 tips = 7 posts per week

---

**Ready to launch?** Run your first manual test and watch the magic happen! 🚀
