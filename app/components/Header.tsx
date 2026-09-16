import {Suspense, useState, useEffect} from 'react';
import {Await, NavLink, useAsyncValue, Link, useLocation} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import logoUrl from '~/assets/logo-beauty-inu.webp';
import {
  Menu,
  Search,
  ShoppingBag,
  Sparkles,
  Truck,
  ShieldCheck,
  X,
  ArrowRight,
  MessageCircle,
  ChevronRight,
  ChevronDown,
  Heart,
  Package,
  Layers,
  Sun,
  Flame,
  CheckCircle2,
} from 'lucide-react';

interface HeaderProps {
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
}

export const SECONDARY_LINKS = [
  {label: 'Lacak Pesanan', to: '/pages/track-order'},
  {label: 'Distributor Resmi', to: '/pages/distributor'},
  {label: 'FAQ', to: '/pages/faq'},
  {label: 'Pengiriman & Retur', to: '/pages/shipping-returns'},
];

export function Header({isLoggedIn, cart}: HeaderProps) {
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  const isShopActive =
    (pathname.startsWith('/collections') && pathname !== '/collections/bundles') ||
    pathname.startsWith('/products');
  const isBundlesActive = pathname === '/collections/bundles';
  const isBlogActive = pathname.startsWith('/blogs');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-300">
      {/* 1. Top Announcement Bar (Editorial Micro-Ticker) — Smoothly collapses on scroll */}
      {showAnnouncement && (
        <div
          className={`relative w-full bg-[#1A1A1A] text-white transition-all duration-300 ease-in-out overflow-hidden ${
            isScrolled ? 'max-h-0 py-0 opacity-0' : 'max-h-12 py-2 px-4 opacity-100'
          }`}
        >
          <div className="mx-auto max-w-7xl flex items-center justify-center gap-2.5 sm:gap-6 text-xs font-medium tracking-wide">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0" strokeWidth={1.5} />
              <span>Gratis Ongkir Min. Rp 150K</span>
            </div>
            <span className="text-white/20 hidden sm:inline">•</span>
            <div className="hidden sm:flex items-center gap-1.5 text-white/90">
              <ShieldCheck className="w-3.5 h-3.5 text-accent flex-shrink-0" strokeWidth={1.5} />
              <span>100% Terdaftar BPOM RI</span>
            </div>
            <span className="text-white/20 hidden md:inline">•</span>
            <div className="hidden md:flex items-center gap-1.5 text-white/90">
              <Heart className="w-3.5 h-3.5 text-primary flex-shrink-0" strokeWidth={1.5} />
              <span>Paket Hemat 3-in-1 Diskon s/d 47%</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAnnouncement(false)}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-1 cursor-pointer"
            aria-label="Tutup pengumuman"
          >
            <X className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
        </div>
      )}

      {/* 2. Main Navbar — Mid Center Logo with Apple/Luxury Frosted Glass on Scroll */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/75 backdrop-blur-xl backdrop-saturate-180 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border-b border-black/[0.04]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div
          className={`mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 relative transition-all duration-300 ${
            isScrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-20'
          }`}
        >
          {/* Left Wing: Curated 4 Menu Items (Shop Mega-Menu, Paket Hemat Tooltip, Panduan Kulit, Blog) */}
          <div className="flex items-center gap-4 xl:gap-6 flex-1">
            {/* Mobile Hamburger Toggle */}
            <div className="flex items-center lg:hidden">
              <MobileMenuToggle />
            </div>

            {/* Desktop Curated Nav with Mega-Menu Dropdown & Tooltip */}
            <nav className="hidden lg:flex items-center gap-1 sm:gap-1.5 xl:gap-2">
              {/* Item 1: Shop (Luxury Skincare Mega-Menu Dropdown) */}
              <div className="relative group">
                <Link
                  to="/collections/frontpage"
                  prefetch="intent"
                  className={`px-3.5 py-1.5 rounded-full text-[13px] tracking-tight transition-all duration-200 flex items-center gap-1 cursor-pointer ${
                    isShopActive
                      ? 'bg-primary/10 text-primary font-bold shadow-2xs'
                      : 'text-text/75 font-semibold hover:text-primary hover:bg-accent-light/50'
                  }`}
                >
                  <span>Shop</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 ${
                      isShopActive ? 'text-primary' : 'text-text/50 group-hover:text-primary'
                    }`}
                    strokeWidth={1.5}
                  />
                </Link>

                {/* Dropdown Floating Mega Menu Card */}
                <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none group-hover:pointer-events-auto z-50">
                  <div className="w-[680px] xl:w-[720px] rounded-2xl bg-white/98 backdrop-blur-xl shadow-2xl border border-black/[0.06] p-6 grid grid-cols-12 gap-6 text-left">
                    {/* Col 1: Katalog Utama */}
                    <div className="col-span-4 flex flex-col gap-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary/70">
                        Koleksi Produk
                      </p>
                      <div className="flex flex-col gap-1">
                        <Link
                          to="/collections/frontpage"
                          className="group/item flex flex-col py-1.5 px-2 rounded-xl hover:bg-accent-light/50 transition-colors"
                        >
                          <span className="text-xs font-semibold text-text group-hover/item:text-primary transition-colors">
                            Semua Produk
                          </span>
                          <span className="text-[11px] text-text-secondary">
                            Seluruh katalog bodycare resmi
                          </span>
                        </Link>
                        <Link
                          to="/collections/body-care"
                          className="group/item flex flex-col py-1.5 px-2 rounded-xl hover:bg-accent-light/50 transition-colors"
                        >
                          <span className="text-xs font-semibold text-text group-hover/item:text-primary transition-colors">
                            Body Care Series
                          </span>
                          <span className="text-[11px] text-text-secondary">
                            Lotion UV, Sabun &amp; Booster
                          </span>
                        </Link>
                        <Link
                          to="/collections/best-sellers"
                          className="group/item flex flex-col py-1.5 px-2 rounded-xl hover:bg-accent-light/50 transition-colors"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-text group-hover/item:text-primary transition-colors">
                              Best Sellers
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-accent-light text-accent px-1.5 py-0.5 rounded-full">
                              Favorit
                            </span>
                          </div>
                          <span className="text-[11px] text-text-secondary">
                            Formula terlaris pilihan konsumen
                          </span>
                        </Link>
                        <Link
                          to="/products/kefir-collagen-soap-60gr"
                          className="group/item flex flex-col py-1.5 px-2 rounded-xl hover:bg-accent-light/50 transition-colors"
                        >
                          <span className="text-xs font-semibold text-text group-hover/item:text-primary transition-colors">
                            Sabun Kefir Collagen
                          </span>
                          <span className="text-[11px] text-text-secondary">
                            Deep cleansing &amp; kesegaran alami
                          </span>
                        </Link>
                      </div>
                    </div>

                    {/* Col 2: Rutinitas & Solusi Kulit */}
                    <div className="col-span-4 flex flex-col gap-3 border-l border-black/[0.04] pl-5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary/70">
                        Rutinitas &amp; Solusi
                      </p>
                      <div className="flex flex-col gap-1">
                        <Link
                          to="/#routine-system"
                          className="group/item flex flex-col py-1.5 px-2 rounded-xl hover:bg-accent-light/50 transition-colors"
                        >
                          <span className="text-xs font-semibold text-text group-hover/item:text-primary transition-colors">
                            3-Step Daily Routine
                          </span>
                          <span className="text-[11px] text-text-secondary">
                            Cleanse, Boost &amp; Protect
                          </span>
                        </Link>
                        <Link
                          to="/collections/body-care"
                          className="group/item flex flex-col py-1.5 px-2 rounded-xl hover:bg-accent-light/50 transition-colors"
                        >
                          <span className="text-xs font-semibold text-text group-hover/item:text-primary transition-colors">
                            Kulit Kusam &amp; Belang
                          </span>
                          <span className="text-[11px] text-text-secondary">
                            Formula Niacinamide &amp; Arbutin
                          </span>
                        </Link>
                        <Link
                          to="/products/bright-glow-body-lotion-uv-filter-750ml"
                          className="group/item flex flex-col py-1.5 px-2 rounded-xl hover:bg-accent-light/50 transition-colors"
                        >
                          <span className="text-xs font-semibold text-text group-hover/item:text-primary transition-colors">
                            Perlindungan UV Tropis
                          </span>
                          <span className="text-[11px] text-text-secondary">
                            Proteksi dari sinar UV harian
                          </span>
                        </Link>
                        <Link
                          to="/pages/faq"
                          className="group/item flex flex-col py-1.5 px-2 rounded-xl hover:bg-accent-light/50 transition-colors"
                        >
                          <span className="text-xs font-semibold text-text group-hover/item:text-primary transition-colors">
                            Panduan Pakai &amp; FAQ
                          </span>
                          <span className="text-[11px] text-text-secondary">
                            Urutan &amp; tips cara pemakaian
                          </span>
                        </Link>
                      </div>
                    </div>

                    {/* Col 3: Spotlight Promo Bundling Card */}
                    <div className="col-span-4 rounded-2xl bg-gradient-to-br from-[#FAF7FD] to-[#F3EEFA] p-4 flex flex-col justify-between border border-black/[0.04]">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/80 text-primary px-2 py-0.5 rounded-full shadow-2xs">
                            Best Deal
                          </span>
                          <span className="text-[11px] font-extrabold text-accent">
                            Hemat 47%
                          </span>
                        </div>
                        <h4 className="font-serif text-sm font-bold text-text mb-1">
                          Glowing Set (3-in-1)
                        </h4>
                        <p className="text-[11px] text-text-secondary leading-relaxed mb-3">
                          Tiga langkah sinergis untuk hasil cerah maksimal, bebas belang &amp; lembut sepanjang hari.
                        </p>
                      </div>
                      <Link
                        to="/collections/bundles"
                        className="flex items-center justify-center gap-1.5 w-full py-2 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition-colors shadow-xs"
                      >
                        <span>Lihat Paket Promo</span>
                        <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Item 2: Paket Hemat (With Refined Top Discount Badge & Rich Hover Tooltip) */}
              <div className="relative group">
                <Link
                  to="/collections/bundles"
                  prefetch="intent"
                  className={`px-3.5 py-1.5 rounded-full text-[13px] tracking-tight transition-all duration-200 flex items-center cursor-pointer ${
                    isBundlesActive
                      ? 'bg-primary/10 text-primary font-bold shadow-2xs'
                      : 'text-text/75 font-semibold hover:text-primary hover:bg-accent-light/50'
                  }`}
                >
                  <span>Paket Hemat</span>
                </Link>

                {/* Sleek Refined Floating Top Badge — Pinned Above Top-Center */}
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap text-[9px] font-bold tracking-wider uppercase bg-gradient-to-r from-primary to-[#FF6B8B] text-white px-2 py-0.5 rounded-full shadow-xs ring-2 ring-white transition-transform duration-200 group-hover:scale-105">
                  Hemat 47%
                </span>

                {/* Rich Interactive Hover Tooltip Box (Restored with Luxury Glass Polish) */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none group-hover:pointer-events-auto z-50">
                  <div className="w-64 p-4 rounded-2xl bg-white/98 backdrop-blur-xl shadow-2xl border border-black/[0.06] text-left">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        Super Value
                      </span>
                      <span className="text-[11px] font-bold text-accent">
                        Diskon s/d 47%
                      </span>
                    </div>
                    <p className="text-xs font-bold text-text mb-1">
                      Bundling Perawatan Hemat
                    </p>
                    <p className="text-[11px] text-text-secondary leading-relaxed mb-3">
                      Beli paket 3-in-1 lebih hemat hingga Rp 99.158 dibanding beli satuan, plus gratis ongkir.
                    </p>
                    <Link
                      to="/collections/bundles"
                      className="text-[11px] font-bold text-primary hover:text-primary-hover flex items-center gap-1 transition-colors"
                    >
                      <span>Eksplor Semua Bundles</span>
                      <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Item 3: Panduan Kulit (Skin Routine & Matcher Guide) */}
              <a
                href="/#routine-system"
                className="px-3.5 py-1.5 rounded-full text-[13px] font-semibold tracking-tight transition-all duration-200 text-text/75 hover:text-primary hover:bg-accent-light/50 cursor-pointer"
              >
                Panduan Kulit
              </a>

              {/* Item 4: Blog (Editorial Journal) */}
              <Link
                to="/blogs/news"
                prefetch="intent"
                className={`px-3.5 py-1.5 rounded-full text-[13px] tracking-tight transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  isBlogActive
                    ? 'bg-primary/10 text-primary font-bold shadow-2xs'
                    : 'text-text/75 font-semibold hover:text-primary hover:bg-accent-light/50'
                }`}
              >
                <span>Blog</span>
              </Link>
            </nav>
          </div>

          {/* Mid Center: Brand Logo (Mathematically Centered) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-auto">
            <NavLink
              prefetch="intent"
              to="/"
              end
              className="flex items-center justify-center focus:outline-none py-1 group"
              aria-label="Beautyinu Homepage"
            >
              <img
                src={logoUrl}
                alt="Beautyinu — Your Bodycare Bestie"
                className={`w-auto object-contain transition-all duration-300 group-hover:scale-[1.02] ${
                  isScrolled ? 'h-6 sm:h-7 md:h-8' : 'h-7 sm:h-8 md:h-10'
                }`}
                width={160}
                height={40}
              />
            </NavLink>
          </div>

          {/* Right Wing: Quick WA Pill + Search + Cart */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 flex-1">
            {/* Desktop WA Consultation Quick Pill */}
            <a
              href="https://wa.me/6287777118186?text=Halo%20Beautyinu%2C%20saya%20ingin%20konsultasi%20skincare"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-accent-light hover:bg-primary text-text hover:text-white transition-all shadow-2xs group"
              aria-label="Konsultasi langsung via WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-primary group-hover:text-white transition-colors" strokeWidth={1.5} />
              <span>Tanya CS</span>
            </a>

            {/* Search Toggle */}
            <SearchToggle />

            {/* Cart Toggle */}
            <CartToggle cart={cart} />
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileMenuToggle() {
  const {open} = useAside();
  return (
    <button
      className="w-10 h-10 rounded-full -ml-2 flex items-center justify-center text-text hover:text-primary hover:bg-accent-light/50 transition-colors focus:outline-none cursor-pointer"
      onClick={() => open('mobile')}
      aria-label="Buka navigasi menu"
    >
      <Menu className="w-5 h-5" strokeWidth={1.5} />
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button
      className="w-10 h-10 rounded-full flex items-center justify-center text-text hover:text-primary hover:bg-accent-light/50 transition-colors focus:outline-none cursor-pointer"
      onClick={() => open('search')}
      aria-label="Cari produk kecantikan"
    >
      <Search className="w-5 h-5" strokeWidth={1.5} />
    </button>
  );
}

function CartBadge({count}: {count: number}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      className="relative w-10 h-10 rounded-full flex items-center justify-center text-text hover:text-primary hover:bg-accent-light/50 transition-colors focus:outline-none cursor-pointer"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
      aria-label={`Keranjang Belanja ${count} item`}
    >
      <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
      {count > 0 && (
        <span className="absolute top-1 right-1 bg-primary text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center shadow-2xs">
          {count}
        </span>
      )}
    </a>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

export function MobileMenu() {
  const {close} = useAside();
  const location = useLocation();
  const pathname = location.pathname;

  const isShopActive =
    (pathname.startsWith('/collections') && pathname !== '/collections/bundles') ||
    pathname.startsWith('/products');
  const isBundlesActive = pathname === '/collections/bundles';
  const isBlogActive = pathname.startsWith('/blogs');

  const [isShopExpanded, setIsShopExpanded] = useState(isShopActive);

  return (
    <div className="flex flex-col min-h-full justify-between pb-6 bg-white text-text">
      <div>
        {/* 1. Featured Promo Card Highlight */}
        <div className="rounded-2xl bg-gradient-to-br from-surface via-white to-accent-light/50 border border-border p-4 mb-5 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              Best Deal
            </span>
            <span className="text-[11px] font-bold text-accent">Diskon s/d 47%</span>
          </div>
          <h4 className="font-serif text-base font-bold text-text mb-1">
            Glowing Set (3-in-1) Routine
          </h4>
          <p className="text-xs text-text-secondary mb-3 leading-relaxed">
            Sinergi Cleanse, Boost &amp; Protect untuk kulit tampak cerah alami dan lembap terawat.
          </p>
          <Link
            to="/collections/bundles"
            onClick={close}
            className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <span>Lihat Paket Hemat</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </Link>
        </div>

        {/* 2. Primary 4 Nav Items (Shop with Accordion, Paket Hemat with Badge, Panduan Kulit, Blog) */}
        <nav className="flex flex-col divide-y divide-black/[0.04]">
          {/* Shop Accordion Item */}
          <div className="py-2">
            <button
              type="button"
              onClick={() => setIsShopExpanded(!isShopExpanded)}
              className={`flex items-center justify-between w-full py-2 text-left cursor-pointer group ${
                isShopActive ? 'text-primary' : 'text-text'
              }`}
              aria-expanded={isShopExpanded}
            >
              <span className={`font-serif text-xl sm:text-2xl tracking-tight transition-colors ${
                isShopActive ? 'text-primary font-bold' : 'group-hover:text-primary'
              }`}>
                Shop
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isShopExpanded ? 'rotate-180 text-primary' : 'text-text-secondary'
                }`}
                strokeWidth={1.5}
              />
            </button>

            {isShopExpanded && (
              <div className="pl-3 pr-1 pt-2 pb-1 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <Link
                  to="/collections/frontpage"
                  onClick={close}
                  className="flex items-center justify-between py-1.5 text-sm text-text/80 hover:text-primary transition-colors"
                >
                  <span>Semua Produk</span>
                  <ChevronRight className="w-3.5 h-3.5 text-text-secondary/50" />
                </Link>
                <Link
                  to="/collections/body-care"
                  onClick={close}
                  className="flex items-center justify-between py-1.5 text-sm text-text/80 hover:text-primary transition-colors"
                >
                  <span>Body Care Series</span>
                  <ChevronRight className="w-3.5 h-3.5 text-text-secondary/50" />
                </Link>
                <Link
                  to="/collections/best-sellers"
                  onClick={close}
                  className="flex items-center justify-between py-1.5 text-sm text-text/80 hover:text-primary transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Best Sellers</span>
                    <span className="text-[9px] font-bold uppercase bg-accent-light text-accent px-1.5 py-0.2 rounded-full">
                      Favorit
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-text-secondary/50" />
                </Link>
                <Link
                  to="/products/kefir-collagen-soap-60gr"
                  onClick={close}
                  className="flex items-center justify-between py-1.5 text-sm text-text/80 hover:text-primary transition-colors"
                >
                  <span>Sabun Kefir Collagen</span>
                  <ChevronRight className="w-3.5 h-3.5 text-text-secondary/50" />
                </Link>
                <a
                  href="/#routine-system"
                  onClick={close}
                  className="flex items-center justify-between py-1.5 text-sm text-text/80 hover:text-primary transition-colors"
                >
                  <span>3-Step Daily Routine</span>
                  <ChevronRight className="w-3.5 h-3.5 text-text-secondary/50" />
                </a>
              </div>
            )}
          </div>

          {/* Paket Hemat Item */}
          <Link
            to="/collections/bundles"
            onClick={close}
            prefetch="intent"
            className={`flex items-center justify-between py-3.5 transition-colors group ${
              isBundlesActive ? 'text-primary font-semibold' : 'text-text hover:text-primary'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl sm:text-2xl tracking-tight">Paket Hemat</span>
              <span className="text-[10px] font-sans font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">
                Hemat 47%
              </span>
            </div>
            <ChevronRight
              className="w-4 h-4 text-text-secondary/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all"
              strokeWidth={1.5}
            />
          </Link>

          {/* Panduan Kulit Item */}
          <a
            href="/#routine-system"
            onClick={close}
            className="flex items-center justify-between py-3.5 text-text hover:text-primary transition-colors group"
          >
            <span className="font-serif text-xl sm:text-2xl tracking-tight">Panduan Kulit</span>
            <ChevronRight
              className="w-4 h-4 text-text-secondary/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all"
              strokeWidth={1.5}
            />
          </a>

          {/* Blog Item */}
          <Link
            to="/blogs/news"
            onClick={close}
            prefetch="intent"
            className={`flex items-center justify-between py-3.5 transition-colors group ${
              isBlogActive ? 'text-primary font-semibold' : 'text-text hover:text-primary'
            }`}
          >
            <span className="font-serif text-xl sm:text-2xl tracking-tight">Blog</span>
            <ChevronRight
              className="w-4 h-4 text-text-secondary/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all"
              strokeWidth={1.5}
            />
          </Link>
        </nav>

        {/* 3. Daily Routine Shortcut */}
        <div className="mt-4 pt-3 border-t border-black/[0.04]">
          <a
            href="/#routine-system"
            onClick={close}
            className="flex items-center justify-between p-3 rounded-xl bg-surface hover:bg-accent-light/60 transition-colors border border-border group"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-primary" strokeWidth={1.5} />
              <span className="text-xs font-semibold text-text group-hover:text-primary transition-colors">
                Lihat 3-Step Daily Routine
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-text-secondary group-hover:text-primary transition-colors" strokeWidth={1.5} />
          </a>
        </div>

        {/* 4. Secondary Utility Links */}
        <div className="mt-5 pt-4 border-t border-black/[0.04]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2.5">
            Bantuan &amp; Kemitraan
          </p>
          <div className="grid grid-cols-2 gap-2">
            {SECONDARY_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={close}
                prefetch="intent"
                className="text-xs text-text-secondary hover:text-primary transition-colors py-1 truncate"
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Bottom WhatsApp Direct Advisor & Brand Trust Badge */}
      <div className="mt-6 pt-2 flex flex-col gap-4">
        {/* Direct WhatsApp Advisor */}
        <a
          href="https://wa.me/6287777118186?text=Halo%20Beautyinu%2C%20saya%20ingin%20konsultasi%20skincare"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3.5 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-all text-text group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
              <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-text">Konsultasi Kulit Gratis</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
              </div>
              <p className="text-[11px] text-text-secondary">Chat WhatsApp Beauty Bestie</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-text-secondary group-hover:text-[#25D366] group-hover:translate-x-0.5 transition-all" strokeWidth={1.5} />
        </a>

        {/* BPOM and Origin Trust Footnote */}
        <div className="pt-3 border-t border-black/[0.04] flex items-center justify-between text-[11px] text-text-secondary font-medium">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
            100% BPOM Certified
          </span>
          <span>Surabaya, Indonesia</span>
        </div>
      </div>
    </div>
  );
}
