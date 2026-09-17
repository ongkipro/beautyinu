import type {Route} from './+types/$';
import {getSeoMeta} from '~/lib/seo';
import {Link, useNavigate} from 'react-router';
import {useState} from 'react';
import {Breadcrumb} from '~/components/Breadcrumb';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Package,
  HelpCircle,
  MessageCircle,
  Home,
  Sparkles,
} from 'lucide-react';

export const meta: Route.MetaFunction = () => {
  return getSeoMeta({
    title: '404 · Halaman Tidak Ditemukan — Beautyinu Official Store',
    description:
      'Halaman yang Anda cari tidak dapat ditemukan atau telah diperbarui. Jelajahi katalog produk kecantikan resmi BPOM dari Beautyinu.',
    noIndex: true,
  });
};

export async function loader() {
  throw new Response('Page Not Found', {status: 404});
}

export default function CatchAll() {
  return <NotFoundContent />;
}

export function ErrorBoundary() {
  return <NotFoundContent />;
}

function NotFoundContent() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const quickLinks = [
    {
      title: 'Katalog Lengkap',
      subtitle: 'Semua produk perawatan tubuh berizin BPOM',
      href: '/collections/all',
      icon: ShoppingBag,
    },
    {
      title: 'Paket Hemat 3-in-1',
      subtitle: 'Kombinasi formulasi pencerah sinergis hemat 35%',
      href: '/collections/bundles',
      icon: Sparkles,
    },
    {
      title: 'Lacak Status Pesanan',
      subtitle: 'Cek posisi resi kurir real-time',
      href: '/pages/track-order',
      icon: Package,
    },
    {
      title: 'Pusat Bantuan & FAQ',
      subtitle: 'Jawaban lengkap seputar produk dan klaim',
      href: '/pages/faq',
      icon: HelpCircle,
    },
  ];

  return (
    <div className="w-full bg-white">
      {/* 1. Wayfinding Breadcrumbs */}
      <Breadcrumb
        variant="bar"
        items={[{label: 'Halaman Tidak Ditemukan (404)'}]}
      />

      {/* 2. Main Error Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
        {/* Kicker Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#FAF9FB] text-text-secondary text-xs font-mono font-medium tracking-wide mb-6 border border-black/[0.06]">
          <ShieldCheck className="w-3.5 h-3.5 text-accent" />
          <span>Status Kode · 404 Not Found</span>
        </div>

        {/* Large Aesthetic Numerical Indicator */}
        <div className="font-serif text-7xl sm:text-9xl text-black/[0.08] font-bold tracking-tighter leading-none select-none mb-2">
          404
        </div>

        {/* Heading & Subtitle */}
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-text font-normal tracking-tight mb-4">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-sm sm:text-base text-text-secondary max-w-xl mx-auto leading-relaxed mb-8">
          Halaman atau tautan yang kamu tuju mungkin sudah dipindahkan, tautan salah ketik, atau produk telah diperbarui. Silakan gunakan pencarian di bawah untuk menemukan produk favoritmu.
        </p>

        {/* Live Search Form */}
        <form
          onSubmit={handleSearch}
          className="max-w-md mx-auto mb-12 flex items-center bg-[#FAF9FB] border border-black/10 rounded-xl p-1.5 focus-within:border-black/30 transition-all shadow-2xs"
        >
          <div className="pl-3 text-black/40">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari sabun kefir, lotion, booster..."
            className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-text placeholder:text-black/40 focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#111111] hover:bg-primary active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 shadow-xs hover:shadow-md hover:shadow-primary/20 shrink-0 cursor-pointer"
          >
            Cari
          </button>
        </form>

        {/* Recommended Destinations Grid */}
        <div className="text-left mb-12">
          <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-black/40 mb-4 text-center">
            Rujukan Halaman Populer
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.title}
                  to={link.href}
                  className="group p-4 rounded-xl border border-black/[0.06] hover:border-black/20 bg-[#FAF9FB] hover:bg-white transition-all flex items-start gap-3.5 shadow-2xs"
                >
                  <div className="w-9 h-9 rounded-lg bg-white border border-black/[0.06] flex items-center justify-center shrink-0 text-text group-hover:text-primary transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-semibold text-text group-hover:text-primary transition-colors">
                        {link.title}
                      </h2>
                      <ArrowRight className="w-3.5 h-3.5 text-black/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5 leading-relaxed line-clamp-1">
                      {link.subtitle}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Emergency WhatsApp Contact Bar */}
        <div className="p-6 rounded-2xl bg-[#FFF8FA] border border-primary/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white border border-primary/20 flex items-center justify-center shrink-0 text-primary">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text">
                Butuh bantuan mencari pesanan atau produk?
              </h3>
              <p className="text-xs text-text-secondary">
                Customer Support Beautyinu siap melayani konsultasi via WhatsApp setiap hari.
              </p>
            </div>
          </div>
          <a
            href="https://wa.me/6287777118186?text=Halo%20Beautyinu,%20saya%20butuh%20bantuan%20terkait%20halaman%20atau%20produk."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-wider transition-all shrink-0 text-center shadow-xs"
          >
            Chat WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
