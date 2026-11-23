# onlinegames.stream — Action Plan & SEO Growth Strategy

**Target**: [https://onlinegames.stream/](https://onlinegames.stream/)  
**Goal**: Rapid indexing, top organic search visibility, and maximum citation share across AI engines (Google AI Overviews, ChatGPT Search, Perplexity, Claude, Gemini).

---

## 1. Immediate Implementation (Completed)

All foundational technical, architectural, and SEO fixes have been implemented directly in the codebase:

- [x] **Brand Migration**: Replaced all mentions of "Quenq" and "The Quenq Apps" across 61 files with `onlinegames.stream`.
- [x] **Sub-menu Toggle System**: Created collapsible sidebar sections in `arcade/index.html` with animated chevrons and `localStorage` state persistence.
- [x] **Accurate Thumbnails**: Corrected CDN thumbnail rendering bug in `js/arcade.js` and added high-res artwork mappings for all top standalone apps.
- [x] **AI Crawler Access (GEO)**: Explicitly allowed all 11 major AI bot crawlers in `robots.txt`.
- [x] **AI Knowledge Index**: Published `llms.txt` (scored 100/100) and `llms-full.txt` for generative engine ingestion.
- [x] **XML Sitemap**: Created and linked `sitemap.xml` with 53 canonical URLs and priority weights.
- [x] **Schema.org Structured Data**: Integrated valid WebSite, SearchAction, Organization, CollectionPage, and BreadcrumbList JSON-LD markup.
- [x] **A11y & Heading Structure**: Standardized to a single primary H1 per page, added `<main>` landmarks, and labelled interactive inputs.

---

## 2. 30-Day Launch & Indexing Plan

### Week 1: Search Engine Submission & Verification
1. **Google Search Console**:
   - Add property `https://onlinegames.stream/` (Domain verification via DNS TXT record).
   - Submit sitemap: `https://onlinegames.stream/sitemap.xml`.
   - Use URL Inspection tool on `https://onlinegames.stream/`, `https://onlinegames.stream/arcade/`, and `https://onlinegames.stream/apps/reborn-xp/` to request priority indexing.
2. **Bing Webmaster Tools**:
   - Import verification directly from Google Search Console.
   - Submit sitemap and enable IndexNow for instant URL updates.

### Week 2: AI Search Engine Discovery (GEO)
1. **Perplexity Indexing**:
   - Submit `https://onlinegames.stream/llms.txt` to Perplexity via exploratory queries (e.g., `"Where can I play classic Flash games and Reborn XP online without downloads?"`).
2. **ChatGPT & Claude Knowledge Verification**:
   - Verify that citations link back to `onlinegames.stream` when querying top standalone apps (Minecraft browser port, Slope 3D, Reborn XP simulator, Moto X3M).

### Week 3: Target Keyword Cluster Expansion
Focus on high-volume, low-competition keywords in the browser gaming niche:
- **Primary Keywords**:
  - `free online games no download`
  - `unblocked games for school`
  - `play crazygames online`
  - `play flash games in browser 2026`
  - `windows xp simulator online`
  - `moto x3m unblocked`
  - `slope 3d online game`
  - `minecraft classic browser edition`
  - `doom 1993 wasm web port`

### Week 4: Link Building & Community Seeding
1. **GitHub Repository**:
   - Update repository description, homepage URL (`https://onlinegames.stream/`), and topics (`online-games`, `flash-preservation`, `html5-games`, `ruffle-emulator`, `windows-xp-simulator`, `webassembly`).
2. **Gaming & Preservation Directories**:
   - Submit to curated directories (Flashpoint archive partners, Hacker News Show HN, Product Hunt, Reddit r/webgames, r/flash, r/retrogaming).

---

## 3. 60-Day Scaling & Content Optimization

1. **Dedicated Landing Pages for High-Volume Queries**:
   - Generate dedicated static landing pages for top 50 searched games (e.g., `/games/moto-x3m/`, `/games/slope/`, `/games/smash-karts/`) featuring:
     - Embedded playable frame
     - How to play instructions & control cheat sheet
     - `VideoGame` Schema.org JSON-LD markup
     - Related games recommendation strip
2. **Rich Snippets Enhancement**:
   - Add `SoftwareApplication` / `VideoGame` aggregate rating schema to standalone games to earn star review ratings in Google SERP results.
3. **Social Preview Optimization**:
   - Generate custom Open Graph social share cards (1200x630) for individual standout titles using consistent branding.

---

## 4. 90-Day Authority & Performance Monitoring

1. **Core Web Vitals Tracking**:
   - Monitor Largest Contentful Paint (LCP < 2.0s), Interaction to Next Paint (INP < 150ms), and Cumulative Layout Shift (CLS < 0.05).
   - Leverage Cloudflare / Vercel Edge caching for sub-50ms TTFB worldwide.
2. **AI Citation Audits**:
   - Run monthly checks using the `geo-audit` and `geo-brand-mentions` skills to measure brand share of voice in AI answer engines.
3. **Keyword Position Tracking**:
   - Track ranking trajectory across Google, Bing, and DuckDuckGo for primary keyword clusters.
