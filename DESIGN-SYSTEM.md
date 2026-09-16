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
| **Frame / Feature Container** | `rounded-2xl` | `16px` | Section feature boards (`CategorySplit` master cards, Hero canvas) | Never use `rounded-3xl` (24px) |
| **Card / Milestone / Review** | `rounded-xl` / `rounded-2xl` | `12px` / `16px` | Product cards, Clinical actives cards, Timeline cards, Review testimonial cards | Never use bloated pill borders |
| **Interactive Buttons (CTA)** | `rounded-xl` | `12px` | Primary action buttons (`Lihat Produk`, `Beli Sekarang`, `Add to Cart`, `Follow @beautyinu.id`, Hero dual CTAs) | Avoid `rounded-full` capsules for text buttons |
| **Media / Image Viewports** | `rounded-xl` / `rounded-lg` | `12px` / `8px` | Product image thumbnails, feed photo viewports, gallery tiles | Never `rounded-3xl` |
| **Pills / Status / Micro-Badges** | `rounded-lg` / `rounded-md` | `8px` / `6px` | Formula tags, BPOM status chips, discount tags (`Hemat 35%`), active ingredient chips | Avoid circular bloated capsules |
| **Strict 1:1 Circular Only** | `rounded-full` | `50%` | Only true 1:1 square icon buttons (`w-10 h-10` carousel nav arrows `< >`, close `X`, slide indicator dots) | Never use for rectangular buttons or text labels |

---

## 3. Component Radius Blueprint

### A. Buttons & Interactive CTAs
```tsx
// Primary CTA (Dark or Brand Color)
<button className="px-6 py-3 rounded-xl bg-[#1A1A1A] hover:bg-black text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all">
  <span>Lihat Produk Satuan</span>
  <ArrowRight className="w-4 h-4" />
</button>

// Secondary / Ghost CTA
<Link className="px-6 py-3 rounded-xl bg-white hover:bg-[#FAF8FC] text-text border border-black/10 text-xs sm:text-sm font-bold shadow-xs transition-all">
  <span>Lihat Semua Paket</span>
</Link>
```

### B. Cards & Feature Panels
```tsx
// Master Category Split Cards (16px radius)
<div className="group relative rounded-2xl overflow-hidden min-h-[420px] p-7 sm:p-10 border border-black/[0.06] shadow-xs">
  {/* Full-bleed background with gradient overlay */}
</div>

// Product Card & Actives Card (16px outer, 12px image)
<div className="bg-white rounded-2xl p-4 sm:p-5 border border-black/[0.06] shadow-xs">
  <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3.5">
    {/* Product image */}
  </div>
</div>
```

### C. Badges & Tags
```tsx
// Clinical Spec / Step Badge (6px - 8px radius)
<span className="text-[11px] font-mono font-bold text-accent bg-accent-light px-2.5 py-0.5 rounded-md border border-accent/20">
  Formula 01
</span>

// Quality Certification Tag (8px radius)
<div className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg bg-[#FAF8FC] text-text border border-black/[0.06]">
  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
  <span>Resmi BPOM RI</span>
</div>
```

---

## 4. Anti-Slop Enforcement Checklist
- [x] No `rounded-3xl` anywhere in the codebase.
- [x] No rectangular text buttons using `rounded-full` capsules (reserved only for 1:1 circular navigation buttons).
- [x] No `Sparkles` or magic star icons inside pill kickers.
- [x] No 3D pushpins, tilted/rotated post-it notes, or fake percentage meter bars.
- [x] Baseline alignment: all adjacent cards share unified vertical heights and matching baselines.
