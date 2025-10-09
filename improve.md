PlateDrop Site Audit
Overview

PlateDrop (https://platedrop.fit
) is an automated home‑gym deals site that mixes a daily deals front page with evergreen buying guides and an FAQ. I reviewed the live pages.dev build because the primary domain blocked direct access through the crawler. The home page offers “Today’s Featured Deals” with price comparisons, savings and a disclaimer noting that prices may change and that the site earns commissions via affiliate links
platedrop.pages.dev
. Guides cover topics like home‑gym setup and power‑rack buying, and there’s a long FAQ answering equipment and purchasing questions. The “About” page explains the mission and emphasises transparency and data‑driven deal validation
platedrop.pages.dev
. The footer contains links to legal pages (Privacy Policy, Terms of Service and Affiliate Disclosure) and a contact page, and includes the required Amazon Associates disclosure
platedrop.pages.dev
. However, several key pages and files (legal pages, sitemap, ads.txt) are missing or inaccessible.

Critical Issues (Compliance & UX)
Issue	Evidence & Impact	Recommended Fix
Missing legal pages	The footer links to Privacy Policy, Terms of Service and Affiliate Disclosure, but all three routes return 404 pages
platedrop.pages.dev
,
platedrop.pages.dev
. Without accessible disclosures, the site breaches Amazon Associates terms and consumer law.	Create comprehensive pages for Privacy Policy, Terms of Service and Affiliate Disclosure. Link them correctly in the footer. The Affiliate Disclosure must clearly state that PlateDrop earns from qualifying purchases on Amazon and other retailers.
Robots file points to unavailable sitemap	robots.txt allows crawling and points to https://platedrop.fit/sitemap.xml 
platedrop.pages.dev
, but this sitemap can’t be retrieved from either the .fit or .pages.dev domain (returns a redirect or 404).	Generate an XML sitemap listing all pages (home, FAQ, guides, hub/category pages, contact, legal pages) and host it at the same domain indicated in robots.txt. Submit it in Google Search Console.
ads.txt missing	There is no /ads.txt on either domain. Sites displaying ads should have an ads.txt file listing authorised sellers. Absence may reduce ad revenue and violate program policies.	Publish an ads.txt file listing authorised advertising partners (e.g., Google AdSense) and reference it in the ad network’s console.
Broken category pages	The home page’s “Shop by Category” links (e.g., /deals?category=racks, /deals?category=dumbbells) lead to 404 pages
platedrop.pages.dev
. Users and search engines can’t browse category‑specific deal listings.	Build dedicated hub pages for each category (e.g., /racks/, /dumbbells/) or ensure the /deals route loads category‑filtered results. Make sure each hub has unique content, a single <h1>, proper titles and internal links to relevant guides and deals.
Guides lack SEO meta tags and structured data	The home‑gym setup guide’s HTML shows a title and meta description of “undefined”
platedrop.pages.dev
, and uses WebPage instead of Article schema. This harms SEO and rich results eligibility.	Add meaningful <title> and <meta name="description"> tags to each guide. Implement Article schema (@type: Article) with headline, description, datePublished, author and mainEntityOfPage.
Missing Editorial Policy	There is no page explaining content creation, fact‑checking or independence.	Draft an editorial policy explaining how deals and guides are created, including sources used, editorial independence, and update frequency. Link it in the footer.
Unavailable RSS feed	The site links to /rss.xml but that route returns a 404. Subscribers cannot track new deals.	Generate a valid RSS feed for the daily deals posts and expose it at /rss.xml.
Daily deals may be too short	The home page functions as the daily post and contains limited descriptive text and product blurbs. It may not meet the guideline of ~800 words of scannable content per post.	Expand the daily deals page with a brief introduction (what’s new today, notable deals) and at least several paragraphs of context (~800 words), ensuring it remains scannable with sub‑headings and bullets.
SEO & Content Opportunities

Unique title/meta on every page – The guides should have descriptive titles (e.g., “Complete Home Gym Setup Guide – PlateDrop”) and unique meta descriptions summarising the content. Duplicate or undefined tags hinder CTR
platedrop.pages.dev
.

Use ItemList and Product schema for deals – The home page lists multiple products but only individual Product structured data is present; there is no ItemList summarising the list. Adding an ItemList with list items pointing to each Product improves search understanding. Similarly, guides with Q&A sections (e.g., FAQ) should use FAQPage schema.

Better internal linking – Guides mention other guides but there is no reciprocal linking from daily deals or hub pages back to guides. Use contextual anchor text to link to related content (e.g., from a power‑rack deal to the power‑rack guide). Ensure hub pages link to at least two related guides.

“Who it’s for” sections – The guides provide pros/cons lists but could benefit from a concluding section explaining which users each product/setup suits, making purchase decisions easier and meeting the brief. For example, in the Home Gym Setup Guide the “Location Options” section lists pros and cons of garage, basement, spare room and outdoor setups
platedrop.pages.dev
—adding a “Who each option is best for” summary would satisfy the requirement.

Add update dates – To reinforce freshness, include a datePublished and dateModified on posts and display a “last updated” note. This helps Amazon Associates and searchers trust the information.

Alt text for all images – Many product images use generic Unsplash photos. Ensure alt attributes describe the product (e.g., “Rogue Ohio Barbell”) to aid accessibility and improve image search visibility.

Indexing & Technical SEO

One <h1> per page – Check templates to ensure each page only uses one <h1>. The current pages appear to follow this rule (e.g., the FAQ has one <h1> heading
platedrop.pages.dev
). Verify in HTML once the templates are updated.

Canonical URLs – The canonical tags point to the .fit domain even when content is served from .pages.dev
platedrop.pages.dev
. When the .fit domain is accessible, make sure it serves the same content and that canonical URLs match the served domain to avoid duplicate content issues.

Implement IndexNow – Since the site uses Cloudflare pages, enable IndexNow pinging so that updates to deals and guides are quickly discovered by search engines. Submit the sitemap in Google Search Console and monitor indexing coverage.

User Experience & Performance

Lazy‑load images & reserve space for ads – The site already lazy‑loads product images. When implementing ads, reserve space to avoid layout shifts. Aim for a Largest Contentful Paint (LCP) under 2.5 s on mobile.

Accessible design – Maintain high color‑contrast ratios and provide visible focus rings for keyboard users. Include skip‑to‑content links, as currently implemented
platedrop.pages.dev
.

Contact responsiveness – The contact page lists multiple support emails and promises responses within 24–48 hours
platedrop.pages.dev
. Ensure these addresses are monitored. Add a contact form to capture inquiries more easily.

Readiness to Apply to Amazon Associates

PlateDrop displays many of the hallmarks Amazon expects from an affiliate site: the front page contains actual deals with direct links to Amazon product pages and a price disclaimer; the footer includes a site‑wide Amazon Associates disclosure
platedrop.pages.dev
, and the “About” page emphasises transparency and that commissions do not influence recommendations
platedrop.pages.dev
. The guides are detailed and present pros and cons of equipment choices (e.g., evaluating different gym locations
platedrop.pages.dev
 and rack types
platedrop.pages.dev
). However, the absence of functional privacy policy, terms of service and affiliate‑disclosure pages is a major compliance gap. Resolving these legal pages, fixing broken category links, adding a sitemap and RSS feed, and improving meta/structured data are critical steps before submitting the site to Amazon Associates.