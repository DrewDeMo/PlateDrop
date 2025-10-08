# Home Gym Deals & Tips — LLM-Driven Passive Site  
*A concise, complete build plan an LLM can follow to implement the entire stack with minimal cost and zero manual content work after launch. No code included—just exact requirements and best practices.*

---

## 0) One-paragraph summary (so the LLM knows the mission)
Build a fully automated static website that posts **daily home-gym deals roundups** and **periodic evergreen guides**. A **Node.js** data pipeline fetches product data, an **LLM** turns it into Markdown, a **static site generator** compiles pages, and **Cloudflare Pages** deploys on every scheduled **GitHub Actions** run. Monetize with **AdSense** and **affiliate links**. Keep infra near-free, enforce accuracy (no hallucinated prices), and follow SEO and affiliate policies.

---

## 1) Outcomes the system must deliver
- Daily “Top Home Gym Deals” post, updated automatically.
- Weekly evergreen guide (e.g., “Best Adjustable Dumbbells for Small Spaces”).
- Clean, fast static site (Core Web Vitals friendly).
- Valid AdSense integration and compliant affiliate linking.
- Zero human interaction required beyond initial setup and occasional prompt tweaks.

**Success criteria (first 90 days):** site auto-publishes daily; sitemap indexed; AdSense approved; at least 10 evergreen guides live; affiliate link clicks recorded.

---

## 2) Tech stack (Node-first, low cost)
- **Language/Runtime:** Node.js LTS.
- **Repo/CI:** GitHub (private repo), GitHub Actions (scheduled workflows).
- **Hosting/CDN:** Cloudflare Pages (connected to GitHub main branch).
- **Static site generator:** Eleventy (11ty) or Astro (choose one; must support Markdown content, collections, RSS, sitemap).
- **Storage:** JSON files committed to repo for current deals; optional SQLite or Supabase (free tier) later for history.
- **LLM:** Start with a low-cost API (e.g., gpt-3.5-turbo). Add an abstraction layer so providers can be swapped (later: local OSS model).
- **Monitoring:** GitHub Actions failure notifications; Cloudflare Analytics; UptimeRobot (free).
- **SEO tooling:** Auto XML sitemap, RSS feed, robots.txt, basic on-page schema where relevant.

---

## 3) Environments & secrets (no hard-coded keys)
Create environment variables (as GitHub Secrets and Cloudflare build vars):
- `OPENAI_API_KEY` (or chosen LLM key)
- `AMAZON_ASSOC_TAG` (affiliate tag)
- `AMAZON_PA_ACCESS_KEY_ID` / `AMAZON_PA_SECRET_ACCESS_KEY` (only after 3 qualifying sales; before that, use retailer RSS or manual seed feeds)
- `PRIMARY_SITE_URL` (canonical URL)
- `SITE_NAME` (e.g., Home Gym Deals & Tips)
- `GOOGLE_ADSENSE_CLIENT_ID` (after AdSense approval)
- Optional: `SUPABASE_URL` / `SUPABASE_ANON_KEY` if used later.

**Policy pages required (static content):** Privacy Policy (mentions cookies/ads), Affiliate Disclosure, Terms, Contact.  

---

## 4) Repository structure (LLM should scaffold this)
- `/content/`  
  - `/deals/` (daily Markdown posts, one per day)  
  - `/guides/` (evergreen Markdown posts)  
- `/data/`  
  - `deals-today.json` (fresh normalized product data)  
  - `retailers.json` (list of endpoints, parsers, affiliate rules)  
- `/llm/`  
  - `prompts/` (prompt templates as plain text)  
  - `guards/` (regex and JSON validation specs)  
- `/scripts/`  
  - `fetch/` (retailer fetchers, normalizers, dedupers)  
  - `generate/` (LLM orchestration: deal roundups, guides)  
  - `validate/` (price/link consistency checks, content lint)  
  - `publish/` (front-matter stamping, collections, index regeneration)  
- `/site/` (Eleventy/Astro project: layouts, partials, sitemap/rss config)  
- `/.github/workflows/` (scheduled pipelines)
- `/public/` (static assets; ad script slot; robots.txt)

---

## 5) Data ingestion & normalization (what to implement)
**Goal:** Pull a small but reliable set of public product data daily, normalize it, and store as `data/deals-today.json`.

**Sources (start simple, expand later):**
- Retailer public deal/RSS pages allowed by robots.txt.
- Manufacturer “sale” pages that list price and previous price.
- Amazon PA API only after 3 sales (until then, link to public product pages with affiliate tag added).

**Normalization schema for each product:**
- `id` (stable slug), `title`, `brand`, `category`
- `url` (final affiliate URL), `image_url`
- `price_current`, `price_prev` (if available), `discount_pct` (computed)
- `rating` (if available), `reviews_count` (optional)
- `retailer`, `last_seen_utc`

**Deduping logic:**
- Normalize titles (lowercase, remove punctuation, size/color variants in parentheses).
- Fuzzy match within brand+title window to avoid duplicates across sources.
- Keep the *best* (largest discount) per product per day.

**Compliance guardrails:**
- Respect robots.txt, rate limits, no login-wall scraping.
- Store source URL and timestamp for traceability.

---

## 6) Affiliate & link handling (what to implement)
- Build a **link builder** that, given a base product URL and a retailer, returns a compliant affiliate URL:
  - For Amazon: append `tag=AMAZON_ASSOC_TAG` and preserve canonical path.
  - For other networks (CJ/ShareASale): read `retailers.json` mapping for parameter names.
- Add a **footer disclosure** and an inline note on relevant pages.
- Add Amazon **OneLink** or geolocation redirection later (optional).

---

## 7) LLM orchestration (prompts, outputs, guardrails)
**Content types:**
1) **Daily Deals Post** (Markdown):  
   - Title format: “Home Gym Deals — <Full Month Name> <Day>, <Year>”  
   - Intro: 2–3 short sentences about savings and update cadence.  
   - For each top N deals (e.g., 7):  
     - H2: Product name + short benefit phrase.  
     - One paragraph: what it is, current price, previous price, computed discount, 1–2 concrete features.  
     - One short bullet list of who it’s good for (space, budget, training style).  
     - “View deal” line with the affiliate link.  
   - Outro: 1 short “tip of the day” line; price-change disclaimer.
2) **Evergreen Guide** (Markdown):  
   - Title: keyword-rich, no clickbait.  
   - Sections: buying criteria, best picks (pull top rated from normalized pool), pros/cons, space/budget scenarios, maintenance tips.  
   - “How we pick” methodology section (transparency).  

**Prompt requirements (LLM must implement):**
- Always state: *“Use ONLY the provided structured data for prices, discounts, ratings. Do NOT invent figures.”*
- Output strictly in Markdown with H2/H3, short paragraphs, and bullet lists.
- Use friendly, neutral tone. No medical/health claims. No “best ever” superlatives unless justified by data points we provide (e.g., highest discount).
- Include provided affiliate links exactly, do not rewrite URLs.

**Post-generation guards (LLM must build validators):**
- Verify every price/discount string in Markdown matches the JSON data.
- Verify each outbound link matches expected retailer domain and contains affiliate params.
- Reject output if it contains fabricated specs (numbers not in data); re-prompt with a stricter instruction.
- Enforce max length: deals post ~800–1200 words; guide ~1200–1800.

---

## 8) Static site implementation (what to configure)
- Global layout: clean typography, mobile-first, sidebar slot for ad unit, in-content ad slot after first section.
- Components/partials the LLM should create: header, footer (with disclosures), nav, card for each deal item, related posts.
- **SEO:** unique `<title>` and meta description per page; canonical URL; Open Graph tags; JSON-LD where appropriate (Article).
- **Feeds:** auto-generated sitemap.xml and RSS for `/deals/`.
- **Performance:** lazy-load images; compress; ensure LCP under 2.5s on mobile; avoid heavy client JS.

---

## 9) CI/CD automation (what the workflows must do)
**Nightly workflow (UTC 02:00, daily):**
1) Fetch + normalize product data → write `data/deals-today.json`.  
2) Generate “Daily Deals” Markdown using LLM prompt.  
3) Validate content (links, numbers).  
4) Save under `/content/deals/YYYY-MM-DD.md` and update homepage index.  
5) Rebuild static site; commit content changes.  
6) Push to main → Cloudflare Pages auto-deploy.

**Weekly workflow (UTC 03:00, Mondays):**
1) Pick a guide topic from a curated list (LLM can maintain a backlog file with priorities).  
2) Aggregate supporting data (ratings, top sellers).  
3) Generate guide Markdown; validate.  
4) Save under `/content/guides/<slug>.md`; rebuild; deploy.

**On failure:** notify via email/Slack webhook; automatically retry once with exponential backoff.

---

## 10) Ads, analytics, and policies (what to set up)
- Insert AdSense code in layout after approval; enable auto-ads initially.
- Create and link Privacy Policy, Terms, Contact, and Affiliate Disclosure from footer.
- Add Google Search Console and Bing verification meta tags.
- Add basic analytics (Cloudflare Analytics or lightweight script). Avoid invasive tracking.

---

## 11) Best-practice rules the LLM must enforce
- **Accuracy over verbosity:** never invent prices/specs; if missing, omit rather than guess.
- **Short, scannable writing:** 2–3 sentence paragraphs, bullets, descriptive headings.
- **Accessibility:** alt text for images (derived from title + brand), proper heading hierarchy, sufficient contrast.
- **Ethics & compliance:** clearly mark affiliate links, avoid misleading claims, respect site robots and TOS.
- **Content uniqueness:** no near-duplicate daily posts—vary intros and “who it’s for” bullets.

---

## 12) QA checklist (run on every publish)
- Sitemap contains new URLs; robots.txt present; canonical tags correct.
- All affiliate links resolve with correct params; no broken links.
- Page passes HTML validation and has exactly one H1.
- LCP and CLS within Core Web Vitals thresholds (mobile).
- No policy violations in copy (e.g., health claims, deceptive pricing).
- Prices in copy equal JSON values; discount math correct.

---

## 13) Roadmap (month 0 → month 3)
**Week 1:** scaffold repo, static site, policy pages, placeholders; connect Cloudflare Pages; add Search Console.  
**Week 2:** implement fetch/normalize; generate first deals post manually via LLM prompt; wire validations; commit & deploy.  
**Week 3:** schedule nightly workflow; seed 10 evergreen guides; apply for AdSense.  
**Week 4–8:** tighten prompts, expand sources, add related posts, improve internal links; light community sharing for first affiliate clicks.  
**By day 60:** daily autoposts stable; 15+ guides; AdSense live.

---

## 14) Growth levers (no manual “selling”)
- Expand sources (more retailers’ public deal pages).
- Topic backlog driven by Search Console queries (LLM reads CSV exports; proposes guide topics).
- Add lightweight “Top Discounts” index page updated daily.
- Consider geolocation-aware affiliate redirects later (optional).

---

## 15) Maintenance expectations (minimal)
- Monthly: review prompts; update retailer mappings; scan for expired links.
- Quarterly: refresh top 10 guides; check Core Web Vitals; adjust ad density if needed.
- When Amazon PA API becomes available (post 3 sales): switch source integration for richer data.

---

## 16) Risk management
- **Data source churn:** maintain multiple sources; graceful degradation if a source fails.
- **LLM drift:** pin model version where possible; keep prompts under version control; add fallback “short template” if API errors.
- **Policy changes:** keep policy pages templated; update as networks revise rules.
- **Indexing setbacks:** ensure unique titles/descriptions; keep publishing cadence steady.

---

## 17) Deliverables the LLM must produce
- A fully initialized Node project with scripts described above (no placeholders).
- Static site with production-ready layouts, pages, and feeds.
- Two GitHub Actions workflows (nightly, weekly) configured and passing.
- Prompt templates (daily deals, evergreen guide) stored under `/llm/prompts/`.
- Validator specs and tests under `/scripts/validate/`.
- Retailer mapping file with at least 2–3 initial sources and affiliate param rules.
- Documentation (`README.md`) including runbooks, env var setup, and incident playbook.

---

## 18) Non-functional requirements
- Build under 2 minutes in CI; deploy under 3 minutes.
- Lighthouse performance ≥ 90 on mobile for top pages.
- Zero PII collection; cookie banner only if using analytics needing consent in relevant regions.
- All external calls time out responsibly; retries with jitter; logs concise.

---

## 19) What **not** to do
- No scraping behind paywalls or violating robots.txt.
- No copying competitor text; no spun content; no fake reviews.
- No hard-coding affiliate IDs in source files—use env vars.
- No infinite scrolling or heavy client frameworks—keep it static and fast.

---

## 20) Final instruction to the developer-LLM
Implement each section above **in order**, creating files, scripts, prompts, templates, and workflows as specified. After initial deployment, run a full dry-run of both workflows, validate output against guards, submit sitemap to Search Console, and leave the system to operate autonomously with scheduled runs.