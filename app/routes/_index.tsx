import {Await, useLoaderData, Link} from 'react-router';
import {Suspense, useState, useEffect, useCallback, useRef} from 'react';
import type {Route} from './+types/_index';
import {Image, Money} from '@shopify/hydrogen';
import {ProductCard} from '~/components/ProductCard';
import {ArticleCard} from '~/components/ArticleCard';
import heroSlide1Mobile from '~/assets/hero-slide-1-routine-mobile.webp';
import heroSlide1Desktop from '~/assets/hero-slide-1-routine-desktop.webp';
import heroSlide2Mobile from '~/assets/hero-slide-2-texture-mobile.webp';
import heroSlide2Desktop from '~/assets/hero-slide-2-texture-desktop.webp';
import heroSlide3Mobile from '~/assets/hero-slide-3-cleanse-mobile.webp';
import heroSlide3Desktop from '~/assets/hero-slide-3-cleanse-desktop.webp';
import heroSlide4Mobile from '~/assets/hero-slide-4-booster-mobile.webp';
import heroSlide4Desktop from '~/assets/hero-slide-4-booster-desktop.webp';
import heroSlide5Mobile from '~/assets/hero-slide-5-confidence-mobile.webp';
import heroSlide5Desktop from '~/assets/hero-slide-5-confidence-desktop.webp';
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Flame,
  Star,
  ShieldCheck,
} from 'lucide-react';
import {getSeoMeta, buildOrganizationJsonLd} from '~/lib/seo';

export const meta: Route.MetaFunction = ({data}) => {
  const siteUrl = data?.canonicalUrl || 'https://beautyinu.id';
  return getSeoMeta({
    title: 'Beautyinu — Your Bodycare Bestie',
    description:
      'Brightening bodycare dengan Niacinamide 5.22%, Alpha Arbutin 2.30% & Glutathione. Bersertifikat BPOM RI resmi. 3-step routine untuk kulit tampak cerah, lembap, dan glowing terawat.',
    url: siteUrl,
    type: 'website',
    jsonLd: buildOrganizationJsonLd(siteUrl),
  });
};

export async function loader({context, request}: Route.LoaderArgs) {
  const {storefront} = context;

  const bestSellers = storefront.query(BEST_SELLERS_QUERY, {
    variables: {handle: 'best-sellers'},
  });

  const blogArticles = storefront.query(BLOG_QUERY, {
    variables: {handle: 'news'},
  });

  return {
    bestSellers,
    blogArticles,
    canonicalUrl: new URL(request.url).origin,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="w-full bg-white">
      {/* 1. Hero Section (Proven Skincare Style: Dynamic Headline + Concern Selector) */}
      <Hero />

      {/* 2. Authority & Trust Ticker */}
      <TrustBar />

      {/* 3. The 3-Step Daily Routine System (Core Flagship) */}
      <RoutineSteps />

      {/* 4. Trending Now / Best Sellers Carousel Slider (Bisa Geser Kanan-Kiri) */}
      <BestSellers bestSellersPromise={data.bestSellers} />


      {/* 6. Clinical Actives & Science */}
      <IngredientsHighlight />

      {/* 7. Perjalanan 14 Hari Glowing — Full Width Section */}
      <FourteenDayJourney />

      {/* 8. Category Split (Essentials vs Bundles) */}
      <CategorySplit />

      {/* 8. Social Proof & Verified Reviews */}
      <SocialProof />

      {/* 9. Skincare Journal (Blog Preview) */}
      <BlogPreview blogArticlesPromise={data.blogArticles} />
    </div>
  );
}

// ==========================================
// Section 1: Hero Section — Full-Viewport (100dvh) Dual-Asset Slider
// ==========================================
interface HeroSlide {
  id: string;
  badge: string;
  headline: React.ReactNode;
  subheading: string;
  subheadingMobile?: string;
  imageDesktop: string;
  imageMobile: string;
  alt: string;
  primaryCta: string;
  primaryCtaMobile?: string;
  primaryHref: string;
  secondaryCta: string;
  secondaryCtaMobile?: string;
  secondaryHref: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'routine',
    badge: 'Flagship 3-Step Routine',
    headline: (
      <>
        Your Bodycare Bestie untuk Kulit{' '}
        <span className="italic font-normal text-primary">Cerah</span> &amp;{' '}
        <span className="italic font-normal text-accent">Glowing</span>.
      </>
    ),
    subheading:
      'Formula Niacinamide 5.22%, Arbutin 2.30% & Kefir Collagen resmi BPOM RI. Mencerahkan merata, melembapkan, dan tidak lengket seharian.',
    subheadingMobile:
      'Formula Niacinamide 5.22%, Arbutin & Kefir Collagen BPOM RI. Mencerahkan merata dan tidak lengket.',
    imageDesktop: heroSlide1Desktop,
    imageMobile: heroSlide1Mobile,
    alt: 'Beautyinu 3-Step Routine Master Lineup bersama Model',
    primaryCta: 'Mulai 3-Step Routine',
    primaryCtaMobile: '3-Step Routine',
    primaryHref: '#routine-system',
    secondaryCta: 'Lihat Paket Hemat',
    secondaryCtaMobile: 'Paket Hemat',
    secondaryHref: '/collections/bundles',
  },
  {
    id: 'texture',
    badge: 'Velvety Dewy Finish',
    headline: (
      <>
        Tekstur Velvety{' '}
        <span className="italic font-normal text-primary">Cepat Meresap</span>,<br />
        Nyaman Seharian.
      </>
    ),
    subheading:
      'Diformulasikan khusus iklim tropis Indonesia—langsung meresap dalam hitungan detik tanpa meninggalkan residu lengket atau rasa gerah.',
    subheadingMobile:
      'Diformulasikan khusus iklim tropis—meresap dalam hitungan detik tanpa rasa lengket seharian.',
    imageDesktop: heroSlide2Desktop,
    imageMobile: heroSlide2Mobile,
    alt: 'Beautyinu Bright Glow Body Lotion Swatch Test pada Kulit',
    primaryCta: 'Cek Body Lotion 750ml',
    primaryCtaMobile: 'Body Lotion 750ml',
    primaryHref: '/products/bright-glow-body-lotion-uv-filter-750ml',
    secondaryCta: 'Lihat Semua Produk',
    secondaryCtaMobile: 'Semua Produk',
    secondaryHref: '/collections/all',
  },
  {
    id: 'cleanse',
    badge: 'Gentle Daily Cleanse',
    headline: (
      <>
        Bersihkan{' '}
        <span className="italic font-normal text-primary">Sel Kulit Mati</span>,<br />
        Sambut Kulit Segar.
      </>
    ),
    subheading:
      'Kefir Collagen Soap Bar dengan busa melimpah membersihkan pori secara menyeluruh tanpa mengikis kelembapan alami skin barrier.',
    subheadingMobile:
      'Busa melimpah membersihkan pori secara menyeluruh tanpa mengikis kelembapan alami skin barrier.',
    imageDesktop: heroSlide3Desktop,
    imageMobile: heroSlide3Mobile,
    alt: 'Beautyinu Kefir Collagen Soap Bar bersama Model',
    primaryCta: 'Coba Kefir Soap Bar',
    primaryCtaMobile: 'Kefir Soap Bar',
    primaryHref: '/products/kefir-collagen-soap-60gr',
    secondaryCta: 'Lihat Review Pembeli',
    secondaryCtaMobile: 'Review Pembeli',
    secondaryHref: '#reviews',
  },
  {
    id: 'booster',
    badge: 'Intense Active Boost',
    headline: (
      <>
        <span className="italic font-normal text-primary">Booster Konsentrat</span>{' '}
        Emas,<br />
        Cerah Lebih Cepat.
      </>
    ),
    subheading:
      'Inovasi serbuk mikro emas untuk di-mix ke lotion atau sabun harian. Menargetkan area gelap, belang, dan bekas luka membandel.',
    subheadingMobile:
      'Inovasi serbuk mikro emas untuk di-mix ke lotion harian. Menargetkan area gelap dan bekas luka.',
    imageDesktop: heroSlide4Desktop,
    imageMobile: heroSlide4Mobile,
    alt: 'Beautyinu Brightening Booster Gold Powder bersama Model',
    primaryCta: 'Eksplor Gold Powder',
    primaryCtaMobile: 'Eksplor Booster',
    primaryHref: '/products/brightening-booster-gold-powder-25gr',
    secondaryCta: 'Pelajari Cara Pakai',
    secondaryCtaMobile: 'Cara Pakai',
    secondaryHref: '#routine-system',
  },
  {
    id: 'confidence',
    badge: '1 Juta++ Moonbabies',
    headline: (
      <>
        Glow <span className="italic font-normal text-primary">Real</span>,<br />
        Sahabat Setia Kulit Tropis.
      </>
    ),
    subheading:
      'Dipercaya lebih dari 1 juta pengguna di seluruh Indonesia. Buktikan transformasi kulit tampak sehat, berseri alami, dan terawat.',
    subheadingMobile:
      'Dipercaya lebih dari 1 juta pengguna di Indonesia. Buktikan transformasi kulit glowing alami.',
    imageDesktop: heroSlide5Desktop,
    imageMobile: heroSlide5Mobile,
    alt: 'Beautyinu Glowing Skin Confidence bersama Komunitas Moonbabies',
    primaryCta: 'Lihat Best Seller',
    primaryCtaMobile: 'Best Seller',
    primaryHref: '/collections/best-sellers',
    secondaryCta: 'Tentang Beautyinu',
    secondaryCtaMobile: 'Tentang Kami',
    secondaryHref: '/pages/about',
  },
];

function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  // Touch swipe support for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    if (Math.abs(distance) > 40) {
      if (distance > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Autoplay slider every 6.5 seconds, pause on hover
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const currentSlide = HERO_SLIDES[activeSlide];

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full overflow-hidden h-[calc(100vh-var(--announcement-height,36px))] h-[calc(100dvh-var(--announcement-height,36px))] min-h-[560px] sm:h-[100dvh] sm:min-h-[640px] -mt-16 sm:-mt-20 pt-0 sm:pt-24 lg:pt-28 pb-5 sm:pb-12 flex items-end sm:items-center"
      role="region"
      aria-roledescription="carousel"
      aria-label="Beautyinu Homepage Hero"
    >
      {/* 1. Full-Bleed Background Images (Responsive Desktop + Mobile Picture Slider) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === activeSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-out ${
                isActive
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-105 pointer-events-none'
              }`}
            >
              <picture className="w-full h-full block">
                {/* Desktop / Tablet Landscape: wide aspect 16:9 */}
                <source media="(min-width: 768px)" srcSet={slide.imageDesktop} />
                {/* Mobile: vertical portrait aspect 9:16 anchored to center-top */}
                <img
                  src={slide.imageMobile}
                  alt={slide.alt}
                  className="w-full h-full object-cover object-[center_top] md:object-right"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  width={768}
                  height={1366}
                />
              </picture>
            </div>
          );
        })}
      </div>

      {/* 2. Scrim Overlays — Precision Non-Linear Feathering (Zero Hard Crop Lines, 100% Vivid Model) */}
      {/* Top Header Scrim: Eased feather from top edge so navbar merges seamlessly */}
      <div
        className="absolute top-0 inset-x-0 h-20 sm:h-28 pointer-events-none z-1"
        style={{
          background:
            'linear-gradient(to bottom, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.60) 35%, rgba(255,255,255,0.20) 70%, rgba(255,255,255,0) 100%)',
        }}
      />

      {/* Desktop Left Scrim: Eased horizontal fade behind text, completely transparent before reaching the model */}
      <div
        className="hidden md:block absolute inset-y-0 left-0 w-[55%] lg:w-[48%] pointer-events-none z-1"
        style={{
          background:
            'linear-gradient(to right, #FFFFFF 0%, rgba(255,255,255,0.98) 18%, rgba(255,255,255,0.88) 35%, rgba(255,255,255,0.60) 55%, rgba(255,255,255,0.28) 75%, rgba(255,255,255,0.08) 90%, rgba(255,255,255,0) 100%)',
        }}
      />

      {/* Desktop Bottom Scrim: Eased vertical fade to eliminate any horizontal crop cut against TrustBar */}
      <div
        className="hidden md:block absolute bottom-0 inset-x-0 h-28 sm:h-36 pointer-events-none z-1"
        style={{
          background:
            'linear-gradient(to top, #FFFFFF 0%, rgba(255,255,255,0.98) 15%, rgba(255,255,255,0.85) 35%, rgba(255,255,255,0.50) 60%, rgba(255,255,255,0.20) 80%, rgba(255,255,255,0.04) 92%, rgba(255,255,255,0) 100%)',
        }}
      />

      {/* Mobile Bottom Scrim: Smooth luxury eased gradient behind bottom text & CTAs */}
      <div
        className="md:hidden absolute bottom-0 inset-x-0 h-[60%] pointer-events-none z-1"
        style={{
          background:
            'linear-gradient(to top, #FFFFFF 0%, rgba(255,255,255,0.98) 30%, rgba(255,255,255,0.85) 55%, rgba(255,255,255,0.45) 80%, rgba(255,255,255,0) 100%)',
        }}
      />

      {/* 3. Foreground Editorial Content Area (Bottom-anchored on Mobile, Centered on Desktop) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="max-w-2xl lg:max-w-3xl">
          {/* Clean Micro-Label */}
          <p className="text-[10px] sm:text-[11px] font-mono font-medium tracking-[0.2em] uppercase text-black/60 mb-1.5 sm:mb-4">
            Beautyinu · {currentSlide.badge}
          </p>

          {/* Headline with Editorial Serif + Italic Accent */}
          <h1 className="font-serif text-[22px] sm:text-5xl lg:text-[56px] text-text leading-[1.18] tracking-tight mb-1.5 sm:mb-4 transition-all duration-500">
            {currentSlide.headline}
          </h1>

          {/* Subheading */}
          <p className="text-[13px] sm:text-base text-text-secondary leading-relaxed mb-2.5 sm:mb-8 max-w-xl transition-all duration-500">
            <span className="sm:hidden">{currentSlide.subheadingMobile || currentSlide.subheading}</span>
            <span className="hidden sm:inline">{currentSlide.subheading}</span>
          </p>

          {/* Dual Clean Pill CTAs (In Mobile Thumb Zone) */}
          <div className="flex flex-row items-center gap-2 sm:gap-3 mb-2.5 sm:mb-8">
            <a
              href={currentSlide.primaryHref}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-full bg-[#111111] hover:bg-black px-3.5 sm:px-8 py-2.5 sm:py-4 text-xs font-bold uppercase tracking-wider text-white transition-all shadow-xs whitespace-nowrap"
            >
              <span className="sm:hidden">{currentSlide.primaryCtaMobile || currentSlide.primaryCta}</span>
              <span className="hidden sm:inline">{currentSlide.primaryCta}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <Link
              to={currentSlide.secondaryHref}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-full bg-white/95 backdrop-blur-md hover:bg-white border border-black/10 px-3.5 sm:px-7 py-2.5 sm:py-4 text-xs font-bold uppercase tracking-wider text-text transition-all shadow-2xs whitespace-nowrap"
            >
              <span className="sm:hidden">{currentSlide.secondaryCtaMobile || currentSlide.secondaryCta}</span>
              <span className="hidden sm:inline">{currentSlide.secondaryCta}</span>
            </Link>
          </div>

          {/* Verified Milestone Endorsement & Interactive Slide Navigation Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 pt-2.5 border-t border-black/[0.06] sm:border-0">
            {/* Milestone Social Proof Badge */}
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-black/[0.08] text-[10px] sm:text-[11px] font-mono text-black/80 shadow-2xs whitespace-nowrap">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span className="font-semibold text-black">1 Juta++ pcs Terjual</span>
              </span>
              <span className="text-black/25">•</span>
              <span className="text-[11px] sm:text-xs text-text-secondary font-medium">
                <span className="sm:hidden">Dipercaya Se-Indonesia</span>
                <span className="hidden sm:inline">Dipercaya Beauty Enthusiasts Se-Indonesia</span>
              </span>
            </div>

            {/* Slider Dots & Arrow Navigation */}
            <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-2.5">
              <div className="flex items-center gap-1 sm:gap-1.5">
                {HERO_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveSlide(idx)}
                    aria-label={`Pindah ke slide ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === activeSlide
                        ? 'w-6 sm:w-7 bg-[#111111]'
                        : 'w-1.5 sm:w-2 bg-black/20 hover:bg-black/40'
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] sm:text-[11px] font-mono text-black/50 ml-1">
                  0{activeSlide + 1} / 0{HERO_SLIDES.length}
                </span>
                <div className="flex items-center gap-1 ml-1 sm:ml-2">
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Slide sebelumnya"
                    className="w-7 h-7 rounded-full border border-black/10 bg-white/90 hover:bg-white backdrop-blur-xs flex items-center justify-center text-black/60 hover:text-black transition-all active:scale-95 shadow-2xs cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Slide berikutnya"
                    className="w-7 h-7 rounded-full border border-black/10 bg-white/90 hover:bg-white backdrop-blur-xs flex items-center justify-center text-black/60 hover:text-black transition-all active:scale-95 shadow-2xs cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// Section 2: Authority & Trust Pillars Bar
// ==========================================
function TrustBar() {
  const items = [
    'BPOM RI Resmi',
    '5.22% Niacinamide + Arbutin',
    'Bebas Ongkir min. Rp 150.000',
    'Halal & Cruelty-Free',
    '1 Juta++ Pcs Terjual',
  ];

  return (
    <section className="w-full bg-white py-3 sm:py-3.5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3.5">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-black/[0.08] to-transparent" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 overflow-x-auto no-scrollbar text-[11px] sm:text-xs font-mono tracking-[0.2em] uppercase text-text/75 whitespace-nowrap">
          {items.map((text, i) => (
            <div key={i} className="flex items-center gap-6 flex-shrink-0">
              <span>{text}</span>
              {i < items.length - 1 && (
                <span className="text-black/20 text-[10px]">•</span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3.5">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-black/[0.08] to-transparent" />
      </div>
    </section>
  );
}

// ==========================================
// Section 3: The 3-Step Daily Routine System
// ==========================================
function RoutineSteps() {
  const steps = [
    {
      stepNumber: '1',
      step: '01',
      action: 'Cleanse',
      stepLabel: 'Step 01 · Persiapan',
      stepSub: 'Bersihkan Sel Kulit Mati',
      title: 'Kefir Collagen Soap',
      spec: 'Fermentasi Kefir + Collagen Peptides',
      benefit:
        'Membersihkan sel kulit mati dan minyak berlebih secara lembut tanpa membuat kulit kering.',
      price: 'Rp 37.125',
      compareAtPrice: 'Rp 45.000',
      image:
        'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_7.png?v=1781661857',
      to: '/products/kefir-collagen-soap-60gr',
      accentColor: 'bg-primary',
    },
    {
      stepNumber: '2',
      step: '02',
      action: 'Boost',
      stepLabel: 'Step 02 · Nutrisi Aktif',
      stepSub: 'Booster Niacinamide 5%',
      title: 'Brightening Booster Gold Powder',
      spec: 'Niacinamide 5.22% + Alpha Arbutin 2.30%',
      benefit:
        'Serbuk konsentrat aktif murni dicampur ke lotion untuk mempercepat regenerasi kulit dan memudarkan belang.',
      price: 'Rp 39.724',
      compareAtPrice: 'Rp 55.950',
      image:
        'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_6.png?v=1781661891',
      to: '/products/brightening-booster-gold-powder-25gr',
      accentColor: 'bg-accent',
    },
    {
      stepNumber: '3',
      step: '03',
      action: 'Protect & Lock',
      stepLabel: 'Step 03 · Perlindungan',
      stepSub: 'Kunci Hidrasi & UV Shield',
      title: 'Bright Glow Body Lotion UV Filter',
      spec: 'Broad Spectrum UV Shield + Shea Butter',
      benefit:
        'Mengunci kelembapan 24 jam sekaligus memberikan perlindungan dari radiasi sinar UVA/UVB.',
      price: 'Rp 100.737',
      compareAtPrice: 'Rp 159.900',
      image:
        'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_9.png?v=1781661846',
      to: '/products/bright-glow-body-lotion-uv-filter-750ml',
      accentColor: 'bg-[#111111]',
    },
  ];

  return (
    <section id="routine-system" className="w-full bg-white pt-12 md:pt-16 pb-6 md:pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <p className="text-[11px] font-mono font-medium uppercase tracking-[0.25em] text-black/50 mb-2">
            The 3-Step Ritual
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-text font-normal tracking-tight mb-3">
            Simple Steps. Maximum Glow.
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed">
            Rangkaian harian yang dirancang sinergis untuk membersihkan, menutrisi, dan melindungi kulit sepanjang hari.
          </p>
        </div>

        {/* 3 Clean Connected Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-10">
          {steps.map((item, i) => (
            <Link
              key={i}
              to={item.to}
              className="group relative overflow-hidden flex flex-col justify-between bg-[#FAF9FB] hover:bg-[#F5F3F8] rounded-3xl p-6 sm:p-7 border border-black/[0.05] hover:border-black/[0.12] transition-all duration-300"
            >
              {/* Subtle Ghost Watermark Number */}
              <span className="absolute top-3 right-5 text-7xl font-mono font-black text-black/[0.03] select-none pointer-events-none group-hover:text-black/[0.06] group-hover:scale-105 transition-all duration-300">
                {item.step}
              </span>

              <div className="relative z-1">
                {/* Card Step Header: Pill Number + Step Info */}
                <div className="flex items-center gap-3 mb-4">
                  <span className={`w-6 h-6 rounded-full ${item.accentColor} text-white text-[11px] font-mono font-bold flex items-center justify-center flex-shrink-0 shadow-2xs`}>
                    {item.stepNumber}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-black/45 font-semibold leading-none mb-1">
                      {item.stepLabel}
                    </div>
                    <div className="text-xs font-bold text-text truncate">
                      {item.stepSub}
                    </div>
                  </div>
                </div>

                <div className="aspect-square w-full rounded-2xl overflow-hidden bg-white mb-5 border border-black/[0.04]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                    width={400}
                    height={400}
                  />
                </div>

                <h3 className="font-sans text-base sm:text-lg font-bold text-text group-hover:text-primary transition-colors mb-1.5">
                  {item.title}
                </h3>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/80 border border-black/[0.05] text-[11px] font-mono text-accent font-medium mb-2.5">
                  <span>{item.spec}</span>
                </div>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {item.benefit}
                </p>
              </div>

              <div className="pt-4 mt-5 border-t border-black/[0.05] flex items-center justify-between relative z-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm sm:text-base font-bold font-mono text-text group-hover:text-primary transition-colors">
                    {item.price}
                  </span>
                  <span className="text-xs font-mono text-black/40 line-through">
                    {item.compareAtPrice}
                  </span>
                </div>
                <span className="w-8 h-8 rounded-full bg-white border border-black/[0.06] flex items-center justify-center text-text group-hover:bg-[#111111] group-hover:text-white group-hover:border-[#111111] transition-all flex-shrink-0">
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Minimalist Routine Synergy Bundle Box (Luminous Glass Effect) */}
        <div id="bundle-banner" className="relative rounded-3xl bg-gradient-to-r from-white/90 via-white/80 to-[#FFF3F6]/85 backdrop-blur-xl border border-white/90 shadow-[0_10px_35px_rgba(249,127,158,0.07)] p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 overflow-hidden">
          {/* Top Hairline Glass Sheen */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none" />

          {/* Ambient Ambient Glow Blurs */}
          <div className="absolute -right-16 -top-16 w-60 h-60 rounded-full bg-primary/[0.08] blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-60 h-60 rounded-full bg-accent/[0.08] blur-3xl pointer-events-none" />

          <div className="relative z-1 max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
                Sinergi Maksimal
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-text-secondary/70 font-medium">
                1 Paket · 3 Langkah
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-text mb-1.5">
              The Glowing Set (3-in-1 Complete Ritual)
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Dapatkan Sabun Kefir + Booster Gold Powder + Body Lotion UV 750ml dalam satu paket hemat. Formulasi saling melengkapi untuk hasil glowing 3x lebih cepat.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 flex-shrink-0 w-full lg:w-auto justify-between lg:justify-end relative z-1 pt-4 lg:pt-0 border-t border-black/[0.06] lg:border-t-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-secondary/50 line-through font-mono">Rp 254.250</span>
                <span className="px-1.5 py-0.5 rounded bg-primary/15 text-primary text-[10px] font-mono font-bold">Hemat 39%</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-text">Rp 155.092</div>
            </div>
            <Link
              to="/products/glowing-set-3-in-1"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary-hover text-white px-7 py-3.5 text-xs font-semibold uppercase tracking-wider transition-all hover:scale-[1.02] shadow-sm hover:shadow-md hover:shadow-primary/25 w-full sm:w-auto cursor-pointer"
            >
              <span>Beli Paket Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// Section 6: Clinical Actives & Science (Skintellectual Transparency)
// ==========================================
function IngredientsHighlight() {
  const ingredients = [
    {
      name: 'Niacinamide',
      val: '5.22%',
      role: 'Brightening & Barrier',
      desc: 'Konsentrasi presisi 5.22% untuk memudarkan hiperpigmentasi, meratakan warna belang, dan memperkuat skin barrier.',
    },
    {
      name: 'Alpha Arbutin',
      val: '2.30%',
      role: 'Dark Spot Targeting',
      desc: 'Bahan aktif berstandar kemurnian tinggi yang menargetkan produksi enzim tirosinase untuk memudarkan bintik gelap.',
    },
    {
      name: 'Glutathione',
      val: '99% Pure',
      role: 'Master Antioxidant',
      desc: 'Antioksidan poten yang menetralisir stres oksidatif akibat paparan polusi dan merangsang kilau cerah alami.',
    },
    {
      name: 'UV Filter Shield',
      val: 'UVA + UVB',
      role: 'Broad Spectrum',
      desc: 'Lapisan pelindung sinar UV untuk menjaga kulit dari paparan radiasi matahari penyebab kulit kusam dan penuaan dini.',
    },
  ];

  return (
    <section id="actives-section" className="w-full pt-6 md:pt-8 pb-12 md:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Subtle Gradient Divider */}
      <div className="w-full mb-6 sm:mb-8">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-black/[0.08] to-transparent" />
      </div>

      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
        <p className="text-[11px] font-mono font-medium uppercase tracking-[0.25em] text-black/50 mb-2">
          What's Inside
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-text font-normal tracking-tight mb-3">
          Active Ingredients. Real Science.
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed">
          Transparansi formula bahan aktif berstandar resmi BPOM RI untuk hasil optimal dan aman jangka panjang.
        </p>
      </div>

      {/* 4 Clean Minimalist Actives */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ingredients.map((ing, i) => (
          <div
            key={i}
            className="group bg-[#FAF9FB] hover:bg-[#F5F3F8] rounded-3xl p-7 flex flex-col justify-between transition-colors duration-300"
          >
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-black/40 block mb-4">
                0{i + 1} // {ing.role}
              </span>
              <p className="font-sans font-bold text-3xl sm:text-4xl text-text tracking-tight mb-2">
                {ing.val}
              </p>
              <h3 className="font-serif text-xl text-text font-normal mb-3">
                {ing.name}
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                {ing.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ==========================================
// Section 7: Perjalanan 14 Hari Glowing (Clean Architectural Timeline)
// ==========================================
function FourteenDayJourney() {
  const milestones = [
    {
      step: '01',
      day: 'Day 01–03',
      phase: 'Deep Hydration',
      title: 'Hidrasi Mendalam',
      desc: 'Kulit terasa langsung lembap seketika, sensasi kering mereda, dan skin barrier mulai terhidrasi optimal.',
    },
    {
      step: '02',
      day: 'Day 04–07',
      phase: 'Smooth Texture',
      title: 'Tekstur Halus & Kenyal',
      desc: 'Enzim fermentasi kefir membersihkan pori secara lembut, mengangkat sel kulit mati, dan menghaluskan permukaan kulit.',
    },
    {
      step: '03',
      day: 'Day 08–14',
      phase: 'Radiant Glow',
      title: 'Cerah Merata & Terlindungi',
      desc: 'Sinergi pencerah Niacinamide dan Arbutin bekerja optimal membuat warna kulit tampak rata, cerah, dan terlindungi sinar UV.',
    },
  ];

  return (
    <section id="journey-section" className="relative w-full overflow-hidden py-16 md:py-24 bg-[#FAF9FB]">
      {/* Background Video (Full Width, Muted, AutoPlay, Loop, PlaysInline) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/videos/timeline-glow-poster.jpg"
          className="w-full h-full object-cover scale-[1.01] filter brightness-[1.02] contrast-[1.03]"
        >
          <source src="/videos/timeline-glow-loop-15s.mp4" type="video/mp4" />
        </video>
        {/* Soft Vignette Overlay: Transparent center so video is clearly visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9FB]/60 via-[#FAF9FB]/15 to-[#FAF9FB]/65" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header (Pure Clean Text, Zero Glass Frame) */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12">
          <p className="text-[11px] font-mono font-medium uppercase tracking-[0.25em] text-black/50 mb-2">
            The Timeline
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-text font-normal tracking-tight mb-3">
            Perjalanan 14 Hari Glowing
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed">
            Tahapan regenerasi kulit tubuh harian dengan pemakaian teratur rangkaian 3-Step Beautyinu.
          </p>
        </div>

        {/* 3 Luxury Glassmorphism Floating Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {milestones.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between bg-white/45 hover:bg-white/65 backdrop-blur-xl backdrop-saturate-180 border border-white/70 hover:border-white shadow-[0_8px_32px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.09)] transition-all duration-500 hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold text-text/60 tracking-wider">
                    {item.step} // {item.day.toUpperCase()}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold bg-white/90 backdrop-blur-md border border-primary/20 px-2.5 py-0.5 rounded-full shadow-2xs">
                    {item.phase}
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl text-text font-medium mb-3 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-text/85 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// Section 4: Trending Now / Best Sellers Carousel Slider (Enhanced Luxury UI/UX)
// ==========================================
const BEST_SELLER_METADATA: Record<
  string,
  {subtitle: string; rank: string; category: string}
> = {
  'brightening-booster-gold-powder-25gr': {
    subtitle: 'Niacinamide 5.22% + Alpha Arbutin 2.30%',
    rank: '#1 Best Seller',
    category: 'Pencerah Aktif',
  },
  'bright-glow-body-lotion-uv-filter-750ml': {
    subtitle: 'Broad Spectrum UV Shield + Shea Butter',
    rank: '#2 Viral Formula',
    category: 'Proteksi Harian',
  },
  'brightening-body-cream-grape': {
    subtitle: 'Ekstrak Anggur + Niacinamide',
    rank: '#3 Night Routine',
    category: 'Nutrisi Malam',
  },
  'brightening-body-cream-grape-200g': {
    subtitle: 'Ekstrak Anggur + Niacinamide',
    rank: '#3 Night Routine',
    category: 'Nutrisi Malam',
  },
  'glowing-set-3-in-1': {
    subtitle: 'Sabun + Booster + Lotion 750ml (3-in-1)',
    rank: '#4 Paket Favorit',
    category: 'Routine Complete',
  },
  'kefir-collagen-soap-60gr': {
    subtitle: 'Fermentasi Kefir + Collagen Peptides',
    rank: '#5 Daily Cleanse',
    category: 'Deep Cleansing',
  },
  'kefir-collagen-soap-bar-60g': {
    subtitle: 'Fermentasi Kefir + Collagen Peptides',
    rank: '#5 Daily Cleanse',
    category: 'Deep Cleansing',
  },
  'bright-glow-body-wash-250ml': {
    subtitle: 'Glutathione + Vitamin E Gentle Foam',
    rank: '#6 Fresh Glow',
    category: 'Sabun Mandi',
  },
  'lotion-booster-set-2-in-1': {
    subtitle: 'Lotion 750ml + Gold Powder (2-in-1)',
    rank: '#7 Duo Booster',
    category: 'Duo Synergy',
  },
  'body-lotion-booster-set': {
    subtitle: 'Lotion 750ml + Gold Powder (2-in-1)',
    rank: '#7 Duo Booster',
    category: 'Duo Synergy',
  },
  'complete-brightening-set': {
    subtitle: 'Rangkaian 5 Produk Perawatan Total',
    rank: '#8 Ultimate Set',
    category: 'Paket Komplit',
  },
};

interface BestSellerCardProps {
  product: any;
  index: number;
  isDragging: boolean;
}

function BestSellerCard({product, index, isDragging}: BestSellerCardProps) {
  const {title, handle, priceRange, compareAtPriceRange, featuredImage} = product;
  const price = priceRange?.minVariantPrice;
  const compareAtPrice = compareAtPriceRange?.minVariantPrice;
  const isDiscounted =
    price &&
    compareAtPrice &&
    Number(price.amount) < Number(compareAtPrice.amount);

  let savePercentage = 0;
  if (isDiscounted) {
    savePercentage = Math.round(
      ((Number(compareAtPrice.amount) - Number(price.amount)) /
        Number(compareAtPrice.amount)) *
        100,
    );
  }

  const meta = BEST_SELLER_METADATA[handle] || {
    subtitle: 'Formula Aktif Teruji Laboratorium BPOM RI',
    rank: `#${index + 1} Best Seller`,
    category: 'Skincare',
  };

  const rankNum = String(index + 1).padStart(2, '0');

  return (
    <div
      data-card-item
      className="w-[76vw] sm:w-[270px] md:w-[285px] lg:w-[295px] flex-shrink-0 snap-start select-none"
    >
      <Link
        to={`/products/${handle}`}
        prefetch="intent"
        onClick={(e) => {
          if (isDragging) e.preventDefault();
        }}
        className="group relative flex flex-col bg-[#FAF9FB] hover:bg-[#F5F3F8] rounded-3xl p-4 sm:p-5 transition-all duration-300 h-full cursor-pointer"
      >
        {/* 1. Image Canvas — Minimalist Rounded 2XL */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white mb-4">
          {featuredImage ? (
            <img
              src={featuredImage.url}
              alt={featuredImage.altText || title}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
              width={500}
              height={500}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-accent">
              <span className="text-xs font-serif font-medium">Beautyinu</span>
            </div>
          )}

          {/* Brand Theme Schema Glassmorphic Discount Pill */}
          {isDiscounted && (
            <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-white/90 backdrop-blur-md border border-white text-[#D8456C] text-[10px] sm:text-[11px] font-bold tracking-wider px-2.5 py-0.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              <span className="text-[9px] uppercase tracking-widest text-[#D8456C]/70 font-mono">HEMAT</span>
              <span>{savePercentage}%</span>
            </span>
          )}
        </div>

        {/* 2. Micro Category */}
        <span className="text-[10px] font-mono uppercase tracking-widest text-black/40 block mb-1">
          {meta.category}
        </span>

        {/* 3. Product Title */}
        <h3 className="font-sans text-sm sm:text-base text-text font-semibold leading-snug line-clamp-1 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* 4. Active Ingredient Subtitle */}
        <p className="text-xs text-text-secondary leading-normal line-clamp-1 mt-0.5 mb-4">
          {meta.subtitle}
        </p>

        {/* 5. Price & Action Link Row */}
        <div className="mt-auto pt-3 border-t border-black/[0.05] flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-bold text-text">
              {price && <Money data={price} withoutTrailingZeros />}
            </span>
            {isDiscounted && compareAtPrice && (
              <span className="text-xs text-text-secondary/60 line-through">
                <Money data={compareAtPrice} withoutTrailingZeros />
              </span>
            )}
          </div>

          <span className="text-xs font-semibold text-text group-hover:text-primary flex items-center gap-1 transition-colors">
            Shop <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </Link>
    </div>
  );
}

function BestSellers({bestSellersPromise}: {bestSellersPromise: any}) {
  return (
    <Suspense fallback={<BestSellersSkeleton />}>
      <Await resolve={bestSellersPromise}>
        {(response) => {
          const products = response?.collection?.products?.nodes || [];
          if (!products.length) return null;
          return <BestSellersSlider products={products} />;
        }}
      </Await>
    </Suspense>
  );
}

function BestSellersSkeleton() {
  return (
    <section className="relative w-full pt-6 md:pt-8 pb-8 md:pb-10 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto mb-6 sm:mb-8">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-black/[0.08] to-transparent" />
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="h-6 w-40 bg-black/[0.06] rounded-md mb-3 animate-pulse" />
        <div className="h-10 w-64 bg-black/[0.06] rounded-xl mb-8 animate-pulse" />
        <div className="flex gap-4 sm:gap-5 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-[285px] h-[380px] bg-[#FAF8FC] rounded-2xl animate-pulse flex-shrink-0"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function BestSellersSlider({products}: {products: any[]}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const {scrollLeft, scrollWidth, clientWidth} = el;
    const maxScroll = scrollWidth - clientWidth;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < maxScroll - 10);
    const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
    setScrollProgress(Math.min(100, Math.max(0, progress)));
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener('scroll', updateScrollState, {passive: true});
    window.addEventListener('resize', updateScrollState, {passive: true});
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;

    // Find actual card width + gap
    const firstCard = el.querySelector<HTMLElement>('[data-card-item]');
    const gap = 20; // sm:gap-5 is 20px
    const cardStep = firstCard ? firstCard.offsetWidth + gap : 300;

    const currentScroll = el.scrollLeft;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const targetScroll =
      direction === 'left'
        ? Math.max(0, currentScroll - cardStep)
        : Math.min(maxScroll, currentScroll + cardStep);

    el.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollContainerRef.current;
    const track = e.currentTarget;
    if (!el || !track) return;
    const rect = track.getBoundingClientRect();
    const clickRatio = (e.clientX - rect.left) / rect.width;
    const clampedRatio = Math.max(0, Math.min(1, clickRatio));
    const targetScroll = clampedRatio * (el.scrollWidth - el.clientWidth);
    el.scrollTo({left: targetScroll, behavior: 'smooth'});
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDown(true);
    setIsDragging(false);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftState(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
    setTimeout(() => setIsDragging(false), 50);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 5) {
      setIsDragging(true);
    }
    scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
  };

  const currentProductIndex =
    products.length > 0
      ? Math.min(
          products.length,
          Math.max(
            1,
            Math.round((scrollProgress / 100) * (products.length - 1)) + 1,
          ),
        )
      : 1;

  return (
    <section className="relative w-full pt-6 md:pt-8 pb-6 md:pb-8 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      {/* Subtle Gradient Divider */}
      <div className="max-w-7xl mx-auto mb-6 sm:mb-8">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-black/[0.08] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header & Section Title with Minimalist Micro-Label */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-5 mb-6 sm:mb-8">
          <div>
            <p className="text-[11px] font-mono font-medium uppercase tracking-[0.25em] text-black/50 mb-2">
              Curated Essentials
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-text font-normal tracking-tight">
              Best Sellers
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-text-secondary mt-1.5 max-w-lg leading-relaxed">
              Formula terlaris dengan konsentrasi aktif presisi untuk mencerahkan, melembapkan, dan merawat kulit harian.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-end">
            <Link
              to="/collections/best-sellers"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-text hover:text-primary transition-colors py-2"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Header Arrow Controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                aria-label="Geser produk ke kiri"
                className="w-9 h-9 rounded-full border border-black/15 flex items-center justify-center text-text transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed hover:enabled:bg-black hover:enabled:text-white hover:enabled:border-black active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                aria-label="Geser produk ke kanan"
                className="w-9 h-9 rounded-full border border-black/15 flex items-center justify-center text-text transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed hover:enabled:bg-black hover:enabled:text-white hover:enabled:border-black active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Container Wrapper with Minimal Side Nav Buttons */}
        <div className="relative group/carousel">
          {/* Floating Left Arrow (Desktop) */}
          <button
            type="button"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Geser produk ke kiri"
            className="hidden lg:flex absolute -left-5 top-[45%] -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-black/10 items-center justify-center text-text hover:bg-black hover:text-white hover:border-black transition-all duration-200 cursor-pointer disabled:opacity-0 disabled:pointer-events-none active:scale-95 shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Floating Right Arrow (Desktop) */}
          <button
            type="button"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Geser produk ke kanan"
            className="hidden lg:flex absolute -right-5 top-[45%] -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-black/10 items-center justify-center text-text hover:bg-black hover:text-white hover:border-black transition-all duration-200 cursor-pointer disabled:opacity-0 disabled:pointer-events-none active:scale-95 shadow-xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Horizontal Carousel Slider with Touch-Swipe & Mouse Drag Support */}
          <div
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4 pt-1 -mx-4 px-4 sm:-mx-0 sm:px-0 select-none ${
              isDown ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {products.map((product: any, idx: number) => (
              <BestSellerCard
                key={product.id}
                product={product}
                index={idx}
                isDragging={isDragging}
              />
            ))}
          </div>
        </div>

        {/* Carousel Bottom Control Bar: Minimalist Scrubber & Index */}
        <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-black/[0.05] pt-4 sm:pt-5">
          <div className="flex items-center gap-2 text-xs font-mono text-black/50">
            <span className="font-semibold text-text">
              {String(currentProductIndex).padStart(2, '0')} // {String(products.length).padStart(2, '0')}
            </span>
            <span className="uppercase tracking-widest text-[10px]">
              Produk Terlaris
            </span>
          </div>

          {/* Minimalist Monochrome Progress Bar */}
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-center">
            <button
              type="button"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Geser produk sebelumnya"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-1.5 rounded-full border border-black/10 bg-white hover:bg-black hover:text-white hover:border-black transition-all disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <div
              onClick={handleProgressClick}
              role="slider"
              aria-valuenow={Math.round(scrollProgress)}
              aria-valuemin={0}
              aria-valuemax={100}
              tabIndex={0}
              title="Navigasi produk"
              className="relative w-36 sm:w-52 h-1 bg-black/[0.08] hover:bg-black/[0.15] rounded-full cursor-pointer transition-colors"
            >
              <div
                className="h-full bg-[#111111] rounded-full transition-all duration-150 ease-out"
                style={{
                  width: `${Math.max(15, scrollProgress)}%`,
                }}
              />
            </div>

            <button
              type="button"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Geser produk berikutnya"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-1.5 rounded-full border border-black/10 bg-white hover:bg-black hover:text-white hover:border-black transition-all disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer active:scale-95"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// Section 8: Category Split (Essentials vs Bundles)
// ==========================================
function CategorySplit() {
  return (
    <section id="category-section" className="w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* Card 1: Body Care Essentials */}
        <Link
          to="/collections/body-care"
          className="group relative rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[3/2] w-full flex flex-col justify-between p-7 sm:p-9 border border-black/[0.06] transition-all duration-500"
        >
          {/* 3:2 Background Image */}
          <img
            src="https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_9.png?v=1781661846"
            alt="Beautyinu Body Care Essentials"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
            width={1080}
            height={720}
          />

          {/* Soft Bottom-Only Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 via-35% to-transparent pointer-events-none" />

          {/* Top Badges Row */}
          <div className="relative z-10 flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
              Daily Essentials
            </span>
            <span className="text-[10px] font-mono text-white/90 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
              Mulai Rp 37.125
            </span>
          </div>

          {/* Bottom Content */}
          <div className="relative z-10 max-w-md">
            <h3 className="font-sans text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight tracking-tight">
              Single Essentials
            </h3>
            <p className="text-xs sm:text-sm text-white/80 mb-5 leading-relaxed max-w-sm line-clamp-2">
              Lotion jumbo 750ml, body wash, body cream &amp; booster powder untuk ritual harian.
            </p>
            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-white/90 text-black text-xs font-semibold uppercase tracking-wider transition-all hover:scale-[1.02]">
              <span>Shop Essentials</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </Link>

        {/* Card 2: Sets & Bundles */}
        <Link
          to="/collections/bundles"
          className="group relative rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[3/2] w-full flex flex-col justify-between p-7 sm:p-9 border border-black/[0.06] transition-all duration-500"
        >
          {/* 3:2 Background Image */}
          <img
            src="https://cdn.shopify.com/s/files/1/0826/3372/0029/files/WebsiteBeautyinu-3.png?v=1784278179"
            alt="Beautyinu Sets and Bundles"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
            width={1080}
            height={720}
          />

          {/* Soft Bottom-Only Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 via-35% to-transparent pointer-events-none" />

          {/* Top Badges Row */}
          <div className="relative z-10 flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
              Bundles &amp; Sets
            </span>
            <span className="text-[10px] font-mono font-semibold text-amber-300 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-amber-300/30">
              Hemat s/d 47%
            </span>
          </div>

          {/* Bottom Content */}
          <div className="relative z-10 max-w-md">
            <h3 className="font-sans text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight tracking-tight">
              Curated Bundles
            </h3>
            <p className="text-xs sm:text-sm text-white/80 mb-5 leading-relaxed max-w-sm line-clamp-2">
              Rangkaian sinergi 3-in-1 hingga 5-in-1 dengan penawaran hemat maksimal, mulai Rp 121.143.
            </p>
            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-white/90 text-black text-xs font-semibold uppercase tracking-wider transition-all hover:scale-[1.02]">
              <span>Shop All Bundles</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}

// ==========================================
// Section 9: Community Love (Social Proof)
// ==========================================
interface ReviewItem {
  id: string;
  name: string;
  location: string;
  product: string;
  rating: number;
  quote: string;
}

const CUSTOMER_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    name: 'Ba*******an',
    location: 'Jakarta',
    product: 'The Glowing Set (3-in-1)',
    rating: 5,
    quote:
      'Menurutku sih ini worth it banget, cuma harus rutin dipake setiap hari, udah kelihatan bedanya. Apalagi gak mahal, gak ribet, aman, dan yang paling penting, emang sengaruh itu woiii.',
  },
  {
    id: 'rev-2',
    name: 'vik******el',
    location: 'Surabaya',
    product: 'Bright Glow Body Lotion UV 750ml',
    rating: 5,
    quote:
      'Jujur ini produknya bagus bangetttt, gak nyesel beli produk Beautyinu. Awalnya kulitku kusam dan belang. Sejak kenal Beautyinu, aku jadi glow up banget, kecintaanku banget deh!',
  },
  {
    id: 'rev-3',
    name: 'de******99',
    location: 'Bandung',
    product: 'Sabun Kefir Collagen + Booster',
    rating: 5,
    quote:
      'Sabun kefir-nya wangi lembut dan ga bikin kulit kering ketarik. Dipakai rutin bareng lotion seminggu kulit langsung terasa halus lembap dan cerah merata. Repurchase terus!',
  },
];

function SocialProof() {
  return (
    <section id="social-proof-section" className="w-full py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Subtle Gradient Divider */}
        <div className="w-full mb-8 sm:mb-10">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-black/[0.08] to-transparent" />
        </div>

        {/* Header Section (Centered, Precise & Flat Minimalist) */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          {/* Micro-Kicker */}
          <p className="text-[11px] font-mono font-medium uppercase tracking-[0.25em] text-black/50 mb-2.5">
            Community Love
          </p>

          {/* Headline */}
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-text font-normal tracking-tight mb-3.5">
            Loved by Over 1 Million.
          </h2>

          {/* Clean Rating Trust Pill */}
          <div className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#FAF9FB] border border-black/[0.05] shadow-2xs mb-4 whitespace-nowrap">
            <div className="flex items-center gap-0.5 text-amber-400 flex-shrink-0">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                  strokeWidth={0}
                />
              ))}
            </div>
            <span className="font-mono text-xs font-bold text-text">4.9 / 5.0</span>
            <span className="text-black/20 text-xs">•</span>
            <span className="text-[11px] sm:text-xs text-text-secondary font-medium">
              10.000+ Ulasan Terverifikasi
            </span>
          </div>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-lg mx-auto">
            1 Juta++ pcs produk terjual setiap bulan di seluruh Indonesia. Terbukti dipercaya ribuan beauty enthusiasts.
          </p>
        </div>

        {/* 3 Balanced Editorial Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {CUSTOMER_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#FAF9FB] hover:bg-[#F6F4FA] border border-black/[0.04] hover:border-black/[0.08] rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 group shadow-2xs hover:shadow-xs"
            >
              <div>
                {/* Top Metadata: 5 Stars + Purchased Product Pill */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                        strokeWidth={0}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono font-medium text-text-secondary bg-white/90 border border-black/[0.05] px-2.5 py-1 rounded-full shadow-2xs truncate max-w-[170px]">
                    {rev.product}
                  </span>
                </div>

                {/* Editorial Quote */}
                <blockquote className="text-sm text-text/85 leading-relaxed font-normal mb-6">
                  “{rev.quote}”
                </blockquote>
              </div>

              {/* Bottom Card Footer: Customer Monogram + Verified Badge */}
              <div className="pt-4 border-t border-black/[0.05] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {rev.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-xs font-semibold text-text truncate">
                      {rev.name}
                    </p>
                    <p className="text-[10px] text-text-secondary truncate">
                      {rev.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-700 bg-emerald-50/80 border border-emerald-200/60 px-2.5 py-1 rounded-full flex-shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" strokeWidth={2} />
                  <span>Verified Buyer</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footnote Trust Signal */}
        <div className="mt-8 text-center">
          <p className="text-[11px] text-text-secondary/70 flex items-center justify-center gap-1.5 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" strokeWidth={1.5} />
            <span>Ulasan asli terverifikasi dari transaksi Shopee Official Store &amp; Website Beautyinu</span>
          </p>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// Section 10: Skincare Journal (Blog Preview)
// ==========================================
function BlogPreview({blogArticlesPromise}: {blogArticlesPromise: any}) {
  return (
    <section id="blog-section" className="w-full py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-[#FAF9FB]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <p className="text-[11px] font-mono font-medium uppercase tracking-[0.25em] text-black/50 mb-2">
              The Journal
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-text font-normal tracking-tight">
              Skincare Notes &amp; Education
            </h2>
          </div>
          <Link
            to="/blogs/news"
            className="text-xs font-mono font-semibold uppercase tracking-wider text-text hover:text-primary flex items-center gap-1.5 transition-colors"
          >
            <span>Read All Articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <Suspense
          fallback={
            <div className="h-48 flex items-center justify-center text-xs font-mono text-text-secondary">
              Memuat artikel...
            </div>
          }
        >
          <Await resolve={blogArticlesPromise}>
            {(response) => {
              const articles = response?.blog?.articles?.nodes || [];
              if (!articles.length) return null;
              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {articles.map((article: any) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              );
            }}
          </Await>
        </Suspense>
      </div>
    </section>
  );
}

// ==========================================
// GraphQL Queries
// ==========================================
const BLOG_QUERY = `#graphql
  query BlogPreview($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    blog(handle: $handle) {
      articles(first: 3) {
        nodes {
          id
          title
          handle
          publishedAt
          image {
            id
            url
            altText
            width
            height
          }
        }
      }
    }
  }
` as const;

const BEST_SELLERS_QUERY = `#graphql
  fragment ProductCard on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query BestSellersCollection($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      products(first: 8) {
        nodes {
          ...ProductCard
        }
      }
    }
  }
` as const;
