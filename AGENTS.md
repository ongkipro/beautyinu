# Beautyinu Hydrogen Development — Agent Guidelines

This is the production Headless Storefront for **Beautyinu (CV. DINARE ANUGRAH KOSMETIKA)**, built on Shopify Hydrogen 2026, React Router v7 framework, and deployed to Shopify Oxygen.

---

## 1. Canonical Repository Documents
- **`ARCHITECTURE.md`**: System map, route matrix, design system pipeline, CSP matrix, and deployment flow.
- **`STATUS.md`**: Real-time system health, live verified milestones, and domain configurations.
- **`DESIGN-SYSTEM.md`**: Architectural radius scale (`rounded-2xl` frame, `rounded-xl` card/btn, `rounded-lg` media, `rounded-md` badge), anti-slop rules, and frosted glass tokens.
- **`README.md`**: Storefront overview, setup, and development commands.
- **`CHANGELOG.md`**: Historical and feature release logs.

---

## 2. Technical Stack & Invariants
- **Framework**: React Router v7 (`react-router`, `@react-router/fs-routes`) + Shopify Hydrogen (`@shopify/hydrogen`).
- **Styling**: Tailwind CSS v4 CSS-first config (`app/styles/tailwind.css`) with `@tailwindcss/vite`.
- **Runtime**: Shopify Oxygen (Cloudflare edge worker environment).
- **Domains**:
  - Storefront: `https://beautyinu.co`
  - Checkout: `https://checkout.beautyinu.co`
  - Customer Accounts: `https://account.beautyinu.co`
  - Store: `p1d3wg-6i.myshopify.com`
- **Content Security Policy**: Configured in `app/entry.server.tsx`. All external assets (Google Fonts `fonts.googleapis.com` & `fonts.gstatic.com`, Shopify CDN) must remain whitelisted.

---

## 3. Strict Design & Code Discipline
- **No Bubbly / AI-Slop UI**: Never use `rounded-3xl` or exaggerated capsule pills for text buttons. Stick strictly to `DESIGN-SYSTEM.md`.
- **Validation**: All changes must pass `npm run typecheck` and `npm run build` before pushing.
- **SEO & Schemas**: Keep `shippingDetails`, `hasMerchantReturnPolicy`, `priceValidUntil`, `robots`, `author`, and `publisher` tags intact on every route.
- **Shopify AI Toolkit**: Use the [Shopify AI Toolkit](https://shopify.dev/docs/apps/build/ai-toolkit) for all Shopify API and platform work.
