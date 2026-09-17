# Beautyinu Design System — Geometric Precision & Radius Hierarchy

> Official UI/UX Design System for Beautyinu Hydrogen Storefront.
> Governs layout geometry, border-radius tokens, component hierarchy, and anti-slop rules.

---

## 1. Core Philosophy: Architectural Precision

Beautyinu embraces a modern, high-end Gen-Z & Millennial aesthetic (Rhode, Glossier, Byredo, Somethinc).
- **No Bubbly Chaos**: Never use exaggerated capsule pills or oversized `rounded-3xl` (24px) containers that make the store look like a toy or AI template.
- **Architectural Hierarchy**: Every border-radius has an intentional role in the visual hierarchy:
  - Larger radii for outer framing (`rounded-2xl`).
  - Medium radii for interactive cards & primary buttons (`rounded-xl`).
  - Tighter radii for internal media & controls (`rounded-lg`).
  - Crisp micro-radii for metadata tags & badges (`rounded-md`).

---

## 2. Border Radius Token Scale

| Token | Class | Pixel Value | Permitted Use Cases | Forbidden Uses |
|---|---|---|---|---|
| **Frame / Feature Container** | `rounded-2xl` | `16px` | Section feature boards (`CategorySplit` master cards, Hero canvas, Sticky ATC Medal) | Never use `rounded-3xl` (24px) |
| **Card / Milestone / Review** | `rounded-xl` / `rounded-2xl` | `12px` / `16px` | Product cards, Clinical actives cards, Timeline cards, Review testimonial cards | Never use bloated pill borders |
| **Interactive Buttons (CTA)** | `rounded-xl` | `12px` | Primary action buttons (`Lihat Produk`, `Beli Sekarang`, `Add to Cart`, `Follow @beautyinu.id`, Hero dual CTAs) | Avoid `rounded-full` capsules for text buttons |
| **Media / Image Viewports** | `rounded-xl` / `rounded-lg` | `12px` / `8px` | Product image thumbnails, feed photo viewports, gallery tiles | Never `rounded-3xl` |
| **Pills / Status / Micro-Badges** | `rounded-lg` / `rounded-md` | `8px` / `6px` | Formula tags, BPOM status chips, discount tags (`Hemat 35%`), active ingredient chips | Avoid circular bloated capsules |
| **Strict 1:1 Circular Only** | `rounded-full` | `50%` | Only true 1:1 square icon buttons (`w-10 h-10` carousel nav arrows `< >`, close `X`, slide indicator dots) | Never use for rectangular buttons or text labels |

---

## 3. Specialized Component Blueprints

### A. Mobile Sticky Add to Cart (Floating Medal)
```tsx
// Only appears on mobile after scrolling past hero ATC button
<div className="fixed bottom-4 left-0 right-0 z-40 sm:hidden pointer-events-none px-4">
  <div className="pointer-events-auto w-full max-w-md bg-white/70 backdrop-blur-2xl border border-white/80 ring-1 ring-black/[0.06] shadow-[0_10px_35px_rgba(0,0,0,0.12)] rounded-2xl px-3.5 py-2.5 flex items-center justify-between gap-3 transition-all duration-300">
    {/* Frameless primary thumbnail */}
    <img src={primaryImageUrl} alt={product.title} className="w-11 h-11 object-cover rounded-lg flex-shrink-0" />
    
    {/* Product title & price */}
    <div className="flex-1 min-w-0 pr-1">
      <p className="text-xs font-semibold text-text truncate leading-tight">{product.title}</p>
      <span className="text-xs font-bold text-primary font-mono">{formattedPrice}</span>
    </div>

    {/* Compact action CTA */}
    <AddToCartButton lines={[{merchandiseId: variant.id, quantity: 1}]} className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-xs">
      + Keranjang
    </AddToCartButton>
  </div>
</div>
```

### B. Single-Line PDP Social Proof & Micro-Reassurance
```tsx
// Compact, single-row social proof above product title
<div className="flex items-center gap-2 text-xs text-text-secondary flex-wrap">
  <div className="flex items-center gap-1 text-amber-500">
    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
    <span className="font-bold text-text text-xs">4.9</span>
    <span className="text-[11px] text-text-secondary">(1.8k+)</span>
  </div>
  <span className="text-black/20 text-xs">·</span>
  <span className="text-[11px] font-medium text-text-secondary">Terjual 10k+</span>
  <span className="text-black/20 text-xs">·</span>
  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.2} />
    BPOM NA18...
  </span>
</div>
```

### C. Dynamic Breadcrumb System (Frosted Wayfinding)
```tsx
// Responsive truncation with mobile width constraints
<nav aria-label="Breadcrumb" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/75 backdrop-blur-md border border-black/[0.06] text-xs">
  <Link to="/" className="text-text-secondary hover:text-text flex items-center gap-1">
    <Home className="w-3.5 h-3.5" />
    <span className="hidden sm:inline">Home</span>
  </Link>
  <ChevronRight className="w-3 h-3 text-text-secondary/50" />
  <Link to="/collections/all" className="text-text-secondary hover:text-text">
    Katalog
  </Link>
  <ChevronRight className="w-3 h-3 text-text-secondary/50" />
  <span className="font-semibold text-text max-w-[120px] sm:max-w-[240px] truncate">
    {product.title}
  </span>
</nav>
```

### D. Editorial Medium-Style Journal Layout
- **Author Attribution**: Aisyah Putri & Tim Riset Formulasi Beautyinu.
- **Editorial Metrics**: Reading time estimate (`5 min baca`), publication date, table of contents.
- **Full-Width Hero Media**: Borderless mobile-friendly viewports with intentional captioning.
- **Sticky Actions**: Mobile reading progress line + floating share pill (`Web Share API`).

---

## 4. Anti-Slop Enforcement Checklist
- [x] No `rounded-3xl` anywhere in the codebase.
- [x] No rectangular text buttons using `rounded-full` capsules (reserved only for 1:1 circular navigation buttons).
- [x] No `Sparkles` or magic star icons inside pill kickers.
- [x] No 3D pushpins, tilted/rotated post-it notes, or fake percentage meter bars.
- [x] Baseline alignment: all adjacent cards share unified vertical heights and matching baselines.
- [x] High-performance glassmorphism: `backdrop-blur-md/2xl` with fallback solid tints for older WebKit engines.
