import {Await, useLoaderData, Link} from 'react-router';
import {Suspense, useState, useEffect, useCallback, useRef} from 'react';
import type {Route} from './+types/_index';
import {Image, Money} from '@shopify/hydrogen';
import {ProductCard} from '~/components/ProductCard';
import {ArticleCard} from '~/components/ArticleCard';
import heroEditorialImage from '~/assets/beautyinu-hero-editorial.webp';
import heroEditorialMobile from '~/assets/beautyinu-hero-editorial-mobile.webp';
import heroModelImage from '~/assets/beautyinu-hero-model.webp';
import heroModelMobile from '~/assets/beautyinu-hero-model-mobile.webp';
import heroRoutineImage from '~/assets/beautyinu-hero-routine.webp';
import heroRoutineMobile from '~/assets/beautyinu-hero-routine-mobile.webp';
import heroBannerDesktop from '~/assets/hero-banner-desktop.webp';
import {
  ShieldCheck,
  Users,
  Heart,
  ArrowRight,
  Sparkles,
  Truck,
  CheckCircle2,
  Check,
  Star,
  ChevronLeft,
  ChevronRight,
  Flame,
  FlaskConical,
  Droplets,
  Sun,
  Layers,
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
    <main className="w-full bg-white">
      {/* 1. Hero Section (Proven Skincare Style: Dynamic Headline + Concern Selector) */}
      <Hero />

      {/* 2. Authority & Trust Ticker */}
      <TrustBar />

      {/* 3. The 3-Step Daily Routine System (Core Flagship) */}
      <RoutineSteps />

      {/* 4. Trending Now / Best Sellers Carousel Slider (Bisa Geser Kanan-Kiri) */}
      <BestSellers bestSellersPromise={data.bestSellers} />

      {/* 5. Interactive Skin Concern Matcher */}
      <SkinConcernMatcher />

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
    </main>
  );
}

// ==========================================
// Section 1: Hero Section — Full-Viewport (100dvh) Dual-Asset Slider
// ==========================================
interface HeroSlide {
  id: string;
  headline: React.ReactNode;
  subheading: string;
  imageDesktop: string;
  imageMobile: string;
  alt: string;
  primaryCta: string;
  primaryHref: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'editorial',
    headline: (
      <>
        Your Bodycare Bestie untuk Kulit{' '}
        <span className="italic font-normal text-primary">Cerah</span> &amp;{' '}
        <span className="italic font-normal text-accent">Glowing</span>.
      </>
    ),
    subheading:
      'Formula Niacinamide 5.22%, Arbutin 2.30% & Kefir Collagen resmi BPOM RI. Mencerahkan merata, melembapkan, dan tidak lengket seharian.',
    imageDesktop: heroEditorialImage,
    imageMobile: heroEditorialMobile,
    alt: 'Beautyinu Luxury Editorial Skincare Showcase',
    primaryCta: 'Mulai 3-Step Routine',
    primaryHref: '#routine-system',
  },
  {
    id: 'model',
    headline: (
      <>
        Glow <span className="italic font-normal text-primary">Real</span>,<br />
        Bukan Janji Instan.
      </>
    ),
    subheading:
      'Tekstur velvety cepat meresap tanpa rasa lengket. 98% merasakan kulit lebih lembap dan cerah alami dalam 14 hari.',
    imageDesktop: heroModelImage,
    imageMobile: heroModelMobile,
    alt: 'Beautyinu Dewy Glowing Skin Campaign',
    primaryCta: 'Lihat Best Seller',
    primaryHref: '/collections/best-sellers',
  },
  {
    id: 'routine',
    headline: (
      <>
        Kombinasi <span className="italic font-normal text-primary">3 Langkah</span>,<br />
        Kulit Sehat Maksimal.
      </>
    ),
    subheading:
      'Sinergi Cleanse, Boost, dan Protect & Lock. Rutinitas ringkas harian untuk proteksi maksimal dari paparan UV dan polusi.',
    imageDesktop: heroRoutineImage,
    imageMobile: heroRoutineMobile,
    alt: 'Beautyinu 3-Step Bodycare Synergy Routine',
    primaryCta: 'Pilih Paket Lengkap',
    primaryHref: '/collections/bundles',
  },
];

function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  // Autoplay slider every 7 seconds, pause on hover
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 7000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const currentSlide = HERO_SLIDES[activeSlide];

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full overflow-hidden min-h-[100dvh] h-[100dvh] -mt-16 sm:-mt-18 pt-20 sm:pt-24 lg:pt-28 pb-8 sm:pb-12 flex items-center"
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
                {/* Mobile: vertical portrait aspect 9:16 */}
                <img
                  src={slide.imageMobile}
                  alt={slide.alt}
                  className="w-full h-full object-cover object-bottom md:object-right"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  width={768}
                  height={1376}
                />
              </picture>
            </div>
          );
        })}
      </div>

      {/* 2. Layered Scrim Overlays for Header Merging & Crystal-Clear Readability */}
      {/* Top Header Scrim: makes header blend seamlessly into hero canvas */}
      <div className="absolute top-0 inset-x-0 h-32 sm:h-40 bg-gradient-to-b from-white/95 via-white/70 to-transparent pointer-events-none z-1" />

      {/* Mobile Scrim: Soft wash so top text is crystal clear while bottom shows the product/model */}
      <div className="md:hidden absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-white/20 pointer-events-none z-1" />

      {/* Desktop Scrim: Left-to-right fade so wide landscape image on right is visible */}
      <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-white via-white/95 sm:via-white/85 md:via-white/75 lg:via-white/60 to-transparent pointer-events-none z-1" />

      {/* Bottom Scrim: gentle soft fade into the TrustBar section */}
      <div className="absolute bottom-0 inset-x-0 h-16 sm:h-20 bg-gradient-to-t from-white via-white/60 to-transparent pointer-events-none z-1" />

      {/* 3. Foreground Editorial Content Area */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full relative z-10">
        <div className="max-w-2xl lg:max-w-3xl">
          {/* Subtle Clean Label (No AI slop or artificial badges) */}
          <p className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-accent mb-3 sm:mb-4">
            Beautyinu Daily Bodycare
          </p>

          {/* Headline with Editorial Serif + Italic Accent */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-[56px] text-text leading-[1.14] tracking-tight mb-3 sm:mb-4 transition-all duration-500">
            {currentSlide.headline}
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-base lg:text-lg text-text-secondary leading-relaxed mb-6 sm:mb-8 max-w-xl transition-all duration-500">
            {currentSlide.subheading}
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5 mb-6 sm:mb-8">
            <a
              href={currentSlide.primaryHref}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover px-7 sm:px-8 py-3.5 sm:py-4 text-sm font-semibold text-white shadow-sm transition-all hover:translate-y-[-1px]"
            >
              <span>{currentSlide.primaryCta}</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </a>
            <Link
              to="/collections/bundles"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/90 backdrop-blur-md hover:bg-white border border-black/[0.08] px-6 sm:px-7 py-3.5 sm:py-4 text-sm font-semibold text-text shadow-2xs transition-all hover:translate-y-[-1px]"
            >
              <span>Lihat Paket Hemat</span>
            </Link>
          </div>

          {/* Verified Customer Social Proof Endorsement */}
          <div className="flex items-center gap-2.5 pt-4 sm:pt-5 text-xs text-text-secondary flex-wrap">
            <div className="flex text-[#F59E0B]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#F59E0B]" strokeWidth={1.5} />
              ))}
            </div>
            <span className="font-bold text-text">4.9 / 5.0</span>
            <span className="text-black/20">•</span>
            <span>Berdasarkan 12.000+ ulasan pelanggan terverifikasi</span>
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
  const pillars = [
    {
      icon: ShieldCheck,
      title: '100% Resmi BPOM',
      desc: 'Izin Edar Resmi RI',
    },
    {
      icon: Sparkles,
      title: 'Clinical Actives',
      desc: '5.22% Niacinamide + Arbutin',
    },
    {
      icon: Truck,
      title: 'Bebas Ongkir',
      desc: 'Min. Belanja Rp 150.000',
    },
    {
      icon: Heart,
      title: 'Halal & Cruelty-Free',
      desc: 'Lembut & Non-Irritant',
    },
    {
      icon: Users,
      title: '1 Juta+ Terjual',
      desc: 'Rating 4.9/5 Ribuan Ulasan',
    },
  ];

  return (
    <section className="w-full bg-[#FAF8FC] border-y border-black/[0.04] py-6 sm:py-7">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Desktop: 5-Pillar Laboratory Grid with subtle dividers */}
        <div className="hidden lg:grid grid-cols-5 divide-x divide-black/[0.05]">
          {pillars.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="group flex items-center gap-3.5 px-4 first:pl-0 last:pr-0 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-white border border-accent/20 flex items-center justify-center flex-shrink-0 text-accent group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 shadow-2xs">
                  <Icon className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-text tracking-tight group-hover:text-primary transition-colors truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-text-secondary leading-tight mt-0.5 truncate">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile & Tablet: Horizontal Glide / Clean Responsive Touch Cards */}
        <div className="lg:hidden flex items-center overflow-x-auto no-scrollbar gap-3 py-1 -mx-4 px-4 snap-x snap-mandatory">
          {pillars.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-3 bg-white/90 backdrop-blur-xs border border-black/[0.04] rounded-2xl px-4 py-3 flex-shrink-0 snap-start shadow-2xs min-w-[210px]"
              >
                <div className="w-9 h-9 rounded-full bg-accent-light text-accent flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-text tracking-tight">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-text-secondary leading-tight mt-0.5 whitespace-nowrap">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
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
      step: '01',
      action: 'Cleanse',
      title: 'Kefir Collagen Soap',
      spec: 'Fermentasi Kefir + Collagen Peptides',
      benefit: 'Membersihkan sel kulit mati dan minyak berlebih secara lembut tanpa membuat kulit kering atau kesat.',
      price: 'Rp 37.125',
      image:
        'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_7.png?v=1781661857',
      to: '/products/kefir-collagen-soap-60gr',
    },
    {
      step: '02',
      action: 'Boost',
      title: 'Brightening Booster Gold Powder',
      spec: 'Niacinamide 5.22% + Alpha Arbutin 2.30%',
      benefit: 'Serbuk konsentrat aktif murni yang dicampur ke lotion untuk mempercepat regenerasi kulit dan memudarkan belang.',
      price: 'Rp 39.724',
      image:
        'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_6.png?v=1781661891',
      to: '/products/brightening-booster-gold-powder-25gr',
    },
    {
      step: '03',
      action: 'Protect & Lock',
      title: 'Bright Glow Body Lotion UV Filter',
      spec: 'Broad Spectrum UV Shield + Shea Butter',
      benefit: 'Mengunci kelembapan 24 jam sekaligus memberikan perlindungan dari paparan radiasi matahari UVA/UVB.',
      price: 'Rp 100.737',
      image:
        'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_9.png?v=1781661846',
      to: '/products/bright-glow-body-lotion-uv-filter-750ml',
    },
  ];

  return (
    <section id="routine-system" className="w-full bg-[#FAF8FC] py-20 md:py-28 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Rangkaian Harian
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-text mt-2 mb-3">
            3 Langkah Sederhana untuk Kulit Cerah Sehat
          </h2>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            Formula yang saling melengkapi: bersihkan kotoran pori, aktifkan konsentrat pencerah, dan kunci kelembapan dengan proteksi UV harian.
          </p>
        </div>

        {/* 3 Sequential Steps — Frameless, Clean, Uncluttered Visual Flow */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-12 mb-16 sm:mb-20">
          {/* Subtle connecting progression line on desktop */}
          <div className="hidden md:block absolute top-4 inset-x-16 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent pointer-events-none" />

          {steps.map((item, i) => (
            <div
              key={i}
              className="relative flex flex-col items-center text-center group"
            >
              {/* Step Sequence Marker */}
              <div className="flex items-center gap-2 mb-5">
                <span className="w-8 h-8 rounded-full bg-white border border-accent/30 text-accent font-serif font-bold text-xs flex items-center justify-center shadow-2xs">
                  {item.step}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-text">
                  {item.action}
                </span>
              </div>

              {/* Product Image Canvas — Clean Architectural Card */}
              <div className="relative mx-auto mb-6 w-full max-w-[220px] sm:max-w-[240px]">
                <Link
                  to={item.to}
                  className="block bg-white p-3 rounded-xl shadow-xs border border-black/[0.06] transition-all duration-300 ease-out group-hover:scale-[1.02] group-hover:shadow-md group-hover:border-accent/30"
                >
                  <div className="aspect-square overflow-hidden bg-[#ECE8FF] rounded-lg">
                    <img
                      src={item.image}
                      alt=""
                      aria-hidden="true"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                      width={400}
                      height={400}
                    />
                  </div>
                </Link>
              </div>

              {/* Product Info */}
              <h3 className="font-serif text-xl sm:text-2xl text-text mb-1 group-hover:text-primary transition-colors">
                <Link to={item.to}>{item.title}</Link>
              </h3>
              <p className="text-xs font-semibold text-accent mb-2">
                {item.spec}
              </p>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-4 max-w-xs">
                {item.benefit}
              </p>

              {/* Price & Direct Editorial Link */}
              <p className="text-base font-bold text-text mb-2">
                {item.price}
              </p>
              <Link
                to={item.to}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover transition-all group-hover:translate-x-0.5"
              >
                <span>Lihat Produk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

        {/* Flagship Routine Synergy Callout — Clean, Unified, No Boxy Clutter */}
        <div className="pt-10 border-t border-black/[0.06] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
                Routine Synergy
              </span>
              <span className="text-black/20">•</span>
              <span className="text-xs font-semibold text-text">
                3 Langkah dalam 1 Paket Lengkap
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-text">
              Dapatkan Glowing Set (3-in-1 Routine)
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Sabun Kefir + Booster Gold Powder + Body Lotion UV 750ml • Lebih hemat Rp 99.158
            </p>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-right hidden sm:block">
              <div className="text-xs text-text-secondary line-through">Rp 254.250</div>
              <div className="text-xl font-bold text-primary">Rp 155.092</div>
            </div>
            <Link
              to="/products/glowing-set-3-in-1"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-xs"
            >
              <span>Beli Paket Hemat (Diskon 39%)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// Section 4: Interactive Skin Concern Matcher
// ==========================================
// ==========================================
// Section 5: Interactive Skin Concern Matcher (Targeted Treatment)
// ==========================================
interface ConcernProduct {
  title: string;
  role: string;
  price: string;
  image: string;
  to: string;
}

interface ConcernItem {
  id: string;
  badge: string;
  icon: typeof Sparkles;
  title: string;
  desc: string;
  mechanism: string;
  actives: string[];
  products: ConcernProduct[];
  bundleTitle: string;
  bundleSavings: string;
  bundlePrice: string;
  bundleHref: string;
}

const CONCERN_MATCHES: ConcernItem[] = [
  {
    id: 'kusam',
    badge: 'Warna Kulit Kusam',
    icon: Sparkles,
    title: 'Warna Kulit Kusam & Belang Tidak Merata',
    desc: 'Paparan sinar matahari tropis dan tumpukan sel kulit mati membuat kulit tubuh kehilangan kilau alaminya dan tampak gelap belang.',
    mechanism:
      'Kombinasi Alpha Arbutin 2.30% menekan enzim pembentuk melanin baru, sementara Niacinamide 5.22% mempercepat regenerasi sel kulit cerah.',
    actives: ['Alpha Arbutin 2.30%', 'Niacinamide 5.22%', 'Glutathione'],
    products: [
      {
        title: 'Kefir Collagen Soap Bar',
        role: 'Langkah 01 · Bersihkan Sel Kulit Mati',
        price: 'Rp 37.125',
        image:
          'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_7.png?v=1781661857',
        to: '/products/kefir-collagen-soap-60gr',
      },
    ],
    bundleTitle: 'Glowing Set (3-in-1 Routine)',
    bundleSavings: 'Hemat Rp 99.158',
    bundlePrice: 'Rp 155.092',
    bundleHref: '/products/glowing-set-3-in-1',
  },
  {
    id: 'kering',
    badge: 'Kulit Sangat Kering, Bersisik',
    icon: Droplets,
    title: 'Kulit Dehidrasi, Bersisik & Kasar',
    desc: 'Skin barrier kehilangan kelembapan alami akibat AC dan cuaca kering, menyebabkan tekstur kulit bersisik dan mudah terasa gatal.',
    mechanism:
      'Asam lemak alami Shea Butter mengunci hidrasi 24 jam dan nutrisi fermentasi kefir memulihkan elastisitas barrier kulit yang rapuh.',
    actives: ['Natural Shea Butter', 'Fermentasi Kefir', 'Niacinamide'],
    products: [
      {
        title: 'Bright Glow Body Wash 250ml',
        role: 'Langkah 01 · Pembersih Lembut Menghidrasi',
        price: 'Rp 69.750',
        image:
          'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_8.png?v=1781661875',
        to: '/products/bright-glow-body-wash-250ml',
      },
      {
        title: 'Brightening Body Cream Grape',
        role: 'Langkah 02 · Nutrisi Intensif & Barrier Shield',
        price: 'Rp 48.400',
        image:
          'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_10.png?v=1781661867',
        to: '/products/brightening-body-cream-grape',
      },
    ],
    bundleTitle: 'Cream & Booster Set (2-in-1)',
    bundleSavings: 'Hemat Rp 42.000',
    bundlePrice: 'Rp 88.124',
    bundleHref: '/products/body-cream-booster-set',
  },
  {
    id: 'outdoor',
    badge: 'Sering Aktivitas Luar Ruangan',
    icon: Sun,
    title: 'Sering Terpapar Sinar Matahari & Polusi',
    desc: 'Radiasi UVA/UVB tropis memicu timbulnya belang kontras pada lengan dan kaki serta memecah kolagen elastisitas kulit tubuh.',
    mechanism:
      'Tabir surya UV Filter melindungi lapisan kulit dari paparan radiasi matahari, dipadukan serbuk booster untuk memulihkan kulit belang.',
    actives: ['Broad Spectrum UV Filter', 'Niacinamide 5.22%', 'Collagen'],
    products: [
      {
        title: 'Bright Glow Body Lotion UV Filter 750ml',
        role: 'Langkah 01 · Proteksi UV Filter Harian',
        price: 'Rp 100.737',
        image:
          'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_9.png?v=1781661846',
        to: '/products/bright-glow-body-lotion-uv-filter-750ml',
      },
      {
        title: 'Brightening Booster Gold Powder',
        role: 'Langkah 02 · Recovery Tone Belang Malam Hari',
        price: 'Rp 39.724',
        image:
          'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_6.png?v=1781661891',
        to: '/products/brightening-booster-gold-powder-25gr',
      },
    ],
    bundleTitle: 'Lotion & Booster Set (2-in-1)',
    bundleSavings: 'Hemat Rp 75.548',
    bundlePrice: 'Rp 140.302',
    bundleHref: '/products/body-lotion-booster-set',
  },
  {
    id: 'flek',
    badge: 'Bekas Luka, Gigitan Nyamuk',
    icon: Layers,
    title: 'Bekas Luka & Noda Gelap Membandel',
    desc: 'Bintik hitam pasca-gigitan nyamuk, goresan, atau bekas luka sering tertinggal lama pada lapisan epidermis kulit dan sulit pudar.',
    mechanism:
      'Aksi sinergi eksfoliasi lembut dan antioksidan konsentrat Glutathione mempercepat pelepasan sel berpigmen gelap dan merangsang sel baru.',
    actives: ['Pure Glutathione', 'Alpha Arbutin 2.30%', 'Kakadu Plum'],
    products: [
      {
        title: 'English Pear Body Toner 100ml',
        role: 'Langkah 01 · Eksfoliasi Lembut Pengangkat Noda',
        price: 'Rp 100.000',
        image:
          'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/1_a5fe8674-cd62-4d2a-bdff-8e27fe64cb0d.jpg?v=1778575018',
        to: '/products/english-pear-body-toner-100ml',
      },
      {
        title: 'Brightening Booster Gold Powder 25gr',
        role: 'Langkah 02 · Konsentrat Target Bintik Gelap',
        price: 'Rp 39.724',
        image:
          'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_6.png?v=1781661891',
        to: '/products/brightening-booster-gold-powder-25gr',
      },
    ],
    bundleTitle: 'Complete Brightening Set (5-in-1)',
    bundleSavings: 'Hemat Rp 229.783',
    bundlePrice: 'Rp 259.117',
    bundleHref: '/products/complete-brightening-set',
  },
];

function SkinConcernMatcher() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const current = CONCERN_MATCHES[selectedIdx];

  return (
    <section id="skin-matcher" className="w-full py-20 md:py-28 px-4 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
        <span className="text-xs font-bold uppercase tracking-widest text-accent block mb-2">
          Targeted Treatment
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-text mt-1 mb-3">
          Temukan Solusi Tepat untuk Kulitmu
        </h2>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          Setiap jenis keluhan kulit membutuhkan kombinasi bahan aktif yang terarah. Pilih masalah kulitmu untuk melihat urutan ritual perawatan yang direkomendasikan:
        </p>
      </div>

      {/* Concern Interactive Tabs */}
      <div className="flex justify-center flex-wrap gap-2.5 sm:gap-3 mb-10 sm:mb-12">
        {CONCERN_MATCHES.map((item, idx) => {
          const Icon = item.icon;
          const isSelected = idx === selectedIdx;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-[#1A1A1A] text-white shadow-md scale-[1.02] ring-2 ring-primary/20'
                  : 'bg-white text-text-secondary hover:text-text border border-black/[0.08] hover:border-accent/40 shadow-2xs'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-accent'}`} />
              <span>{item.badge}</span>
            </button>
          );
        })}
      </div>

      {/* Unified Diagnostic & Routine Recommendation Board */}
      <div className="bg-[#FAF8FC] rounded-2xl p-6 sm:p-10 lg:p-12 border border-black/[0.05] shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Clinical Diagnosis & Formula Synergy */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white text-accent text-xs font-bold uppercase tracking-wider mb-4 border border-accent/20 shadow-2xs">
                <FlaskConical className="w-3.5 h-3.5 text-primary" />
                <span>Analisa Masalah &amp; Mekanisme</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-text leading-tight mb-3">
                {current.title}
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-6">
                {current.desc}
              </p>

              {/* Mechanism Box */}
              <div className="p-4 sm:p-5 rounded-xl bg-white border border-black/[0.05] mb-6 shadow-2xs">
                <span className="text-xs font-bold text-text block mb-1.5">
                  Mekanisme Kerja Bahan Aktif:
                </span>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-4">
                  {current.mechanism}
                </p>

                {/* Active Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-black/[0.04]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                    Bahan Aktif:
                  </span>
                  {current.actives.map((act, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-accent-light/80 text-accent font-semibold text-[11px] border border-accent/25"
                    >
                      <Check className="w-3 h-3 text-primary" />
                      <span>{act}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommended Bundle Synergy Card */}
            <div className="p-5 rounded-xl bg-white border-2 border-primary/30 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                    Paket Solusi Direkomendasikan
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {current.bundleSavings}
                  </span>
                </div>
                <h4 className="font-serif text-base sm:text-lg font-bold text-text">
                  {current.bundleTitle}
                </h4>
                <p className="text-sm font-black text-text mt-0.5">
                  {current.bundlePrice}
                </p>
              </div>

              <Link
                to={current.bundleHref}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-white px-5 py-2.5 text-xs font-bold transition-all shadow-xs flex-shrink-0"
              >
                <span>Lihat Paket Solusi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Step-by-Step Routine Product Cards */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary block mb-3">
                Produk Rekomendasi ({current.products.length} Formula):
              </span>

              <div className="flex flex-col gap-3.5">
                {current.products.map((p, i) => (
                  <Link
                    key={p.to}
                    to={p.to}
                    className="group flex items-center justify-between p-4 sm:p-4.5 rounded-2xl bg-white hover:bg-white border border-black/[0.06] hover:border-accent/40 shadow-2xs hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Step Indicator */}
                      <div className="flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-accent-light text-accent border border-accent/20 flex-shrink-0">
                        <span className="text-[9px] font-bold uppercase tracking-wider leading-none">
                          Step
                        </span>
                        <span className="text-sm font-black leading-tight">
                          0{i + 1}
                        </span>
                      </div>

                      {/* Product Thumbnail — Decorative alt so screen readers do not repeat title */}
                      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden bg-[#FAF8FC] border border-black/[0.04] flex-shrink-0 p-1">
                        <img
                          src={p.image}
                          alt=""
                          aria-hidden="true"
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          width={72}
                          height={72}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-accent block truncate">
                          {p.role}
                        </span>
                        <h4 className="text-sm sm:text-base font-semibold text-text group-hover:text-primary transition-colors truncate mt-0.5">
                          {p.title}
                        </h4>
                        <p className="text-xs sm:text-sm font-bold text-text mt-1">
                          {p.price}
                        </p>
                      </div>
                    </div>

                    {/* Action CTA Pill */}
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary group-hover:text-primary transition-colors flex-shrink-0 ml-3 pl-3 border-l border-black/[0.04]">
                      <span className="hidden sm:inline">Lihat Produk</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// Section 6: Clinical Actives & 14-Day Glowing Journey (Pinned Bulletin Board)
// ==========================================
function IngredientsHighlight() {
  const ingredients = [
    {
      name: 'Niacinamide',
      val: '5.22%',
      category: 'Vitamin B3 Kompleks',
      badge: 'Resmi BPOM RI',
      action: 'Inhibisi Melanin',
      desc: 'Konsentrasi presisi 5.22% untuk memudarkan hiperpigmentasi, meratakan tone belang, dan memperkuat skin barrier.',
      color: 'border-accent/25 text-accent',
    },
    {
      name: 'Alpha Arbutin',
      val: '2.30%',
      category: 'Target Bintik Hitam',
      badge: 'High Purity Grade',
      action: 'Blok Enzim Tirosinase',
      desc: 'Bahan aktif dengan kemurnian tinggi yang menargetkan produksi enzim tirosinase untuk menghentikan bintik gelap.',
      color: 'border-primary/25 text-primary',
    },
    {
      name: 'Glutathione',
      val: '99% Pure',
      category: 'Master Antioksidan',
      badge: 'Antioksidan Aktif',
      action: 'Netralisir Radikal',
      desc: 'Antioksidan murni yang menetralisir stres oksidatif akibat paparan polusi dan merangsang pigmen kulit cerah.',
      color: 'border-[#E5A93C]/25 text-[#E5A93C]',
    },
    {
      name: 'UV Filter Shield',
      val: 'UVA + UVB',
      category: 'Fotoproteksi Tropis',
      badge: 'Proteksi UVA & UVB',
      action: 'Filter Radiasi Surya',
      desc: 'Lapisan filter surya spektrum luas yang melindungi sel kulit dari sengatan sinar matahari penyebab kusam dan penuaan.',
      color: 'border-[#4B96E6]/25 text-[#4B96E6]',
    },
  ];

  return (
    <section className="w-full py-20 md:py-28 px-4 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-accent block mb-2">
          Sains &amp; Keamanan Bahan Aktif
        </span>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-text mt-1 mb-3">
          Diformulasikan dengan Bahan Aktif Berstandar BPOM RI
        </h2>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          Bukan sekadar wewangian. Setiap produk diformulasikan dengan konsentrasi presisi bahan aktif teruji laboratorium untuk hasil nyata yang aman jangka panjang.
        </p>
      </div>

      {/* 4 Clinical Actives Cards (Apothecary Lab Style with Precise Alignment) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {ingredients.map((ing, i) => (
          <div
            key={i}
            className="group relative bg-white rounded-2xl p-5 sm:p-6 flex flex-col justify-between border border-black/[0.06] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_-6px_rgba(175,143,209,0.18)] hover:border-accent/30 transition-all duration-300 hover:-translate-y-1 h-full"
          >
            <div>
              {/* Card Header: Formula Index & Quality Standard Row */}
              <div className="flex items-center justify-between gap-2 pb-2.5 mb-3 border-b border-black/[0.04]">
                <span className="text-[11px] font-mono font-bold text-accent bg-accent-light/80 px-2.5 py-0.5 rounded-md border border-accent/20 tracking-wider uppercase">
                  Formula 0{i + 1}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary/70">
                  Standar BPOM
                </span>
              </div>

              {/* Verified Quality Badge */}
              <div className="mb-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg bg-[#FAF8FC] text-text border border-black/[0.06] shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span>{ing.badge}</span>
                </span>
              </div>

              {/* Metric & Title */}
              <div className="mb-4">
                <p className="font-sans font-black text-3xl sm:text-4xl tracking-tight text-text leading-none">
                  {ing.val}
                </p>
                <h3 className="font-serif text-xl sm:text-2xl text-text font-bold mt-2.5 leading-tight">
                  {ing.name}
                </h3>
                <span className="text-xs font-semibold text-accent block mt-1">
                  {ing.category}
                </span>
              </div>

              <div className="w-10 h-0.5 bg-accent/30 mb-4 group-hover:w-16 group-hover:bg-primary transition-all duration-300" />

              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed min-h-[56px] sm:min-h-[64px]">
                {ing.desc}
              </p>
            </div>

            {/* Target Spec Sheet Row */}
            <div className="pt-3.5 border-t border-black/[0.04] mt-5">
              <div className="flex items-center justify-between text-xs gap-2">
                <span className="text-text-secondary font-medium text-[11px] whitespace-nowrap">Target Kerja:</span>
                <span className="font-bold text-accent bg-accent-light/60 px-2.5 py-0.5 rounded-md border border-accent/20 text-[11px] truncate">
                  {ing.action}
                </span>
              </div>
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
      day: 'Hari 1–3',
      phase: 'Fase Hidrasi Awal',
      title: 'Hidrasi Mendalam 24 Jam',
      desc: 'Kulit terasa langsung lembap seketika, sensasi kering dan bersisik mereda, serta skin barrier mulai terhidrasi dengan baik.',
      result: 'Kulit kenyal dan lembap terhidrasi',
    },
    {
      step: '02',
      day: 'Hari 4–7',
      phase: 'Fase Regenerasi Tekstur',
      title: 'Eksfoliasi & Permukaan Halus',
      desc: 'Enzim pembersih dan fermentasi kefir mengangkat daki serta tumpukan sel kulit mati secara lembut tanpa rasa perih.',
      result: 'Tekstur kulit halus dan belang mulai pudar',
    },
    {
      step: '03',
      day: 'Hari 8–14',
      phase: 'Fase Pencerahan Merata',
      title: 'Cerah Merata & Terlindungi UV',
      desc: 'Penghambatan melanin oleh Alpha Arbutin dan Niacinamide bekerja optimal, warna kulit lebih rata dan bercahaya alami.',
      result: 'Tone cerah merata & terlindungi sinar UV',
    },
  ];

  return (
    <section className="w-full bg-[#FAF8FC] py-20 md:py-28 border-y border-black/[0.04] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        {/* Board Header — Middle Center */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
          <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-accent block mb-2">
            Linimasa Perawatan
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-text leading-tight mb-3">
            Perjalanan 14 Hari Glowing
          </h2>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-xl mx-auto">
            Tahapan regenerasi kulit tubuh harian dengan pemakaian teratur rangkaian 3-Step System Beautyinu.
          </p>
        </div>

        {/* Milestone Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 relative z-10 items-stretch">
          {milestones.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-black/[0.06] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:border-accent/30 transition-all duration-200 flex flex-col justify-between h-full"
            >
              <div>
                {/* Header: Step Index & Phase */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-black/[0.04]">
                  <span className="font-mono text-xs font-bold text-accent tracking-wider">
                    {item.step} // {item.day}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary/70">
                    {item.phase}
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl text-text font-bold mb-2.5 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-6">
                  {item.desc}
                </p>
              </div>

              {/* Verified Result Milestone */}
              <div className="pt-4 border-t border-black/[0.04] mt-auto flex items-center gap-2 text-xs font-semibold text-text">
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{item.result}</span>
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
        className="group relative flex flex-col bg-white rounded-2xl p-3.5 sm:p-4 border border-black/[0.06] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_-6px_rgba(175,143,209,0.18)] hover:border-accent/30 transition-all duration-300 h-full cursor-pointer"
      >
        {/* 1. Image Canvas with Subtle Luxury Gradient Backdrop */}
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gradient-to-b from-[#FAF8FC] to-[#F3EEFA]/40 mb-3.5">
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

          {/* Top Left: Prestige Ranking Badge */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-[#1A1A1A]/85 backdrop-blur-md text-white px-2 py-0.5 rounded-md shadow-2xs">
            <span className="text-primary font-black text-[10px]">#</span>
            <span className="text-[10px] font-bold tracking-wider uppercase font-sans">
              {rankNum}
            </span>
          </div>

          {/* Top Right: Discount Pill Badge */}
          {isDiscounted && (
            <span className="absolute top-2.5 right-2.5 bg-gradient-to-r from-primary to-[#FF6B8B] text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md shadow-2xs">
              Hemat {savePercentage}%
            </span>
          )}

          {/* Hover Overlay Action Button (Desktop) */}
          <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 hidden sm:flex">
            <span className="w-full py-2.5 px-3 rounded-xl bg-white/95 backdrop-blur-md text-text text-xs font-bold text-center shadow-md border border-black/[0.05] hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-1.5">
              <span>Lihat Detail</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* 2. Category & Rating Bar */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-accent truncate">
            {meta.category}
          </span>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
            <span className="text-[11px] font-bold text-text">4.9</span>
            <span className="text-[10px] text-text-secondary/70">(1k+)</span>
          </div>
        </div>

        {/* 3. Product Title */}
        <h3 className="font-serif text-base text-text font-bold leading-snug line-clamp-1 group-hover:text-primary transition-colors mb-1">
          {title}
        </h3>

        {/* 4. Active Ingredient / Clinical Benefit Subtitle */}
        <p className="text-[11px] text-text-secondary leading-normal line-clamp-1 mb-4">
          {meta.subtitle}
        </p>

        {/* 5. Price & Action Bottom Row */}
        <div className="mt-auto pt-3 border-t border-black/[0.04] flex items-center justify-between">
          <div>
            <div className="text-sm sm:text-base font-bold text-text">
              {price && <Money data={price} withoutTrailingZeros />}
            </div>
            {isDiscounted && compareAtPrice && (
              <div className="text-[11px] text-text-secondary/70 line-through -mt-0.5">
                <Money data={compareAtPrice} withoutTrailingZeros />
              </div>
            )}
          </div>

          <div className="w-8 h-8 rounded-full bg-accent-light text-accent group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all shadow-2xs flex-shrink-0 group-hover:scale-105">
            <ArrowRight className="w-4 h-4" />
          </div>
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
    <section className="relative w-full py-16 md:py-24 px-4 lg:px-8 bg-white border-b border-black/[0.04] overflow-hidden">
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
    <section className="relative w-full py-16 md:py-24 px-4 lg:px-8 bg-white border-b border-black/[0.04] overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        {/* Header & Section Title with Luxury Brand Badge */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FAF0F4] text-primary text-xs font-bold uppercase tracking-wider mb-2.5 border border-primary/15 shadow-2xs">
              <Flame className="w-3.5 h-3.5 fill-primary text-primary" />
              <span>Trending Now · Favorit Pelanggan</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-text tracking-tight">
              Best Sellers
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1.5 max-w-lg leading-relaxed">
              Formula terlaris dengan konsentrasi aktif presisi untuk mencerahkan, melembapkan, dan merawat kulit harian.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-end">
            <Link
              to="/collections/best-sellers"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#FAF7FD] hover:bg-primary text-text hover:text-white text-xs font-bold transition-all border border-black/[0.04] shadow-2xs"
            >
              <span>Lihat Semua Produk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Header Arrow Controls (Compact) */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                aria-label="Geser produk ke kiri"
                className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center text-text transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:bg-accent-light hover:enabled:text-primary hover:enabled:border-primary/40 shadow-2xs active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                aria-label="Geser produk ke kanan"
                className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center text-text transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:bg-accent-light hover:enabled:text-primary hover:enabled:border-primary/40 shadow-2xs active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Container Wrapper with Floating Side Nav Buttons */}
        <div className="relative group/carousel">
          {/* Floating Left Arrow (Desktop) */}
          <button
            type="button"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Geser produk ke kiri"
            className="hidden lg:flex absolute -left-5 top-[45%] -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-black/5 items-center justify-center text-text hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 cursor-pointer disabled:opacity-0 disabled:pointer-events-none hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Floating Right Arrow (Desktop) */}
          <button
            type="button"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Geser produk ke kanan"
            className="hidden lg:flex absolute -right-5 top-[45%] -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-black/5 items-center justify-center text-text hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 cursor-pointer disabled:opacity-0 disabled:pointer-events-none hover:scale-105 active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
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

        {/* Carousel Bottom Control Bar: Back/Next + Interactive Gradient Scrubber */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-between gap-5 border-t border-black/[0.05] pt-6">
          <div className="flex items-center gap-2.5 text-xs text-text font-semibold">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>
              Produk {String(currentProductIndex).padStart(2, '0')} dari{' '}
              {String(products.length).padStart(2, '0')} Terlaris
            </span>
          </div>

          {/* Interactive Gradient Progress Bar & Navigation Controls */}
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-center">
            {/* Bottom Back Button */}
            <button
              type="button"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Geser produk sebelumnya"
              className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl border border-black/10 bg-white hover:bg-accent-light hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-2xs active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {/* Clickable / Draggable Interactive Scrubber Track */}
            <div
              onClick={handleProgressClick}
              role="slider"
              aria-valuenow={Math.round(scrollProgress)}
              aria-valuemin={0}
              aria-valuemax={100}
              tabIndex={0}
              title="Klik pada garis untuk berpindah produk"
              className="relative w-36 sm:w-56 h-3 bg-black/[0.06] hover:bg-black/[0.1] rounded-full cursor-pointer transition-colors p-0.5 group/track"
            >
              <div
                className="h-full bg-gradient-to-r from-primary via-[#FF6B8B] to-accent rounded-full transition-all duration-150 ease-out relative"
                style={{
                  width: `${Math.max(12, scrollProgress)}%`,
                }}
              >
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-sm border border-primary/50" />
              </div>
            </div>

            {/* Bottom Next Button */}
            <button
              type="button"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Geser produk berikutnya"
              className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl border border-black/10 bg-white hover:bg-accent-light hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-2xs active:scale-95"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-xs text-text-secondary">
            <span>Bisa klik / drag geser kursor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// Section 7: Category Split (Essentials vs Bundles)
// ==========================================
function CategorySplit() {
  return (
    <section className="w-full px-4 lg:px-8 py-10 md:py-16 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* Card 1: Body Care Essentials */}
        <Link
          to="/collections/body-care"
          className="group relative rounded-2xl overflow-hidden min-h-[400px] sm:min-h-[460px] flex flex-col justify-end p-7 sm:p-10 border border-black/[0.06] shadow-xs transition-all duration-300 hover:shadow-md hover:border-accent/30"
        >
          {/* Full-Bleed Background Image */}
          <img
            src="https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_9.png?v=1781661846"
            alt="Beautyinu Body Care Essentials"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-700 ease-out"
            loading="lazy"
            width={1080}
            height={1080}
          />

          {/* Cinematic Gradient Overlay for Maximum Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/15 group-hover:from-black/95 transition-colors duration-300" />

          {/* Foreground Content */}
          <div className="relative z-10 max-w-md">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#AF8FD1] block mb-2.5">
              Perawatan Harian
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-white font-bold mb-2.5 leading-tight">
              Body Care Essentials
            </h3>
            <p className="text-xs sm:text-sm text-white/85 mb-6 leading-relaxed max-w-sm">
              Lotion jumbo 750ml, body wash, body cream &amp; booster powder mulai Rp 37.125.
            </p>
            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-primary text-text hover:text-white text-xs sm:text-sm font-bold transition-all shadow-xs group-hover:gap-3">
              <span>Lihat Produk Satuan</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </Link>

        {/* Card 2: Value Bundles */}
        <Link
          to="/collections/bundles"
          className="group relative rounded-2xl overflow-hidden min-h-[400px] sm:min-h-[460px] flex flex-col justify-end p-7 sm:p-10 border border-black/[0.06] shadow-xs transition-all duration-300 hover:shadow-md hover:border-primary/40"
        >
          {/* Full-Bleed Background Image */}
          <img
            src="https://cdn.shopify.com/s/files/1/0826/3372/0029/files/WebsiteBeautyinu-3.png?v=1784278179"
            alt="Beautyinu Sets and Bundles"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-700 ease-out"
            loading="lazy"
            width={1080}
            height={1080}
          />

          {/* Cinematic Gradient Overlay for Maximum Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/15 group-hover:from-black/95 transition-colors duration-300" />

          {/* Foreground Content */}
          <div className="relative z-10 max-w-md">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-primary block mb-2.5">
              Paket Hemat &amp; Bundling
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-white font-bold mb-2.5 leading-tight">
              Sets &amp; Bundles
            </h3>
            <p className="text-xs sm:text-sm text-white/85 mb-6 leading-relaxed max-w-sm">
              Rangkaian lengkap 3-in-1 hingga 5-in-1. Hemat hingga 47%, mulai Rp 121.143.
            </p>
            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold transition-all shadow-xs group-hover:gap-3">
              <span>Lihat Semua Paket</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}



// ==========================================
// Section 10: Social Proof & Customer Reviews
// ==========================================
function SocialProof() {
  return (
    <section className="w-full py-20 md:py-28 px-4 lg:px-8 bg-[#FAF8FC]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-accent block mb-2">
            Real Results · Real Reviews
          </span>
          <p className="font-serif text-4xl sm:text-5xl lg:text-6xl text-primary font-bold mb-3">
            1 Juta++ pcs
          </p>
          <p className="text-base sm:text-lg text-text-secondary font-medium">
            Produk terjual setiap bulan di seluruh Indonesia. Terbukti dipercaya ribuan beauty enthusiasts.
          </p>
        </div>

        {/* Verified Customer Quotes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 sm:p-10 flex flex-col justify-between border border-black/[0.04] shadow-xs">
            <div>
              <div className="flex items-center gap-1 text-[#F59E0B] mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#F59E0B]" />
                ))}
              </div>
              <p className="text-sm sm:text-base text-text leading-relaxed italic mb-8">
                “Menurutku sih ini worth it banget, cuma harus rutin dipake setiap hari, udah kelihatan bedanya. Apalagi gak mahal, gak ribet, aman, dan yang paling penting, emang sengaruh itu woiii.”
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span className="font-semibold text-text">Ba*******an</span>
              <span className="bg-accent-light px-2.5 py-0.5 rounded-md text-accent font-semibold border border-accent/20 text-[11px]">
                Verified Buyer
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 sm:p-10 flex flex-col justify-between border border-black/[0.04] shadow-xs">
            <div>
              <div className="flex items-center gap-1 text-[#F59E0B] mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#F59E0B]" />
                ))}
              </div>
              <p className="text-sm sm:text-base text-text leading-relaxed italic mb-8">
                “Jujur ini produknya bagus bangetttt, gak nyesel beli produk Beautyinu. Awalnya kulitku kusam dan belang. Sejak kenal Beautyinu, aku jadi glow up banget, kecintaanku banget deh!”
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span className="font-semibold text-text">vik******el</span>
              <span className="bg-accent-light px-2.5 py-0.5 rounded-md text-accent font-semibold border border-accent/20 text-[11px]">
                Verified Buyer
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// Section 11: Skincare Journal (Blog Preview)
// ==========================================
function BlogPreview({blogArticlesPromise}: {blogArticlesPromise: any}) {
  return (
    <section className="w-full py-20 md:py-28 px-4 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent">
              Jurnal &amp; Edukasi Kulit
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-text mt-1.5">
              Artikel Terbaru Beautyinu
            </h2>
          </div>
          <Link
            to="/blogs/news"
            className="text-sm font-semibold text-primary hover:text-primary-hover flex items-center gap-1 transition-colors"
          >
            <span>Lihat Semua Artikel</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <Suspense
          fallback={
            <div className="h-48 flex items-center justify-center text-text-secondary">
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
