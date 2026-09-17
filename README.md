# Beautyinu — Headless Commerce Storefront

> Production Headless Storefront for **Beautyinu (CV. DINARE ANUGRAH KOSMETIKA)**.
> Built with Shopify Hydrogen 2026, React Router v7, and deployed globally on Shopify Oxygen edge workers.

---

## 1. Quick Overview

- **Live Storefront**: [beautyinu.co](https://beautyinu.co)
- **Custom Checkout**: `checkout.beautyinu.co`
- **Customer Accounts**: `account.beautyinu.co`
- **Shopify Store Domain**: `p1d3wg-6i.myshopify.com`
- **Design System**: Tailwind CSS v4, custom brand palette (`#F97F9E`, `#AF8FD1`, `#FFF8FA`), Playfair Display & Plus Jakarta Sans typography.

---

## 2. Core Features & Capabilities

- **High-Conversion eCommerce**:
  - Responsive WebP hero banners with zero layout shift (CLS).
  - Clean product detail page (PDP) with single-line social proof & official BPOM badges.
  - Mobile-only floating "Medal" sticky Add to Cart bar with frosted glass effect.
  - Verified Shopee customer reviews with rating breakdown and verified badges.
  - Dynamic product metafield accordions (BPOM details, INCI ingredients, usage).
  - Predictive live search popover and full search catalog.
- **Editorial Hub (The Journal)**:
  - Medium-style typography and distraction-free longform reading experience.
  - Author profile attribution (Aisyah Putri & Tim Riset Beautyinu).
  - Reading progress indicator and mobile-friendly floating share drawer.
- **Advanced Technical SEO & Schema.org**:
  - Unified, directly populated `/sitemap.xml` with 35 store URLs.
  - Granular robots directives (`[robots.txt].tsx`) and explicit `<meta name="robots">`.
  - Google Merchant Rich Schemas: `OfferShippingDetails` (Free Shipping Indonesia, 0-1d handling, 1-4d transit) and `MerchantReturnPolicy` (7-day unboxing guarantee).
  - Full structured data graph: `Organization`, `WebSite`, `Product`, `Offer`, `AggregateRating`, `BlogPosting`, `BreadcrumbList`, and `FAQPage`.
- **Security & Headers**:
  - Strict Content Security Policy (CSP) with nonce generation and whitelisted Google Fonts & Shopify CDN endpoints.

---

## 3. Development Workflow

### Prerequisites
- Node.js `22.x` or `24.x`
- npm `10+`

### Setup
```bash
# Clone the repository
git clone https://github.com/ongkipro/beautyinu.git
cd beautyinu-hydrogen

# Install dependencies
npm install

# Setup local environment
cp .env.example .env
```

### Local Development
```bash
# Start local Hydrogen development server
npm run dev
```

### Typecheck & Build
```bash
# Verify TypeScript & React Router route types
npm run typecheck

# Compile production bundle for Oxygen
npm run build
```

---

## 4. Architecture & Documentation

- [System Map & Architecture](file:///Users/ongki/Projects/beautyinu-hydrogen/ARCHITECTURE.md)
- [Current System Status](file:///Users/ongki/Projects/beautyinu-hydrogen/STATUS.md)
- [Design System & Radius Tokens](file:///Users/ongki/Projects/beautyinu-hydrogen/DESIGN-SYSTEM.md)
- [Changelog & Release Notes](file:///Users/ongki/Projects/beautyinu-hydrogen/CHANGELOG.md)
