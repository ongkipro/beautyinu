# Beautyinu Storefront — System Map & Architecture

> Canonical system architecture and technical map for the Beautyinu Headless Storefront.
> Built on Shopify Hydrogen (Oxygen edge runtime) & React Router v7 framework.

---

## 1. System Map & High-Level Architecture

```mermaid
flowchart TD
  subgraph Clients["Client Surface"]
    Mobile["Mobile Safari / Chrome (Touch-first)"]
    Desktop["Desktop Browsers"]
    Crawlers["Googlebot / Search Crawlers / Social Bots"]
  end

  subgraph Edge["Oxygen Edge Runtime (Cloudflare / Shopify CDN)"]
    CSP["Content-Security-Policy & Security Headers"]
    Router["React Router v7 Framework"]
    SSR["Streaming Server-Side Rendering"]
    Cache["Oxygen Edge Cache (Sub-request caching)"]
  end

  subgraph StorefrontCore["Storefront Core Application"]
    Context["Hydrogen Context (i18n, Cart, Customer Account)"]
    SEOEngine["SEO & Schema Engine (Metadata, JSON-LD, Robots)"]
    DesignSys["Tailwind v4 Design System & Token Scales"]
    SitemapGen["Unified Sitemap & Robots Handler"]
  end

  subgraph Backend["Shopify Commerce & External Services"]
    SFAPI["Shopify Storefront API (GraphQL)"]
    CheckoutDomain["Custom Checkout (checkout.beautyinu.co)"]
    AccountDomain["New Customer Accounts (account.beautyinu.co)"]
    ShopifyCDN["Shopify Asset CDN (Images, Videos, Media)"]
    GoogleFonts["Google Fonts CDN (Playfair, Plus Jakarta Sans)"]
  end

  Clients -->|HTTPS Requests| Edge
  Edge --> CSP
  CSP --> Router
  Router --> SSR
  SSR --> Context
  Context --> SFAPI
  SSR --> SEOEngine
  SSR --> DesignSys
  Router -->|GET /sitemap.xml| SitemapGen
  SitemapGen --> SFAPI
  Context --> CheckoutDomain
  Context --> AccountDomain
  SSR -->|Assets & Webfonts| ShopifyCDN
  SSR -->|Font Stylesheets| GoogleFonts
```

---

## 2. Route Topology & Page Matrix

Beautyinu implements a lean, high-conversion headless eCommerce routing structure:

```mermaid
flowchart LR
  subgraph PublicPages["Public Commercial Routes"]
    Root["/ (Homepage)"]
    PDP["/products/:handle (PDP)"]
    PLP["/collections/:handle (PLP)"]
    AllCat["/collections/all (Full Catalog)"]
    Bundles["/collections/bundles (Routine Sets)"]
    Search["/search (Predictive & Full Search)"]
  end

  subgraph EditorialPages["Content & Journal"]
    BlogIndex["/blogs/:blogHandle (Skincare Journal)"]
    Article["/blogs/:blogHandle/:articleHandle (Medium-style)"]
  end

  subgraph UtilityPages["Operational & Policies"]
    Pages["/pages/:handle (FAQ, About, Distributor)"]
    Policies["/policies/:handle (Terms, Privacy, Shipping)"]
    Cart["/cart (Cart Drawer & Dedicated Route)"]
  end

  subgraph HeadlessEndpoints["SEO & Meta Endpoints"]
    Sitemap["/sitemap.xml (Comprehensive urlset)"]
    Robots["/robots.txt (Crawler Directives)"]
  end
```

### Detailed Route Specifications

| Path | File | Purpose | Data Queries | Key Features |
|---|---|---|---|---|
| `/` | `app/routes/_index.tsx` | Brand flagship landing page | Hero slides, Category splits, Actives, Bundles, Best Sellers | Responsive WebP slider, 3-step routine cards, Social proof |
| `/products/:handle` | `app/routes/products.$handle.tsx` | Product detail page | Single product, variants, metafields, recommendations | Dynamic media gallery, mobile medal sticky CTA, Shopee reviews |
| `/collections/:handle` | `app/routes/collections.$handle.tsx` | Category archive | Collection products, pagination | Frosted category tags, sort dropdown, quick-add cards |
| `/collections/all` | `app/routes/collections.all.tsx` | Master store catalog | All active products | Filter chips, sort selector, responsive product grid |
| `/blogs/:blogHandle` | `app/routes/blogs.$blogHandle._index.tsx` | Editorial hub | Blog articles, pagination | Medium-style editorial concept, author spotlight, search tags |
| `/blogs/:blogHandle/:articleHandle` | `app/routes/blogs.$blogHandle.$articleHandle.tsx` | Longform article | Single article, author, related articles | Reading progress bar, TOC, floating share pill, clinical table |
| `/pages/:handle` | `app/routes/pages.$handle.tsx` | CMS & informative | Shopify Page resource | FAQ accordions, Distributor portal, About story |
| `/sitemap.xml` | `app/routes/[sitemap.xml].tsx` | Unified XML sitemap | Storefront `sitemap(type: ...)` | 100% direct `<urlset>` (35 URLs) with lastmod, changefreq, priority |
| `/robots.txt` | `app/routes/[robots.txt].tsx` | Search bot directives | Dynamic host detection | Sitemap linkage, disallow internal search, bots rate limiting |

---

## 3. Design System & Styling Architecture

Beautyinu uses **Tailwind CSS v4** with a pure CSS-first configuration:

```mermaid
flowchart TD
  subgraph StylingPipeline["Tailwind v4 Compilation Pipeline"]
    Vite["Vite 8 + @tailwindcss/vite"]
    TailwindCSS["app/styles/tailwind.css"]
    AppCSS["app/styles/app.css"]
    OutputCSS["dist/client/assets/tailwind-*.css (122kB gzip 18kB)"]
  end

  subgraph DesignTokens["Architectural Token Hierarchy"]
    Colors["Brand Palette (Primary: #F97F9E, Accent: #AF8FD1, Surface: #FFF8FA)"]
    RadiusScale["Radius Scale (2xl: 16px frame, xl: 12px card/btn, lg: 8px tag)"]
    Typography["Typography (Serif: Playfair / DM Serif, Sans: Plus Jakarta Sans)"]
    Glassmorphism["Frosted Glass (backdrop-blur-md/xl/2xl, white/70 - white/95)"]
  end

  TailwindCSS --> OutputCSS
  AppCSS --> OutputCSS
  Vite --> OutputCSS
  DesignTokens --> TailwindCSS
```

### Radius Token Hierarchy (Anti-Slop Standard)
- **Container / Modal Frame**: `rounded-2xl` (`16px`)
- **Product Card / CTA Button**: `rounded-xl` (`12px`)
- **Internal Thumbnail / Sub-container**: `rounded-lg` (`8px`)
- **Micro Badge / Formula Tag**: `rounded-md` (`6px`)
- **Strict 1:1 Circular Only**: `rounded-full` (nav arrows, slide dots, floating close button)

---

## 4. Content Security Policy (CSP) Whitelist Matrix

Configured in `app/entry.server.tsx` via `@shopify/hydrogen`'s `createContentSecurityPolicy`:

| Directive | Permitted Sources | Rationale |
|---|---|---|
| `default-src` | `'self'`, `https://cdn.shopify.com`, `https://shopify.com` | Base platform security |
| `style-src` | `'self'`, `'unsafe-inline'`, `https://cdn.shopify.com`, `https://fonts.googleapis.com` | Local styles + Google Fonts stylesheets |
| `font-src` | `'self'`, `https://fonts.gstatic.com`, `https://cdn.shopify.com`, `data:` | Google Webfonts (Playfair, Plus Jakarta Sans, DM Serif) |
| `img-src` | `'self'`, `https://cdn.shopify.com`, `https://shopify.com`, `data:`, `blob:` | Product media, CDN assets, SVG icons, previews |
| `connect-src` | `'self'`, `https://checkout.beautyinu.co`, `https://account.beautyinu.co`, `https://cdn.shopify.com`, `https://monorail-edge.shopifysvc.com`, Storefront API | Checkout redirection, customer account API, analytics |

---

## 5. SEO & Structured Data (Schema.org) Pipeline

All structured data is generated deterministically in `app/lib/seo.ts`:

```mermaid
flowchart TD
  Loader["Route Loader Data"] --> SEOMeta["getSeoMeta()"]
  SEOMeta --> Tags["Standard Meta Tags (Title, Description, Canonical, OG, Twitter)"]
  SEOMeta --> Robots["Robots & Googlebot Directives (index, follow, max-image-preview:large)"]
  SEOMeta --> AuthorPublisher["Author & Publisher Directives"]
  SEOMeta --> JSONLD["JSON-LD Structured Data Graph"]

  subgraph SchemaTypes["Schema.org Types"]
    Org["Organization (CV. DINARE ANUGRAH KOSMETIKA, hotline, return policy)"]
    WebSite["WebSite (SearchAction potentialAction)"]
    ProductSchema["Product & Offer (SKU, priceValidUntil, AggregateRating)"]
    ShippingDetails["OfferShippingDetails (Handling 0-1d, Transit 1-4d, IDR 0, ID)"]
    ReturnPolicy["MerchantReturnPolicy (7-day finite return window, unboxing policy)"]
    ArticleSchema["BlogPosting (Headline, Person author, Organization publisher)"]
    Breadcrumbs["BreadcrumbList (Dynamic hierarchy with absolute canonicals)"]
  end

  JSONLD --> Org
  JSONLD --> WebSite
  JSONLD --> ProductSchema
  ProductSchema --> ShippingDetails
  ProductSchema --> ReturnPolicy
  JSONLD --> ArticleSchema
  JSONLD --> Breadcrumbs
```

---

## 6. Build, Release & Deployment Pipeline

- **Repository**: `https://github.com/ongkipro/beautyinu`
- **Main Branch**: `main`
- **CI/CD Platform**: GitHub Actions (`.github/workflows/oxygen-deployment-1000180026.yml`)
- **Hosting / Edge Runtime**: Shopify Oxygen (Worker runtime, zero server overhead)
- **Live Production URL**: `https://beautyinu.co`
- **Custom Domains**:
  - Storefront: `https://beautyinu.co`
  - Checkout: `https://checkout.beautyinu.co`
  - Customer Accounts: `https://account.beautyinu.co`
