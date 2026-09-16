import {NavLink} from 'react-router';
import logoUrl from '~/assets/logo-beauty-inu.webp';

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-[#FFF5F8] via-[#FAF7FD] to-[#F3EEFA] text-text mt-auto overflow-hidden">
      {/* 1. Ambient Background Architectural Watermark — Smooth, Subtle & Elegant */}
      <div className="absolute top-0 inset-x-0 flex flex-col items-center justify-start pt-2 sm:pt-4 pointer-events-none select-none overflow-hidden z-0">
        <span className="font-serif font-black tracking-tight uppercase leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#AF8FD1]/12 via-[#AF8FD1]/06 to-transparent text-[16vw] sm:text-[18vw] whitespace-nowrap">
          BEAUTYINU
        </span>
        <span className="font-sans font-bold tracking-[0.65em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#AF8FD1]/08 via-[#F97F9E]/10 to-[#AF8FD1]/08 text-[3.5vw] sm:text-[4vw] -mt-[2.5vw] whitespace-nowrap">
          SKINCARE
        </span>
      </div>

      {/* 2. Beautyinu Brand Sparkle & Pearl Micro-Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23AF8FD1' fill-rule='evenodd'%3E%3Cpath d='M30 18c.5 5 2 7 7 7.5-5 .5-6.5 2-7 7-.5-5-2-6.5-7-7 5-.5 6.5-2 7-7.5z'/%3E%3Ccircle cx='10' cy='10' r='1.2' fill='%23F97F9E'/%3E%3Ccircle cx='50' cy='50' r='1.2' fill='%23F97F9E'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* 3. Foreground Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8 pt-16 lg:pt-20 pb-12">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Col 1: Brand & Identity (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <NavLink to="/" className="inline-block" aria-label="Beautyinu Home">
              <img
                src={logoUrl}
                alt="Beautyinu — Your Bodycare Bestie"
                className="h-8.5 w-auto object-contain transition-transform duration-300 hover:scale-[1.02]"
                width={140}
                height={34}
              />
            </NavLink>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-sm">
              Your bodycare bestie untuk kulit bersih, lembap, dan cerah merata. Diformulasikan lembut berizin BPOM RI untuk daily glow ritual perempuan Indonesia.
            </p>
            <div className="pt-2 text-xs text-text-secondary/75 space-y-2 border-t border-black/[0.04]">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-[#25D366]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-semibold text-text text-[11px] tracking-tight">CV. Dinare Anugrah Kosmetika</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary/80 text-[11px]">
                <div className="w-5 h-5 rounded-md bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span>Surabaya, Jawa Timur, Indonesia</span>
              </div>
            </div>
          </div>

          {/* Col 2: Koleksi Produk (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-text mb-5">
              Koleksi Produk
            </h4>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    prefetch="intent"
                    className="group/link flex items-center justify-between text-xs sm:text-sm text-text-secondary hover:text-primary transition-all font-medium py-0.5"
                  >
                    <span>{link.label}</span>
                    <svg
                      className="w-3 h-3 text-primary opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Bantuan & Informasi (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-text mb-5">
              Bantuan &amp; Info
            </h4>
            <ul className="space-y-2.5">
              {HELP_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    prefetch="intent"
                    className="group/link flex items-center justify-between text-xs sm:text-sm text-text-secondary hover:text-primary transition-all font-medium py-0.5"
                  >
                    <span>{link.label}</span>
                    <svg
                      className="w-3 h-3 text-primary opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Layanan Pelanggan & WhatsApp Frosted Card (4 cols) */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-text mb-5">
              Layanan Pelanggan
            </h4>
            <div className="rounded-2xl bg-white/50 backdrop-blur-xl border border-white/80 shadow-[0_8px_32px_rgba(175,143,209,0.08),inset_0_1px_2px_rgba(255,255,255,0.9)] p-6 hover:bg-white/65 hover:border-white hover:shadow-[0_14px_40px_rgba(175,143,209,0.14)] transition-all duration-300 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse ring-4 ring-[#25D366]/20" />
                  Live Chat Konsultasi
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-white/70 backdrop-blur-xs text-accent border border-accent/20 px-2.5 py-0.5 rounded-md shadow-2xs">
                  Fast Response
                </span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Butuh saran pemilihan produk atau info pesanan? Hubungi beauty advisor resmi kami.
              </p>
              <a
                href="https://wa.me/6287777118186?text=Halo%20Beautyinu%2C%20saya%20ingin%20konsultasi%20produk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 w-full py-3 px-5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold transition-all shadow-[0_4px_16px_rgba(37,211,102,0.3)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.4)] hover:scale-[1.01] group cursor-pointer"
              >
                {/* Authentic WhatsApp SVG vector icon */}
                <svg className="w-4 h-4 fill-current text-white flex-shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>Chat WhatsApp: +62 877-7711-8186</span>
              </a>
              <div className="text-[11px] text-text-secondary/70 pt-1.5 leading-relaxed border-t border-black/[0.04] space-y-1">
                <div className="flex items-center gap-1.5 font-medium">
                  <svg className="w-3.5 h-3.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Senin – Sabtu: 09.00 – 18.00 WIB</span>
                </div>
                <p className="text-text-secondary/50 pl-5">Minggu &amp; Libur Nasional: Slow Response</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Payment & Shipping Partners Row — Authentic, Minimalist, No AI Slop */}
        <div className="mt-12 pt-6 border-t border-black/[0.04] flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-text-secondary/70">
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-center md:justify-start">
            <span className="font-semibold text-text text-[11px]">Metode Pembayaran:</span>
            <span className="px-2 py-0.5 rounded-md bg-white border border-black/[0.06] font-medium text-[10px] text-text">QRIS</span>
            <span className="px-2 py-0.5 rounded-md bg-white border border-black/[0.06] font-medium text-[10px] text-text">BCA</span>
            <span className="px-2 py-0.5 rounded-md bg-white border border-black/[0.06] font-medium text-[10px] text-text">Mandiri</span>
            <span className="px-2 py-0.5 rounded-md bg-white border border-black/[0.06] font-medium text-[10px] text-text">COD (Bayar di Tempat)</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-center md:justify-end">
            <span className="font-semibold text-text text-[11px]">Partner Kurir:</span>
            <span className="px-2 py-0.5 rounded-md bg-white border border-black/[0.06] font-medium text-[10px] text-text">J&amp;T Express</span>
            <span className="px-2 py-0.5 rounded-md bg-white border border-black/[0.06] font-medium text-[10px] text-text">JNE</span>
            <span className="px-2 py-0.5 rounded-md bg-white border border-black/[0.06] font-medium text-[10px] text-text">SiCepat</span>
          </div>
        </div>

        {/* 5. Bottom Copyright, Socials & Legal Links — Minimalist & Clean */}
        <div className="mt-6 pt-6 border-t border-black/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-secondary/70">
          <p>© {new Date().getFullYear()} Beautyinu Skincare. CV. Dinare Anugrah Kosmetika. All rights reserved.</p>

          <div className="flex items-center gap-4 sm:gap-5">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary/60 hover:text-primary transition-colors"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
            <span className="text-black/15">|</span>
            <NavLink to="/pages/privacy-policy" className="hover:text-primary transition-colors">
              Kebijakan Privasi
            </NavLink>
            <span className="text-black/15">·</span>
            <NavLink to="/pages/terms-of-service" className="hover:text-primary transition-colors">
              Syarat &amp; Ketentuan
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

const SHOP_LINKS = [
  {label: 'Semua Produk', to: '/collections/frontpage'},
  {label: 'Body Care Series', to: '/collections/body-care'},
  {label: 'Paket Hemat', to: '/collections/bundles'},
  {label: 'Best Sellers', to: '/collections/best-sellers'},
  {label: 'Blog & Panduan', to: '/blogs/news'},
];

const HELP_LINKS = [
  {label: 'Tentang Kami', to: '/pages/about'},
  {label: 'FAQ', to: '/pages/faq'},
  {label: 'Lacak Pesanan', to: '/pages/track-order'},
  {label: 'Pengiriman & Retur', to: '/pages/shipping-returns'},
  {label: 'Distributor Resmi', to: '/pages/distributor'},
  {label: 'Customer Care', to: '/pages/contact'},
];

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/beautyinu.id',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com/@beautyinu.official',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
];
