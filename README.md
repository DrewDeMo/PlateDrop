# PlateDrop - Automated Home Gym Deals Platform

PlateDrop is an automated content platform that generates daily home gym deal roundups and weekly evergreen guides using LLM-powered content generation, static site deployment, and scheduled CI/CD pipelines.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and npm 10+
- OpenAI API key (for content generation)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd PlateDrop
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your API keys and configuration.

4. Start the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:4321`

## 📁 Project Structure

```
PlateDrop/
├── .github/workflows/     # GitHub Actions workflows
├── content/              # Generated content
│   ├── deals/           # Daily deal posts
│   ├── guides/          # Evergreen guides
│   └── pages/           # Policy pages
├── data/                # Configuration and data
│   ├── retailers.json   # Retailer configs
│   └── guide-topics.json # Guide backlog
├── llm/                 # LLM prompts and guards
│   ├── prompts/        # Content generation prompts
│   └── guards/         # Validation rules
├── scripts/            # Automation scripts
│   ├── fetch/         # Data fetching
│   ├── generate/      # Content generation
│   ├── validate/      # Content validation
│   └── publish/       # Publishing utilities
├── site/              # Astro website
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── styles/
│   └── public/
└── tests/             # Test files
```

## 🛠️ Available Scripts

### Development
- `npm run dev` - Start Astro dev server
- `npm run build` - Build production site
- `npm run preview` - Preview production build

### Content Generation
- `npm run fetch` - Fetch product data from retailers
- `npm run generate:daily` - Generate daily deals post
- `npm run generate:guide` - Generate evergreen guide
- `npm run validate` - Validate generated content

### Code Quality
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier
- `npm test` - Run tests

## 🔧 Configuration

### Environment Variables

Required variables (see `.env.example`):

- `OPENAI_API_KEY` - OpenAI API key for content generation
- `PRIMARY_SITE_URL` - Your site URL (e.g., https://platedrop.fit)

### Retailer Configuration

Edit `data/retailers.json` to configure data sources:

```json
{
  "retailers": [
    {
      "id": "mock",
      "name": "Mock Data",
      "enabled": true,
      "type": "mock"
    }
  ]
}
```

## 📝 Content Generation Workflow

### Daily Deals (Automated)

1. **Fetch** - Scrape retailer feeds for deals
2. **Normalize** - Convert to standard format
3. **Generate** - Create Markdown content with LLM
4. **Validate** - Verify prices and links
5. **Publish** - Commit to repository

Runs automatically at 02:00 UTC daily via GitHub Actions.

### Weekly Guides (Automated)

1. **Select Topic** - Choose from backlog
2. **Generate** - Create comprehensive guide
3. **Validate** - Check content quality
4. **Publish** - Commit to repository

Runs automatically at 03:00 UTC on Mondays via GitHub Actions.

## 🚀 Deployment

### Cloudflare Pages

1. Connect your GitHub repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set build output directory: `site/dist`
4. Add environment variables in Cloudflare dashboard
5. Deploy!

The site will automatically rebuild when you push to the main branch.

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Test individual components:

```bash
node --test tests/fetch.test.js
node --test tests/generate.test.js
node --test tests/validate.test.js
```

## 📊 Monitoring

- Check GitHub Actions for workflow status
- Review generated content in `content/` directory
- Monitor site performance in Cloudflare Analytics

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- [Architecture Documentation](ARCHITECTURE.md)
- [Implementation Guide](IMPLEMENTATION_GUIDE.md)
- [Live Site](https://platedrop.fit)

## 💡 Tips

- Start with mock data (`retailers.json` has mock enabled by default)
- Test content generation locally before deploying
- Review validation rules in `llm/guards/`
- Customize prompts in `llm/prompts/`

## 🐛 Troubleshooting

### Build Errors

If you encounter build errors:

1. Clear cache: `rm -rf node_modules .astro dist`
2. Reinstall: `npm install`
3. Rebuild: `npm run build`

### Content Generation Issues

- Verify OpenAI API key is set correctly
- Check prompt templates in `llm/prompts/`
- Review validation logs in workflow output

### Deployment Issues

- Verify environment variables in Cloudflare
- Check build logs in Cloudflare Pages
- Ensure all dependencies are in `package.json`

## 📞 Support

For issues and questions:
- Open a GitHub issue
- Check existing documentation
- Review workflow logs
