import {Suspense, useState, useEffect} from 'react';
import {Await, NavLink, useAsyncValue, Link, useLocation} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {SearchPopover} from '~/components/SearchPopover';
import logoUrl from '~/assets/logo-beauty-inu.webp';
import {
  Menu,
  Search,
  ShoppingBag,
  User,
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
  {label: 'Akun Saya', to: '/account'},
  {label: 'Lacak Pesanan', to: '/pages/track-order'},
  {label: 'Distributor Resmi', to: '/pages/distributor'},
  {label: 'FAQ', to: '/pages/faq'},
];

export function Header({isLoggedIn, cart}: HeaderProps) {
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  const isHomepage = pathname === '/';

  const isShopActive =
    (pathname.startsWith('/collections') && pathname !== '/collections/bundles') ||
    pathname.startsWith('/products');
  const isBundlesActive = pathname === '/collections/bundles';
  const isBlogActive = pathname.startsWith('/blogs');

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty(
        '--announcement-height',
        showAnnouncement ? '36px' : '0px'
      );
    }
  }, [showAnnouncement]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          setIsScrolled((prev) => {
            // Hysteresis buffer to prevent oscillation/jitter:
            // Switch to scrolled state when past 20px, only reset when near top (< 8px)
            if (!prev && currentY > 20) return true;
            if (prev && currentY < 8) return false;
            return prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* 1. Top Announcement Bar (Editorial Micro-Ticker) — Natural page scroll flow, zero jitter */}
      {showAnnouncement && (
        <div className="relative w-full bg-[#1A1A1A] text-white overflow-hidden py-2 px-4 transition-opacity duration-300">
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

      {/* 2. Main Navbar — Seamless blend with Hero on Homepage, Frosted Glass on Scroll */}
      <header className="sticky top-0 z-40 w-full transition-colors duration-300">
        <div
          className={`w-full transition-all duration-300 relative z-50 ${
            isScrolled
              ? 'bg-white/85 backdrop-blur-xl backdrop-saturate-180 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border-b border-black/[0.04]'
              : isHomepage
              ? 'bg-transparent border-b border-transparent'
              : 'bg-white/95 backdrop-blur-md border-b border-black/[0.04]'
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
                  className={`px-3.5 py-1.5 rounded-full text-[13px] xl:text-sm tracking-tight transition-all duration-200 flex items-center gap-1 cursor-pointer ${
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
                  className={`px-3.5 py-1.5 rounded-full text-[13px] xl:text-sm tracking-tight transition-all duration-200 flex items-center cursor-pointer ${
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
                className="px-3.5 py-1.5 rounded-full text-[13px] xl:text-sm font-semibold tracking-tight transition-all duration-200 text-text/75 hover:text-primary hover:bg-accent-light/50 cursor-pointer"
              >
                Panduan Kulit
              </a>

              {/* Item 4: Blog (Editorial Journal) */}
              <Link
                to="/blogs/news"
                prefetch="intent"
                className={`px-3.5 py-1.5 rounded-full text-[13px] xl:text-sm tracking-tight transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
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
                  isScrolled ? 'h-[27px] sm:h-8 md:h-8.5' : 'h-[34px] sm:h-9 md:h-10'
                }`}
                width={160}
                height={40}
              />
            </NavLink>
          </div>

          {/* Right Wing: Search + Account + Cart */}
          <div className="flex items-center justify-end gap-1 sm:gap-2 flex-1">
            {/* Search Toggle */}
            <SearchToggle />

            {/* Account Toggle */}
            <AccountToggle isLoggedIn={isLoggedIn} />

            {/* Cart Toggle */}
            <CartToggle cart={cart} />
          </div>
        </div>
      </div>
      {/* Floating Header Search Popover (Tooltip / Dropdown Modal) */}
      <SearchPopover />
    </header>
    </>
  );
}

function MobileMenuToggle() {
  const {type, open, close} = useAside();
  const isOpen = type === 'mobile';

  return (
    <button
      type="button"
      className={`group relative w-10 h-10 rounded-full -ml-1.5 flex items-center justify-center transition-all duration-300 focus:outline-none cursor-pointer active:scale-95 ${
        isOpen
          ? 'bg-[#111111] text-white shadow-xs'
          : 'text-text hover:text-primary hover:bg-black/[0.04]'
      }`}
      onClick={() => (isOpen ? close() : open('mobile'))}
      aria-label={isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
      aria-expanded={isOpen}
    >
      <div className="relative w-[19px] h-[13px] flex flex-col justify-between items-center">
        {/* Top Bar */}
        <span
          className={`h-[1.75px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isOpen
              ? 'w-[19px] bg-white translate-y-[5.6px] rotate-45'
              : 'w-[19px] bg-current'
          }`}
        />
        {/* Middle Bar (Architectural shorter bar - modern flat design signature) */}
        <span
          className={`h-[1.75px] rounded-full transition-all duration-200 ease-out origin-left ${
            isOpen
              ? 'w-0 opacity-0'
              : 'w-[13px] self-start bg-current group-hover:w-[19px]'
          }`}
        />
        {/* Bottom Bar */}
        <span
          className={`h-[1.75px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isOpen
              ? 'w-[19px] bg-white -translate-y-[5.6px] -rotate-45'
              : 'w-[19px] bg-current'
          }`}
        />
      </div>
    </button>
  );
}

function SearchToggle() {
  const {type, open, close} = useAside();
  const isOpen = type === 'search';
  return (
    <button
      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all focus:outline-none cursor-pointer ${
        isOpen
          ? 'bg-[#1A1A1A] text-white shadow-xs'
          : 'text-text hover:text-primary hover:bg-accent-light/50'
      }`}
      onClick={() => (isOpen ? close() : open('search'))}
      aria-label={isOpen ? 'Tutup pencarian' : 'Cari produk kecantikan'}
      aria-expanded={isOpen}
    >
      {isOpen ? (
        <X className="w-4 h-4" strokeWidth={1.5} />
      ) : (
        <Search className="w-5 h-5" strokeWidth={1.5} />
      )}
    </button>
  );
}

function CartBadge({count}: {count: number}) {
  const {type, open, close} = useAside();
  const isOpen = type === 'cart';
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <button
      type="button"
      className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all focus:outline-none cursor-pointer ${
        isOpen
          ? 'bg-[#1A1A1A] text-white shadow-xs'
          : 'text-text hover:text-primary hover:bg-accent-light/50'
      }`}
      onClick={() => {
        if (isOpen) {
          close();
        } else {
          open('cart');
          publish('cart_viewed', {
            cart,
            prevCart,
            shop,
            url: window.location.href || '',
          } as CartViewPayload);
        }
      }}
      aria-label={`Keranjang Belanja ${count} item`}
      aria-expanded={isOpen}
    >
      <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
      {count > 0 && (
        <span className="absolute top-1 right-1 bg-primary text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center shadow-2xs">
          {count}
        </span>
      )}
    </button>
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

function AccountToggle({isLoggedIn}: Pick<HeaderProps, 'isLoggedIn'>) {
  return (
    <Suspense fallback={<AccountBadge isLoggedIn={false} />}>
      <Await resolve={isLoggedIn}>
        {(loggedIn) => <AccountBadge isLoggedIn={Boolean(loggedIn)} />}
      </Await>
    </Suspense>
  );
}

function AccountBadge({isLoggedIn}: {isLoggedIn: boolean}) {
  return (
    <NavLink
      to="/account"
      prefetch="intent"
      className="hidden sm:flex relative w-10 h-10 rounded-full items-center justify-center text-text hover:text-primary hover:bg-accent-light/50 transition-colors focus:outline-none cursor-pointer"
      aria-label={isLoggedIn ? 'Akun Saya' : 'Masuk ke Akun'}
      title={isLoggedIn ? 'Akun Saya' : 'Masuk ke Akun'}
    >
      <User className="w-5 h-5" strokeWidth={1.5} />
      {isLoggedIn && (
        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary ring-2 ring-white" />
      )}
    </NavLink>
  );
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
  const isAccountActive = pathname.startsWith('/account');

  const [isShopExpanded, setIsShopExpanded] = useState(isShopActive);

  return (
    <div className="flex flex-col min-h-full justify-between p-5 pb-8 bg-white text-text overflow-y-auto overscroll-contain">
      <div>
        {/* Primary Nav List (Shop Accordion, Paket Hemat, Panduan Kulit, Blog, Akun Saya) */}
        <nav className="flex flex-col divide-y divide-black/[0.04]">
          {/* Shop Accordion Item */}
          <div className="py-1">
            <button
              type="button"
              onClick={() => setIsShopExpanded(!isShopExpanded)}
              className={`flex items-center justify-between w-full py-3.5 text-left cursor-pointer group ${
                isShopActive ? 'text-primary' : 'text-text'
              }`}
              aria-expanded={isShopExpanded}
            >
              <span className={`font-serif text-2xl tracking-tight transition-colors ${
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
              <div className="pl-3 pr-1 pt-1 pb-2 space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                <Link
                  to="/collections/frontpage"
                  onClick={close}
                  className="flex items-center justify-between py-2 text-sm text-text/80 hover:text-primary transition-colors"
                >
                  <span>Semua Produk</span>
                  <ChevronRight className="w-3.5 h-3.5 text-text-secondary/40" />
                </Link>
                <Link
                  to="/collections/body-care"
                  onClick={close}
                  className="flex items-center justify-between py-2 text-sm text-text/80 hover:text-primary transition-colors"
                >
                  <span>Body Care Series</span>
                  <ChevronRight className="w-3.5 h-3.5 text-text-secondary/40" />
                </Link>
                <Link
                  to="/collections/best-sellers"
                  onClick={close}
                  className="flex items-center justify-between py-2 text-sm text-text/80 hover:text-primary transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Best Sellers</span>
                    <span className="text-[9px] font-bold uppercase bg-accent-light text-accent px-1.5 py-0.5 rounded-full">
                      Favorit
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-text-secondary/40" />
                </Link>
                <Link
                  to="/products/kefir-collagen-soap-60gr"
                  onClick={close}
                  className="flex items-center justify-between py-2 text-sm text-text/80 hover:text-primary transition-colors"
                >
                  <span>Sabun Kefir Collagen</span>
                  <ChevronRight className="w-3.5 h-3.5 text-text-secondary/40" />
                </Link>
                <a
                  href="/#routine-system"
                  onClick={close}
                  className="flex items-center justify-between py-2 text-sm text-text/80 hover:text-primary transition-colors"
                >
                  <span>3-Step Daily Routine</span>
                  <ChevronRight className="w-3.5 h-3.5 text-text-secondary/40" />
                </a>
              </div>
            )}
          </div>

          {/* Paket Hemat Item */}
          <Link
            to="/collections/bundles"
            onClick={close}
            prefetch="intent"
            className={`flex items-center justify-between py-4 transition-colors group ${
              isBundlesActive ? 'text-primary font-semibold' : 'text-text hover:text-primary'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl tracking-tight">Paket Hemat</span>
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
            className="flex items-center justify-between py-4 text-text hover:text-primary transition-colors group"
          >
            <span className="font-serif text-2xl tracking-tight">Panduan Kulit</span>
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
            className={`flex items-center justify-between py-4 transition-colors group ${
              isBlogActive ? 'text-primary font-semibold' : 'text-text hover:text-primary'
            }`}
          >
            <span className="font-serif text-2xl tracking-tight">Blog</span>
            <ChevronRight
              className="w-4 h-4 text-text-secondary/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all"
              strokeWidth={1.5}
            />
          </Link>

          {/* Akun Saya (Featured prominently in mobile menu) */}
          <NavLink
            to="/account"
            onClick={close}
            prefetch="intent"
            className={`flex items-center justify-between py-4 transition-colors group ${
              isAccountActive ? 'text-primary font-semibold' : 'text-text hover:text-primary'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="font-serif text-2xl tracking-tight">Akun Saya</span>
            </div>
            <ChevronRight
              className="w-4 h-4 text-text-secondary/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all"
              strokeWidth={1.5}
            />
          </NavLink>
        </nav>

        {/* Secondary Utility Links */}
        <div className="mt-8 pt-5 border-t border-black/[0.04]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary/70 mb-3">
            Bantuan &amp; Kemitraan
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <NavLink
              to="/pages/track-order"
              onClick={close}
              prefetch="intent"
              className="text-xs text-text-secondary hover:text-primary transition-colors py-1 truncate"
            >
              Lacak Pesanan
            </NavLink>
            <NavLink
              to="/pages/distributor"
              onClick={close}
              prefetch="intent"
              className="text-xs text-text-secondary hover:text-primary transition-colors py-1 truncate"
            >
              Distributor Resmi
            </NavLink>
            <NavLink
              to="/pages/faq"
              onClick={close}
              prefetch="intent"
              className="text-xs text-text-secondary hover:text-primary transition-colors py-1 truncate"
            >
              FAQ
            </NavLink>
          </div>
        </div>
      </div>

      {/* Bottom WhatsApp Direct Advisor & Brand Trust Badge */}
      <div className="mt-8 pt-4 border-t border-black/[0.04] flex flex-col gap-3.5">
        <a
          href="https://wa.me/6287777118186?text=Halo%20Beautyinu%2C%20saya%20ingin%20konsultasi%20skincare"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between py-2 text-text hover:text-[#25D366] transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <MessageCircle className="w-4 h-4 text-[#25D366]" strokeWidth={1.5} />
            <span className="text-xs font-semibold">Konsultasi Kulit via WhatsApp</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-text-secondary/40 group-hover:text-[#25D366] group-hover:translate-x-0.5 transition-all" />
        </a>

        <div className="flex items-center justify-between text-[11px] text-text-secondary/60 font-mono tracking-wider pt-2 border-t border-black/[0.03] px-0.5">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
            100% BPOM CERTIFIED
          </span>
          <span>SURABAYA, ID</span>
        </div>
      </div>
    </div>
  );
}
