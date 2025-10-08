# PlateDrop Deployment Guide

## Prerequisites

- GitHub account
- Cloudflare account (free tier)
- OpenAI API key
- Affiliate program accounts (Amazon Associates, etc.)

## Step 1: Repository Setup

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: PlateDrop setup"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Add GitHub Secrets**
   
   Go to your repository → Settings → Secrets and variables → Actions → New repository secret
   
   Add these secrets:
   
   ```
   OPENAI_API_KEY=sk-proj-your-key-here
   PRIMARY_SITE_URL=https://platedrop.fit
   SITE_NAME=PlateDrop - Home Gym Deals & Tips
   AMAZON_ASSOC_TAG=yoursite-20
   ROGUE_AFFILIATE_TAG=your-rogue-tag
   REP_AFFILIATE_TAG=your-rep-tag
   ```

## Step 2: Cloudflare Pages Setup

1. **Connect Repository**
   - Log in to Cloudflare Dashboard
   - Go to Pages → Create a project
   - Connect your GitHub account
   - Select the PlateDrop repository

2. **Configure Build Settings**
   ```
   Framework preset: Astro
   Build command: npm run build
   Build output directory: site/dist
   Root directory: /
   ```

3. **Environment Variables**
   
   Add these in Cloudflare Pages → Settings → Environment variables:
   
   ```
   NODE_VERSION=20
   PRIMARY_SITE_URL=https://platedrop.fit
   SITE_NAME=PlateDrop - Home Gym Deals & Tips
   ```
   
   Note: Don't add API keys here - they're only needed in GitHub Actions

4. **Custom Domain**
   - Go to Custom domains
   - Add `platedrop.fit` and `www.platedrop.fit`
   - Follow DNS configuration instructions

## Step 3: Initial Content Generation

Since your local Node.js is blocked by IT, use GitHub Actions:

1. **Trigger Manual Workflow**
   - Go to Actions tab in GitHub
   - Select "Generate Daily Deals"
   - Click "Run workflow"
   - Select branch: main
   - Click "Run workflow"

2. **Monitor Progress**
   - Watch the workflow run
   - Check for any errors
   - Review generated content in `content/deals/`

3. **Verify Deployment**
   - Cloudflare will automatically deploy after the commit
   - Check your site at `https://platedrop.fit`

## Step 4: Verify Automation

1. **Check Scheduled Runs**
   - Workflow runs daily at 2 AM UTC (10 PM EST)
   - Monitor in Actions tab
   - Check for any failures

2. **Test Failure Notifications**
   - Failures create GitHub issues automatically
   - Subscribe to issue notifications

## Troubleshooting

### Workflow Fails

**Check logs:**
1. Go to Actions tab
2. Click on failed workflow
3. Expand failed step
4. Review error message

**Common issues:**
- Missing secrets → Add in repository settings
- API key invalid → Verify OpenAI key
- Rate limits → Wait and retry

### Site Not Updating

**Check Cloudflare:**
1. Go to Cloudflare Pages
2. Check deployment status
3. Review build logs

**Force rebuild:**
1. Go to Cloudflare Pages
2. Click "Retry deployment"

### Content Quality Issues

**Review validation:**
1. Check workflow logs for validation warnings
2. Adjust prompts in `llm/prompts/`
3. Update validation rules in `llm/guards/`

## Monitoring

### Daily Checks

1. **Content Quality**
   - Review generated posts
   - Check prices match data
   - Verify affiliate links work

2. **Site Performance**
   - Check Cloudflare Analytics
   - Monitor page load times
   - Review error rates

3. **Costs**
   - Monitor OpenAI usage
   - Track API costs
   - Adjust if needed

### Weekly Tasks

1. **Review Analytics**
   - Traffic patterns
   - Popular content
   - Conversion rates

2. **Update Content**
   - Add new guide topics
   - Update policy pages
   - Refresh homepage

3. **Maintenance**
   - Update dependencies
   - Review security alerts
   - Check for broken links

## Scaling

### Reduce Costs

1. **Switch to GPT-3.5-turbo**
   - Edit `scripts/generate/daily-deals.js`
   - Change model to `gpt-3.5-turbo`
   - Saves ~90% on API costs

2. **Reduce Frequency**
   - Edit `.github/workflows/nightly-deals.yml`
   - Change cron schedule
   - Example: `0 2 * * 1,3,5` (Mon, Wed, Fri only)

### Add Real Retailers

1. **Create Fetcher**
   - Copy `scripts/fetch/retailers/mock.js`
   - Implement retailer-specific logic
   - Add to `data/retailers.json`

2. **Enable in Config**
   ```json
   {
     "id": "rogue",
     "enabled": true,
     ...
   }
   ```

3. **Test Locally**
   ```bash
   node scripts/fetch/index.js
   ```

### Add More Content Types

1. **Weekly Guides**
   - Already configured in workflows
   - Add topics to `data/guide-topics.json`
   - Create prompt in `llm/prompts/evergreen-guide.txt`

2. **Product Reviews**
   - Create new workflow
   - Add review template
   - Generate monthly

## Support

### Getting Help

1. **Check Documentation**
   - README.md
   - ARCHITECTURE.md
   - IMPLEMENTATION_GUIDE.md

2. **Review Logs**
   - GitHub Actions logs
   - Cloudflare build logs
   - Browser console

3. **Common Solutions**
   - Clear cache
   - Retry workflow
   - Check secrets

## Security

### Best Practices

1. **API Keys**
   - Never commit to repository
   - Use GitHub Secrets
   - Rotate regularly

2. **Dependencies**
   - Update monthly
   - Review security alerts
   - Use `npm audit`

3. **Access Control**
   - Limit repository access
   - Use branch protection
   - Require reviews

## Next Steps

1. **Apply for Affiliate Programs**
   - Amazon Associates
   - Rogue Fitness
   - REP Fitness

2. **Set Up Analytics**
   - Google Analytics
   - Google Search Console
   - Bing Webmaster Tools

3. **Apply for AdSense**
   - Wait for traffic
   - Follow guidelines
   - Add ad units

4. **Promote Site**
   - Social media
   - Reddit (r/homegym)
   - Fitness forums

## Maintenance Schedule

### Daily
- ✅ Automated content generation
- ✅ Automated deployment
- 👀 Quick quality check

### Weekly
- 📊 Review analytics
- 🔍 Check for errors
- 📝 Plan new content

### Monthly
- 🔄 Update dependencies
- 🔐 Review security
- 💰 Analyze costs
- 📈 Review performance

## Success Metrics

Track these KPIs:

1. **Traffic**
   - Daily visitors
   - Page views
   - Bounce rate

2. **Engagement**
   - Time on site
   - Pages per session
   - Return visitors

3. **Revenue**
   - Affiliate clicks
   - Conversion rate
   - Revenue per visitor

4. **Technical**
   - Uptime
   - Page load time
   - Error rate

## Conclusion

Your site is now fully automated! The workflow will:

1. Fetch deals daily at 2 AM UTC
2. Generate content with GPT-4
3. Validate and publish
4. Deploy to Cloudflare
5. Notify on failures

Monitor the Actions tab and enjoy your automated content platform! 🚀