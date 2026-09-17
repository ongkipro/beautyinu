# Beautyinu Storefront — Current System Status

> Canonical live status for the Beautyinu Headless Storefront.
> Last verified: 2026-09-17 (Post-Deploy verification on live production).

---

## 1. System Health & Deployment State

| Dimension | Status | Target / Endpoint | Evidence / Verification |
|---|---|---|---|
| **Production Storefront** | 🟢 Healthy (200 OK) | `https://beautyinu.co` | Live curl verified, SSR streaming active |
| **Custom Checkout Domain** | 🟢 Configured | `https://checkout.beautyinu.co` | Set in `.env`, CSP `connectSrc`, and Hydrogen client |
| **Customer Account Domain** | 🟢 Configured | `https://account.beautyinu.co` | New Customer Account API URL + fallback redirect |
| **XML Sitemap** | 🟢 100% Populated | `https://beautyinu.co/sitemap.xml` | Direct `<urlset>` containing all 35 URLs |
| **Robots Directives** | 🟢 Compliant | `https://beautyinu.co/robots.txt` | Explicit Sitemap link + crawler delay/disallow rules |
| **Meta Robots / Googlebot** | 🟢 Explicit | All routes | `index, follow, max-image-preview:large` |
| **Author & Publisher** | 🟢 Validated | All routes & articles | `<meta name="author">`, `<meta name="publisher">` |
| **Merchant Rich Schemas** | 🟢 Validated | PDP & Organization | `shippingDetails` + `hasMerchantReturnPolicy` |
| **Content Security Policy** | 🟢 Verified | Edge headers | Google Fonts (`style-src` & `font-src`) whitelisted |
| **TypeScript / Typegen** | 🟢 0 Errors | `npm run typecheck` | React Router typegen & TSC pass cleanly |
| **Production Build** | 🟢 0 Errors | `npm run build` | Oxygen worker bundle (782 kB) compiles cleanly |
| **CI/CD Oxygen Workflow** | 🟢 Passing | GitHub Actions | Automated build & deploy on push to `main` |

---

## 2. Completed Milestones & Feature Registry

### A. Commercial Experience & UI/UX Polish
- [x] **Hero Slider**: Responsive high-resolution WebP hero banners for mobile and desktop, zero CLS.
- [x] **CategorySplit**: Dual master board cards (`rounded-2xl`) with clear visual hierarchy.
- [x] **Mobile Sticky Add to Cart**: Refined medal floating bar (`sm:hidden`, `bg-white/70 backdrop-blur-2xl`, frameless product thumbnail).
- [x] **PDP Social Proof**: Single-line compact metadata (`⭐ 4.9 (1.8k+) · Terjual 10k+ · BPOM Resmi`).
- [x] **Breadcrumbs**: Mobile-aware dynamic truncation (`max-w-[120px] truncate`), frosted glass pills, Schema.org breadcrumbs.
- [x] **Shopee Verified Reviews**: Real verified customer reviews, 5-star distribution bars, photo reviews.
- [x] **Metafield Accordions**: Dynamic BPOM registration numbers, full INCI ingredients, and usage directions.
- [x] **Predictive Search Popover**: Live product, collection, and query suggestions with instant search drawer.

### B. Editorial Journal (The Journal)
- [x] **Medium-Style Layout**: High-readability editorial typography, reading time estimates, table of contents.
- [x] **Author Showcase**: Dedicated Aisyah Putri (Official Research Team) author profile with authentic avatar and credentials.
- [x] **Mobile Reading Progress Bar**: Real-time scroll indicator on mobile.
- [x] **Floating Share Action**: Frosted pill with native Web Share API and clipboard fallback.

### C. SEO & Search Engine Dominance
- [x] **Comprehensive `/sitemap.xml`**: Populated with 35 real store URLs (Homepage, Catalog, Products, Collections, Articles, CMS Pages).
- [x] **Meta Tags Pipeline**: Author, Publisher, Canonical, OpenGraph, Twitter, and explicit Robots/Googlebot tags on every route.
- [x] **Google Merchant Schemas**: `OfferShippingDetails` (free shipping Indonesia, 0-1d handling, 1-4d transit) and `MerchantReturnPolicy` (7-day unboxing guarantee).
- [x] **Price Validity**: `priceValidUntil` set to +1 year to clear Rich Results testing warnings.

---

## 3. Active Configuration & Secrets Hygiene

- **Storefront Access Token**: Configured via environment variables (`PUBLIC_STOREFRONT_API_TOKEN`).
- **Store Domain**: `p1d3wg-6i.myshopify.com`.
- **Public Checkout Domain**: `checkout.beautyinu.co`.
- **Customer Account Domain**: `account.beautyinu.co`.
- **Secrets Protocol**: No secrets in source control. `.env` is strictly gitignored; `.env.example` contains only template placeholders.
