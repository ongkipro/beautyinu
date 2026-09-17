import {useState} from 'react';
import {Link, redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/pages.$handle';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {getSeoMeta, buildBreadcrumbJsonLd, buildFaqJsonLd} from '~/lib/seo';
import {FAQ_ITEMS, FAQ_CATEGORIES} from '~/data/faqData';
import {Breadcrumb} from '~/components/Breadcrumb';
import {
  ChevronDown,
  ShieldCheck,
  MessageCircle,
  Mail,
  Clock,
  MapPin,
  ExternalLink,
  Truck,
  Sparkles,
  Users,
  Gift,
  ArrowRight,
  HelpCircle,
  Search,
  Check,
  Phone,
  Award,
  FileText,
  RotateCcw,
  CheckCircle2,
  Package,
} from 'lucide-react';

const PAGE_301_REDIRECTS: Record<string, string> = {
  'tentang-kami': 'about',
  'tentang': 'about',
  'about-us': 'about',
  'kontak': 'contact',
  'hubungi-kami': 'contact',
  'contact-us': 'contact',
  'pengiriman-retur': 'shipping-returns',
  'pengiriman-dan-retur': 'shipping-returns',
  'kebijakan-pengiriman': 'shipping-returns',
  'faqs': 'faq',
  'bantuan': 'faq',
  'pelacakan-pesanan': 'track-order',
  'lacak-pesanan': 'track-order',
  'kemitraan': 'distributor',
  'reseller': 'distributor',
  'keagenan': 'distributor',
};

// Clean any potential emoji symbols from incoming CMS content for brand consistency
function cleanCmsHtml(html: string): string {
  if (!html) return '';
  return html.replace(
    /👉|✨|🌸|💖|🌿|🧴|📦|🚚|⏰|📍|⭐|[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu,
    '',
  );
}

export const meta: Route.MetaFunction = ({data}) => {
  if (!data?.page) {
    return getSeoMeta({title: 'Halaman Tidak Ditemukan — Beautyinu'});
  }
  const {page, canonicalUrl} = data;
  const title = page.seo?.title || `${page.title} — Beautyinu Official Store`;
  const description =
    page.seo?.description ||
    page.body?.replace(/<[^>]+>/g, '').trim().slice(0, 160) ||
    `${page.title} — Beautyinu Official Store Indonesia.`;

  const siteUrl = 'https://beautyinu.id';
  const pageUrl = canonicalUrl || `${siteUrl}/pages/${page.handle}`;
  const jsonLdList: Array<Record<string, unknown>> = [
    buildBreadcrumbJsonLd([
      {name: 'Home', url: siteUrl},
      {name: page.title, url: pageUrl},
    ]),
  ];

  if (page.handle === 'faq') {
    jsonLdList.push(buildFaqJsonLd(FAQ_ITEMS));
  }

  return getSeoMeta({
    title,
    description,
    url: canonicalUrl,
    type: 'website',
    jsonLd: jsonLdList,
  });
};

export async function loader(args: Route.LoaderArgs) {
  const criticalData = await loadCriticalData(args);
  return criticalData;
}

async function loadCriticalData({context, request, params}: Route.LoaderArgs) {
  if (!params.handle) {
    throw new Response('Not found', {status: 404});
  }

  const targetHandle = PAGE_301_REDIRECTS[params.handle];
  if (targetHandle) {
    const url = new URL(request.url);
    url.pathname = `/pages/${targetHandle}`;
    throw redirect(url.toString(), 301);
  }

  const [{page}] = await Promise.all([
    context.storefront.query(PAGE_QUERY, {
      variables: {handle: params.handle},
    }),
  ]);

  if (!page) {
    throw new Response('Not found', {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle: params.handle, data: page});
  return {
    page,
    canonicalUrl: `${new URL(request.url).origin}/pages/${page.handle}`,
  };
}

export default function Page() {
  const {page} = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-white">
      {/* Route-specific Architectural Enrichers */}
      {page.handle === 'contact' && <ContactView page={page} />}
      {page.handle === 'faq' && <FaqView page={page} />}
      {page.handle === 'track-order' && <TrackOrderView page={page} />}
      {page.handle === 'distributor' && <DistributorView page={page} />}
      {page.handle === 'about' && <AboutView page={page} />}
      {page.handle === 'shipping-returns' && <ShippingReturnsView page={page} />}

      {/* Fallback for other standard pages */}
      {!['contact', 'faq', 'track-order', 'distributor', 'about', 'shipping-returns'].includes(
        page.handle,
      ) && <GenericView page={page} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 1. Shared Page Header Component
// ---------------------------------------------------------------------------
function PageHeader({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      {/* 1. Standardized Breadcrumbs Wayfinding Bar */}
      <Breadcrumb
        variant="bar"
        items={[{label: title}]}
      />

      {/* 2. Page Header Content */}
      <div className="border-b border-black/[0.06] bg-[#FAF9FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="max-w-3xl">
            <p className="text-[10px] sm:text-[11px] font-mono font-medium uppercase tracking-[0.25em] text-black/50 mb-2.5">
              {kicker}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[50px] text-text font-normal leading-[1.15] tracking-tight mb-4">
              {title}
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed font-normal">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. CONTACT US VIEW
// ---------------------------------------------------------------------------
function ContactView({page}: {page: any}) {
  return (
    <div>
      <PageHeader
        kicker="Beautyinu · Customer Care"
        title="Hubungi Tim Beautyinu"
        subtitle="Konsultasi perawatan tubuh, bantuan pesanan, konfirmasi pengiriman, atau peluang kerja sama bisnis. Tim Customer Care kami siap membantu Anda."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* 3 Primary Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1: WhatsApp Customer Care */}
          <div className="rounded-xl border border-black/[0.06] bg-white p-6 sm:p-7 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100/70 text-emerald-800">
                  Fast Response
                </span>
              </div>
              <h3 className="font-serif text-xl text-text mb-2 font-normal">
                Layanan Konsumen &amp; Pemesanan
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-6">
                Konsultasi pemilihan produk, panduan pemakaian, konfirmasi resi pengiriman, serta bantuan pesanan harian.
              </p>
            </div>
            <div>
              <div className="text-xs font-mono text-text-secondary mb-3 font-medium">
                +62 877-7711-8186
              </div>
              <a
                href="https://wa.me/6287777118186?text=Halo%20Customer%20Care%20Beautyinu%2C%20saya%20ingin%20konsultasi%20produk"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-3 px-4 transition-all shadow-xs"
              >
                <span>Chat WhatsApp Resmi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Card 2: WhatsApp Partnership & Distributor */}
          <div className="rounded-xl border border-black/[0.06] bg-white p-6 sm:p-7 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                  Kemitraan
                </span>
              </div>
              <h3 className="font-serif text-xl text-text mb-2 font-normal">
                Partnership, Reseller &amp; Komunitas
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-6">
                Program Brightygengs (Creator/Afiliasi), pendaftaran Distributor &amp; Reseller resmi, serta inisiatif komunitas Moonbabies.
              </p>
            </div>
            <div>
              <div className="text-xs font-mono text-text-secondary mb-3 font-medium">
                +62 819-3657-4690
              </div>
              <a
                href="https://wa.me/6281936574690?text=Halo%20Tim%20Kemitraan%20Beautyinu%2C%20saya%20tertarik%20bergabung%20sebagai%20mitra"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary hover:bg-primary-hover text-white text-xs font-semibold py-3 px-4 transition-all shadow-xs"
              >
                <span>Hubungi Tim Kemitraan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Card 3: Official Email */}
          <div className="rounded-xl border border-black/[0.06] bg-white p-6 sm:p-7 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-accent/10 text-accent">
                  Email Resmi
                </span>
              </div>
              <h3 className="font-serif text-xl text-text mb-2 font-normal">
                Korespondensi &amp; Administrasi
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-6">
                Pertanyaan formal, penawaran kerja sama korporasi, verifikasi transaksi, serta laporan administrasi bisnis.
              </p>
            </div>
            <div>
              <div className="text-xs font-mono text-text-secondary mb-3 font-medium">
                support@beautyinu.id
              </div>
              <a
                href="mailto:support@beautyinu.id"
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-[#111111] hover:bg-primary text-white text-xs font-semibold py-3 px-4 transition-all duration-200 shadow-xs hover:shadow-md hover:shadow-primary/25"
              >
                <span>Kirim Email Resmi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Secondary Info: Schedule, Office & Social Channels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Operating Hours */}
          <div className="rounded-xl border border-black/[0.06] bg-[#FAF9FB] p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <Clock className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-sm text-text">Jam Operasional</h4>
            </div>
            <div className="space-y-2.5 text-xs text-text-secondary leading-relaxed">
              <div className="flex justify-between items-start pb-2 border-b border-black/[0.04]">
                <span className="font-medium text-text">Senin – Sabtu</span>
                <span className="font-mono text-text">09.00 – 18.00 WIB</span>
              </div>
              <div className="flex justify-between items-start pt-1">
                <span className="font-medium text-text">Minggu &amp; Libur</span>
                <span className="text-black/50 text-[11px]">Layanan Terbatas</span>
              </div>
              <p className="pt-2 text-[11px] text-text-secondary">
                Pesanan yang terkonfirmasi sebelum pukul 14.00 WIB dikirimkan pada hari kerja yang sama.
              </p>
            </div>
          </div>

          {/* Legal Manufacturer & Office */}
          <div className="rounded-xl border border-black/[0.06] bg-[#FAF9FB] p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <MapPin className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-sm text-text">Kantor &amp; Manufaktur</h4>
            </div>
            <div className="text-xs text-text-secondary leading-relaxed space-y-1">
              <p className="font-semibold text-text">CV. DINARE ANUGRAH KOSMETIKA</p>
              <p>Produsen Resmi Perawatan Tubuh Beautyinu</p>
              <p>Surabaya, Jawa Timur, Indonesia</p>
              <p className="pt-2 text-[11px] font-mono text-black/50">
                100% Formulasi Ternotifikasi Resmi BPOM RI
              </p>
            </div>
          </div>

          {/* Official Social Media */}
          <div className="rounded-xl border border-black/[0.06] bg-[#FAF9FB] p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-sm text-text">Media Sosial Resmi</h4>
            </div>
            <div className="space-y-2 text-xs">
              <a
                href="https://instagram.com/beautyinu.id"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded-md bg-white border border-black/[0.04] hover:border-black/[0.1] text-text transition-all"
              >
                <span className="font-medium">Instagram @beautyinu.id</span>
                <ExternalLink className="w-3.5 h-3.5 text-black/40" />
              </a>
              <a
                href="https://instagram.com/beautyinucastle"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded-md bg-white border border-black/[0.04] hover:border-black/[0.1] text-text transition-all"
              >
                <span className="font-medium">Instagram @beautyinucastle</span>
                <ExternalLink className="w-3.5 h-3.5 text-black/40" />
              </a>
              <a
                href="https://tiktok.com/@beautyinu.official"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded-md bg-white border border-black/[0.04] hover:border-black/[0.1] text-text transition-all"
              >
                <span className="font-medium">TikTok @beautyinu.official</span>
                <ExternalLink className="w-3.5 h-3.5 text-black/40" />
              </a>
            </div>
          </div>
        </div>

        {/* Quick FAQ / Pertanyaan Populer */}
        <div className="mt-14 pt-12 border-t border-black/[0.06]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20 inline-block mb-2">
                Jawaban Cepat
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-text font-normal">
                Pertanyaan yang Sering Diajukan (Quick FAQ)
              </h3>
            </div>
            <Link
              to="/pages/faq"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#111111] hover:bg-primary text-white text-xs font-semibold transition-all duration-200 shadow-xs hover:shadow-md hover:shadow-primary/25 flex-shrink-0"
            >
              <span>Buka Semua FAQ (35+ Jawaban)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-black/[0.06] bg-white p-5 shadow-2xs">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md w-fit mb-2 border border-emerald-100">
                <Check className="w-2.5 h-2.5" />
                Takaran 3:1
              </div>
              <h4 className="font-semibold text-sm text-text mb-1.5">
                Berapa takaran Brightening Booster Gold Powder yang disarankan?
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Untuk harian di telapak tangan, campurkan serbuk dengan rasio 3:1 (lebih banyak lotion). Untuk 1 botol penuh 25gr, larutkan ke dalam botol lotion 400ml.
              </p>
            </div>

            <div className="rounded-xl border border-black/[0.06] bg-white p-5 shadow-2xs">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md w-fit mb-2 border border-emerald-100">
                <Check className="w-2.5 h-2.5" />
                100% Resmi BPOM RI
              </div>
              <h4 className="font-semibold text-sm text-text mb-1.5">
                Apakah seluruh formula Beautyinu terdaftar resmi di BPOM?
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Ya. Seluruh formula memiliki nomor notifikasi resmi BPOM RI, bebas merkuri, hidrokuinon, dan teruji aman digunakan jangka panjang mulai usia 12+.
              </p>
            </div>

            <div className="rounded-xl border border-black/[0.06] bg-white p-5 shadow-2xs">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-md w-fit mb-2 border border-accent/20">
                <Check className="w-2.5 h-2.5" />
                Multifungsi Wajah &amp; Badan
              </div>
              <h4 className="font-semibold text-sm text-text mb-1.5">
                Apakah Sabun Kefir Collagen bisa untuk wajah dan badan?
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Bisa. Untuk badan, diamkan busa 2–3 menit sebelum dibilas. Untuk wajah, busakan lembut di tangan, aplikasikan singkat dan segera bilas bersih.
              </p>
            </div>

            <div className="rounded-xl border border-black/[0.06] bg-white p-5 shadow-2xs">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md w-fit mb-2 border border-primary/20">
                <Check className="w-2.5 h-2.5" />
                Estimasi 1–3 Hari
              </div>
              <h4 className="font-semibold text-sm text-text mb-1.5">
                Berapa lama estimasi pengiriman paket pesanan saya?
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Pengiriman ke Pulau Jawa berkisar 1–3 hari kerja, luar Jawa 3–6 hari kerja. Nomor resi otomatis dikirim via WhatsApp/Email untuk pelacakan langsung.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. FAQ VIEW (Interactive Accordion & Category Filter)
// ---------------------------------------------------------------------------
// FAQ data is imported from ~/data/faqData (shared with meta JSON-LD schema)

function FaqView({page}: {page: any}) {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1]);

  const toggleIndex = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const matchesCategory =
      selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <PageHeader
        kicker="Beautyinu · FAQ &amp; Science"
        title="Pertanyaan Umum (FAQ)"
        subtitle="Panduan lengkap penggunaan, takaran kombinasi, transparansi nomor izin edar BPOM RI, serta petunjuk keamanan formula untuk seluruh rangkaian produk Beautyinu."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="w-4 h-4 text-black/40 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari pertanyaan seputar produk, takaran, BPOM, atau cara pakai..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-md border border-black/[0.08] bg-white text-xs sm:text-sm text-text placeholder:text-black/40 focus:outline-none focus:border-primary transition-all shadow-2xs"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-2 border-b border-black/[0.06]">
          {FAQ_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 active:scale-95 cursor-pointer ${
                  isActive
                    ? 'bg-[#111111] text-white shadow-2xs'
                    : 'bg-[#FAF9FB] hover:bg-[#FFF8FA] text-text-secondary hover:text-primary hover:border-primary/30 border border-black/[0.06]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndices.includes(idx);
              return (
                <div
                  key={faq.question}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-primary/30 bg-[#FFFBFD] shadow-2xs'
                      : 'border-black/[0.06] bg-white hover:border-primary/30'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleIndex(idx)}
                    className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono font-medium text-black/50 uppercase tracking-wider">
                          {faq.category}
                        </span>
                        {faq.badge && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                            <Check className="w-2.5 h-2.5" />
                            {faq.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-base sm:text-lg text-text font-normal leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                        isOpen
                          ? 'bg-primary text-white rotate-180'
                          : 'bg-black/[0.04] text-text'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 border-t border-black/[0.04]">
                      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed pt-3 font-normal">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 rounded-xl border border-dashed border-black/[0.1] bg-[#FAF9FB] p-8">
              <HelpCircle className="w-8 h-8 text-black/30 mx-auto mb-3" />
              <p className="text-sm font-medium text-text mb-1">
                Tidak ada pertanyaan yang sesuai dengan kata kunci "{searchQuery}"
              </p>
              <p className="text-xs text-text-secondary">
                Coba gunakan kata kunci lain atau hubungi tim Customer Care kami langsung.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Support CTA */}
        <div className="mt-14 rounded-xl bg-gradient-to-r from-primary/10 via-[#FFF8FA] to-accent/10 border border-primary/20 p-6 sm:p-8 text-center">
          <h4 className="font-serif text-xl sm:text-2xl text-text font-normal mb-2">
            Belum Menemukan Jawaban yang Anda Cari?
          </h4>
          <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto mb-5 leading-relaxed">
            Beauty Bestie kami siap memandu konsultasi jenis kulit dan rekomendasi tahapan pemakaian secara personal.
          </p>
          <a
            href="https://wa.me/6287777118186?text=Halo%20Beautyinu%2C%20saya%20punya%20pertanyaan%20tentang%20produk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary hover:bg-primary-hover text-white text-xs font-semibold py-3 px-6 shadow-xs transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat WhatsApp Customer Care</span>
          </a>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. TRACK ORDER VIEW
// ---------------------------------------------------------------------------
const COURIER_SERVICES = [
  {
    name: 'JNE Express',
    code: 'JNE',
    services: 'Reguler, YES, JTR Cargo',
    trackingUrl: 'https://www.jne.co.id/id/tracking/trace',
    description: 'Jangkauan terluas hingga pelosok kecamatan di seluruh Indonesia.',
  },
  {
    name: 'SiCepat Ekspres',
    code: 'SICEPAT',
    services: 'SiUntung, BEST, Gokil Cargo',
    trackingUrl: 'https://www.sicepat.com/checkAwb',
    description: 'Pengiriman kilat untuk kota-kota besar di Pulau Jawa dan sekitarnya.',
  },
  {
    name: 'J&T Express',
    code: 'J&T',
    services: 'EZ, Super, DFOD',
    trackingUrl: 'https://www.jet.co.id/track',
    description: 'Operasional 365 hari tanpa libur dengan pelacakan sistematis.',
  },
  {
    name: 'Lion Parcel',
    code: 'LION',
    services: 'ONEPACK, REGPACK, JAGOPACK',
    trackingUrl: 'https://lionparcel.com/track',
    description: 'Koneksi armada udara langsung untuk pengiriman antar pulau cepat.',
  },
  {
    name: 'Anteraja',
    code: 'ANTERAJA',
    services: 'Regular, Next Day, Cargo',
    trackingUrl: 'https://anteraja.id/tracking',
    description: 'Layanan terintegrasi dengan penanganan paket hati-hati.',
  },
];

function TrackOrderView({page}: {page: any}) {
  return (
    <div>
      <PageHeader
        kicker="Beautyinu · Logistics &amp; Tracking"
        title="Lacak Pesanan Anda"
        subtitle="Pantau posisi paket pesanan produk Beautyinu Anda secara real-time melalui portal resmi mitra kurir logistik terpercaya kami."
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* 3-Step Guide */}
        <div className="rounded-xl border border-black/[0.06] bg-[#FAF9FB] p-6 sm:p-8 mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Package className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm text-text uppercase tracking-wider font-mono">
              3 Langkah Mudah Melacak Resi
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-lg border border-black/[0.04]">
              <div className="text-[10px] font-mono font-bold text-primary mb-2">
                01 // NOMOR RESI
              </div>
              <h4 className="font-semibold text-sm text-text mb-1">Cek Email / WhatsApp</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Salin nomor resi pengiriman yang otomatis dikirimkan ke kontak Anda setelah pesanan diproses.
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-black/[0.04]">
              <div className="text-[10px] font-mono font-bold text-primary mb-2">
                02 // PILIH KURIR
              </div>
              <h4 className="font-semibold text-sm text-text mb-1">Klik Portal Ekspedisi</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Pilih nama ekspedisi yang digunakan (JNE, SiCepat, J&amp;T, Lion Parcel, atau Anteraja) di bawah ini.
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-black/[0.04]">
              <div className="text-[10px] font-mono font-bold text-primary mb-2">
                03 // PANTAU POSISI
              </div>
              <h4 className="font-semibold text-sm text-text mb-1">Lacak Status Real-Time</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Tempelkan nomor resi Anda pada portal kurir untuk melihat posisi dan estimasi kedatangan paket.
              </p>
            </div>
          </div>
        </div>

        {/* Courier Direct Lookup Cards */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-xl sm:text-2xl text-text font-normal">
              Pilihan Portal Ekspedisi Resmi
            </h3>
            <span className="text-xs font-mono text-text-secondary">
              5 Mitra Kurir Aktif
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {COURIER_SERVICES.map((courier) => (
              <div
                key={courier.name}
                className="rounded-xl border border-black/[0.06] bg-white p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-md bg-black/[0.04] text-text font-mono text-[11px] font-bold">
                      {courier.code}
                    </span>
                    <Truck className="w-4 h-4 text-black/40" />
                  </div>
                  <h4 className="font-semibold text-base text-text mb-1">
                    {courier.name}
                  </h4>
                  <p className="text-[11px] font-mono text-primary mb-3">
                    {courier.services}
                  </p>
                  <p className="text-xs text-text-secondary leading-relaxed mb-6">
                    {courier.description}
                  </p>
                </div>

                <a
                  href={courier.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#FAF9FB] hover:bg-primary hover:text-white hover:border-primary text-text border border-black/[0.08] text-xs font-semibold py-2.5 px-4 transition-all duration-200 shadow-2xs hover:shadow-xs"
                >
                  <span>Buka Portal {courier.code}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* SLA Table */}
        <div className="rounded-xl border border-black/[0.06] bg-white p-6 sm:p-8 mb-12 shadow-2xs">
          <h4 className="font-serif text-lg sm:text-xl text-text font-normal mb-4">
            Standar Estimasi Waktu Pengiriman
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-black/[0.08] bg-[#FAF9FB]">
                  <th className="py-3 px-4 font-semibold text-text uppercase tracking-wider text-[11px]">
                    Wilayah Tujuan
                  </th>
                  <th className="py-3 px-4 font-semibold text-text uppercase tracking-wider text-[11px]">
                    Estimasi Tiba (Hari Kerja)
                  </th>
                  <th className="py-3 px-4 font-semibold text-text uppercase tracking-wider text-[11px]">
                    Standar Pengemasan
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] text-text-secondary">
                <tr>
                  <td className="py-3.5 px-4 font-medium text-text">Pulau Jawa &amp; Kota Besar</td>
                  <td className="py-3.5 px-4 font-mono text-text">1 – 3 Hari</td>
                  <td className="py-3.5 px-4">Bubble wrap tebal + kardus protektif</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-text">Luar Pulau Jawa (Sumatera, Bali, Kalimantan, Sulawesi)</td>
                  <td className="py-3.5 px-4 font-mono text-text">3 – 6 Hari</td>
                  <td className="py-3.5 px-4">Bubble wrap tebal + kardus protektif</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-text">Indonesia Timur (Maluku, Papua &amp; Daerah Pelosok)</td>
                  <td className="py-3.5 px-4 font-mono text-text">5 – 9 Hari</td>
                  <td className="py-3.5 px-4">Segel ekstra berlapis anti-benturan</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-text">Regional Internasional (Malaysia &amp; Singapura)</td>
                  <td className="py-3.5 px-4 font-mono text-text">5 – 10 Hari</td>
                  <td className="py-3.5 px-4">Kemasan standar kargo udara internasional</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Support Alert */}
        <div className="rounded-xl border border-primary/20 bg-[#FFF9FA] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h5 className="font-semibold text-sm text-text mb-1">
              Nomor Resi Belum Bergerak Lebih dari 24 Jam?
            </h5>
            <p className="text-xs text-text-secondary leading-relaxed">
              Sistem kurir membutuhkan waktu hingga 1x24 jam untuk pemindaian pertama di hub logistik. Jika resi tidak terupdate, hubungi Customer Care kami untuk penelusuran langsung.
            </p>
          </div>
          <a
            href="https://wa.me/6287777118186?text=Halo%20Customer%20Care%20Beautyinu%2C%20saya%20ingin%20menanyakan%20status%20resi%20pesanan"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition-all shadow-xs"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Bantuan Resi WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 5. DISTRIBUTOR & PARTNERSHIP VIEW
// ---------------------------------------------------------------------------
const PARTNERSHIP_TIERS = [
  {
    name: 'Reseller Resmi',
    tier: 'Starter Tier',
    minOrder: 'Min. Pembelian Terjangkau',
    description:
      'Pilihan ideal bagi pemula, mahasiswa, ibu rumah tangga, dan pemilik toko kosmetik lokal yang ingin memulai bisnis skincare dengan modal bersahabat.',
    benefits: [
      'Harga khusus reseller bersaing',
      'Aset foto & video promosi HD',
      'Masuk grup edukasi & bimbingan',
      'Tanpa biaya pendaftaran keanggotaan',
    ],
    ctaText: 'Daftar Reseller',
  },
  {
    name: 'Agen Kota / Kabupaten',
    tier: 'Growth Tier',
    minOrder: 'Alokasi Wilayah Eksklusif',
    description:
      'Untuk pebisnis dan pemilik toko yang siap menyuplai reseller di kota/kabupatennya dengan margin keuntungan yang lebih menguntungkan.',
    benefits: [
      'Margin keuntungan lebih tinggi',
      'Prioritas alokasi stok produk',
      'Dukungan tester produk gratis',
      'Rujukan pesanan retail di wilayah Anda',
    ],
    ctaText: 'Daftar Agen Resmi',
    featured: true,
  },
  {
    name: 'Distributor Provinsi',
    tier: 'Scale Tier',
    minOrder: 'Kapasitas Distribusi Besar',
    description:
      'Kemitraan strategis tingkat provinsi dengan kuota eksklusif, margin maksimal, dan dukungan langsung dari manajemen pusat Beautyinu.',
    benefits: [
      'Margin keuntungan maksimal distributor',
      'Hak eksklusif distribusi wilayah',
      'Dukungan promosi kampanye bersama',
      'Program reward tahunan & insentif khusus',
    ],
    ctaText: 'Ajukan Distributor',
  },
];

function DistributorView({page}: {page: any}) {
  return (
    <div>
      <PageHeader
        kicker="Beautyinu · Partnership &amp; B2B"
        title="Program Kemitraan Resmi"
        subtitle="Bangun bisnis perawatan tubuh berkelanjutan bersama brand lokal berkembang pesat. Kesempatan kemitraan resmi Reseller, Agen, dan Distributor Beautyinu di seluruh Indonesia."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* 4 Pillars of Partnership Value */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="rounded-xl border border-black/[0.06] bg-[#FAF9FB] p-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-lg text-text font-normal mb-2">
              Produk Fast-Moving
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Kebutuhan mandi dan perawatan tubuh harian dengan tingkat pembelian ulang (repeat order) yang sangat konsisten.
            </p>
          </div>

          <div className="rounded-xl border border-black/[0.06] bg-[#FAF9FB] p-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-lg text-text font-normal mb-2">
              100% Resmi BPOM RI
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Seluruh formula berizin edar resmi BPOM RI, bebas merkuri dan bahan berbahaya sehingga aman diedarkan secara sah.
            </p>
          </div>

          <div className="rounded-xl border border-black/[0.06] bg-[#FAF9FB] p-6">
            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-lg text-text font-normal mb-2">
              Margin &amp; Insentif Menarik
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Struktur harga grosir berjenjang yang dirancang untuk melindungi keuntungan mitra di setiap level kemitraan.
            </p>
          </div>

          <div className="rounded-xl border border-black/[0.06] bg-[#FAF9FB] p-6">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-lg text-text font-normal mb-2">
              Aset Promosi Siap Pakai
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Foto produk studio HD, video materi iklan media sosial, tester gratis, dan bimbingan copywriting yang siap dibagikan.
            </p>
          </div>
        </div>

        {/* 3 Partnership Tiers */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary px-3 py-1 rounded-md bg-primary/10 border border-primary/20 inline-block mb-3">
              Pilihan Kemitraan
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-text font-normal tracking-tight mb-3">
              Pilih Jenjang Kemitraan Sesuai Kapasitas Bisnis Anda
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Dari pemula hingga jaringan distribusi skala besar, Beautyinu memberikan dukungan penuh untuk pertumbuhan bisnis Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {PARTNERSHIP_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-xl border p-7 flex flex-col justify-between transition-all ${
                  tier.featured
                    ? 'border-primary bg-[#FFFDFE] shadow-md relative'
                    : 'border-black/[0.08] bg-white shadow-2xs hover:shadow-md'
                }`}
              >
                {tier.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-0.5 rounded-full shadow-xs">
                    Paling Diminati
                  </span>
                )}
                <div>
                  <div className="text-[11px] font-mono font-bold text-text-secondary mb-1">
                    {tier.tier}
                  </div>
                  <h4 className="font-serif text-2xl text-text font-normal mb-2">
                    {tier.name}
                  </h4>
                  <div className="text-xs font-mono text-primary font-semibold mb-4">
                    {tier.minOrder}
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed mb-6">
                    {tier.description}
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-black/[0.04] mb-8">
                    {tier.benefits.map((b) => (
                      <div key={b} className="flex items-start gap-2 text-xs text-text">
                        <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href={`https://wa.me/6281936574690?text=Halo%20Tim%20Kemitraan%20Beautyinu%2C%20saya%20tertarik%20mendaftar%20sebagai%20${encodeURIComponent(
                    tier.name,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full inline-flex items-center justify-center gap-2 rounded-md py-3 px-4 text-xs font-semibold transition-all shadow-xs cursor-pointer ${
                    tier.featured
                      ? 'bg-primary hover:bg-primary-hover text-white'
                      : 'bg-[#111111] hover:bg-primary text-white'
                  }`}
                >
                  <span>{tier.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Partnership Direct Contact Card */}
        <div className="rounded-2xl bg-[#FAF9FB] border border-black/[0.06] p-8 sm:p-10 text-center max-w-2xl mx-auto shadow-2xs">
          <h4 className="font-serif text-2xl sm:text-3xl text-text font-normal mb-2">
            Konsultasi Kemitraan
          </h4>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-6 max-w-md mx-auto">
            Hubungi tim kami untuk ketersediaan wilayah, harga grosir, dan sampel produk.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://wa.me/6281936574690?text=Halo%20Tim%20Kemitraan%20Beautyinu%2C%20saya%20ingin%20konsultasi%20peluang%20distributor"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-semibold px-7 py-3 shadow-xs transition-all whitespace-nowrap cursor-pointer hover:scale-[1.02]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat WhatsApp</span>
            </a>
            <a
              href="mailto:support@beautyinu.id?subject=Permohonan%20Kemitraan%20Beautyinu"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-surface text-text border border-black/[0.08] text-xs sm:text-sm font-semibold px-7 py-3 transition-all shadow-2xs whitespace-nowrap cursor-pointer hover:scale-[1.02]"
            >
              <Mail className="w-4 h-4 text-black/60" />
              <span>Kirim Proposal</span>
            </a>
          </div>
          <p className="mt-4 text-[11px] font-mono text-text-secondary">
            +62 819-3657-4690 · support@beautyinu.id
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 6. ABOUT US VIEW
// ---------------------------------------------------------------------------
function AboutView({page}: {page: any}) {
  return (
    <div>
      <PageHeader
        kicker="Beautyinu · Our Story &amp; Vision"
        title="Tentang Beautyinu"
        subtitle="Your Bodycare Bestie untuk kulit bersih, lembap, dan glowing terawat. Menemani perempuan Indonesia merawat diri dengan cara yang menyenangkan, aman, dan percaya diri."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Philosophy Quote */}
        <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-[#FFF8FA] to-accent/5 p-6 sm:p-8 mb-12 text-center">
          <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary mb-2">
            Filosofi Utama
          </p>
          <blockquote className="font-serif text-2xl sm:text-3xl text-text font-normal italic tracking-tight mb-3">
            "Glow with confidence, grow with kindness."
          </blockquote>
          <p className="text-xs sm:text-sm text-text-secondary max-w-xl mx-auto leading-relaxed">
            Bagi kami, merawat diri bukan tentang mengejar standar kecantikan yang kaku atau mahal, melainkan tentang memiliki kulit sehat terhidrasi, merasa nyaman dengan diri sendiri, dan saling mendukung sesama perempuan.
          </p>
        </div>

        {/* Company & Origin */}
        <div className="rounded-xl border border-black/[0.06] bg-white p-6 sm:p-8 shadow-2xs mb-12">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-black/50 block mb-2">
            Identitas &amp; Produsen
          </span>
          <h3 className="font-serif text-xl sm:text-2xl text-text font-normal mb-4">
            CV. DINARE ANUGRAH KOSMETIKA
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-4">
            Beautyinu adalah brand beauty dan bodycare lokal di bawah naungan CV. DINARE ANUGRAH KOSMETIKA yang berbasis di Surabaya, Jawa Timur. Kami menghadirkan rangkaian perawatan tubuh harian yang mudah digunakan, mulai dari sabun mandi kaya nutrisi, body lotion jumbo ber-UV Filter, krim tubuh intensif, hingga serbuk booster pencerah inovatif.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-black/[0.04]">
            <div>
              <div className="text-lg font-serif text-primary font-normal">100%</div>
              <div className="text-[11px] text-text-secondary">Resmi BPOM RI</div>
            </div>
            <div>
              <div className="text-lg font-serif text-text font-normal">750ml</div>
              <div className="text-[11px] text-text-secondary">Ukuran Jumbo Harian</div>
            </div>
            <div>
              <div className="text-lg font-serif text-text font-normal">12+ Thn</div>
              <div className="text-[11px] text-text-secondary">Usia Pemakaian</div>
            </div>
            <div>
              <div className="text-lg font-serif text-text font-normal">Surabaya</div>
              <div className="text-[11px] text-text-secondary">Pusat Manufaktur</div>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Science & Safety */}
        <div className="mb-14">
          <h3 className="font-serif text-xl sm:text-2xl text-text font-normal mb-6">
            Komitmen Standar Formulasi &amp; Keamanan
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-black/[0.06] bg-[#FAF9FB] p-5">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" strokeWidth={2.5} />
                <h4 className="font-semibold text-sm text-text">100% Resmi BPOM RI</h4>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Seluruh formula terdaftar secara sah di Badan Pengawas Obat dan Makanan Republik Indonesia dengan nomor izin edar yang dapat diverifikasi publik.
              </p>
            </div>

            <div className="rounded-xl border border-black/[0.06] bg-[#FAF9FB] p-5">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" strokeWidth={2.5} />
                <h4 className="font-semibold text-sm text-text">Bahan Aktif Teruji</h4>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Mengombinasikan konsentrasi presisi Niacinamide 5.22%, Alpha Arbutin 2.30%, Glutathione, Tranexamic Acid, Kakadu Plum, dan Botanical Oils.
              </p>
            </div>

            <div className="rounded-xl border border-black/[0.06] bg-[#FAF9FB] p-5">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" strokeWidth={2.5} />
                <h4 className="font-semibold text-sm text-text">Bebas Bahan Berbahaya</h4>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Bebas merkuri, bebas hidrokuinon, bebas steroid berbahaya, dan tidak meninggalkan rasa dempul ataupun warna abu-abu pada kulit.
              </p>
            </div>

            <div className="rounded-xl border border-black/[0.06] bg-[#FAF9FB] p-5">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" strokeWidth={2.5} />
                <h4 className="font-semibold text-sm text-text">Ramah Kulit Usia 12+</h4>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Diformulasikan lembut dan aman digunakan mulai remaja usia 12 tahun ke atas untuk merawat dan melindungi skin barrier tropis.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Ecosystem Programs */}
        <div>
          <h3 className="font-serif text-xl sm:text-2xl text-text font-normal mb-6">
            Beautyinu Programs — Ruang Tumbuh Bersama
          </h3>

          <div className="space-y-4">
            {/* Moonbabies */}
            <div className="rounded-xl border border-black/[0.06] bg-white p-6 shadow-2xs hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
                    Komunitas &amp; Gerakan Sosial
                  </span>
                  <h4 className="font-serif text-lg text-text font-normal">
                    1. Moonbabies
                  </h4>
                </div>
                <a
                  href="https://forms.gle/RBM26oTsz1jEgrae8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#111111] hover:bg-primary text-white text-[11px] font-semibold transition-all duration-300 shadow-xs hover:shadow-md hover:shadow-primary/25 active:scale-[0.98] flex-shrink-0 cursor-pointer"
                >
                  <span>Daftar Moonbabies</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed mb-3">
                Gerakan sosial dari Beautyinu yang berfokus pada workshop keterampilan, edukasi self-care, pemberdayaan perempuan, serta aksi berbagi sosial kepada sesama.
              </p>
              <div className="text-[11px] font-medium text-text bg-[#FAF9FB] px-3 py-2 rounded-md">
                Benefit: Free workshop berkala, produk gratis, dan jejaring pengembangan diri.
              </div>
            </div>

            {/* Brightygengs */}
            <div className="rounded-xl border border-black/[0.06] bg-white p-6 shadow-2xs hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent">
                    Creator &amp; Affiliate Ambassador
                  </span>
                  <h4 className="font-serif text-lg text-text font-normal">
                    2. Brightygengs
                  </h4>
                </div>
                <a
                  href="https://api.whatsapp.com/send/?phone=6281936574690&text=Halo%20Admin%2C%20saya%20tertarik%20bergabung%20dengan%20Brightygengs%20Beautyinu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent hover:bg-accent/90 text-white text-[11px] font-semibold transition-all flex-shrink-0"
                >
                  <span>Gabung Brightygengs</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed mb-3">
                Ruang kolaborasi bagi beauty enthusiast dan content creator untuk mengembangkan audiens serta mendapatkan komisi dari konten kecantikan.
              </p>
              <div className="text-[11px] font-medium text-text bg-[#FAF9FB] px-3 py-2 rounded-md">
                Benefit: Free sample produk baru, komisi afiliasi menarik, dan mentoring konten viral.
              </div>
            </div>

            {/* Official Distributor */}
            <div className="rounded-xl border border-black/[0.06] bg-white p-6 shadow-2xs hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
                    Jaringan Distribusi
                  </span>
                  <h4 className="font-serif text-lg text-text font-normal">
                    3. Official Distributor &amp; Reseller
                  </h4>
                </div>
                <Link
                  to="/pages/distributor"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary hover:bg-primary-hover text-white text-[11px] font-semibold transition-all flex-shrink-0"
                >
                  <span>Lihat Program Kemitraan</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed mb-3">
                Peluang usaha resmi bagi pemilik toko kosmetik dan pengusaha lokal di seluruh pelosok Indonesia dengan proteksi margin menguntungkan.
              </p>
            </div>

            {/* Birthday Treats */}
            <div className="rounded-xl border border-black/[0.06] bg-white p-6 shadow-2xs hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700">
                    Spesial Hari Ulang Tahunmu
                  </span>
                  <h4 className="font-serif text-lg text-text font-normal">
                    4. Birthday Treats
                  </h4>
                </div>
                <a
                  href="https://instagram.com/beautyinu.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-all flex-shrink-0"
                >
                  <span>Klaim di Instagram @beautyinu.id</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed mb-3">
                Kado produk gratis spesial dari Beautyinu pada hari ulang tahun Anda. Cukup kirimkan bukti kartu identitas resmi (KTP/Kartu Pelajar) melalui Direct Message Instagram resmi @beautyinu.id tepat pada hari ulang tahun Anda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 7. SHIPPING & RETURNS VIEW
// ---------------------------------------------------------------------------
function ShippingReturnsView({page}: {page: any}) {
  return (
    <div>
      <PageHeader
        kicker="Beautyinu · Shipping &amp; Returns"
        title="Kebijakan Pengiriman &amp; Garansi Retur"
        subtitle="Komitmen kami adalah memastikan setiap paket pesanan Anda tiba dengan aman, cepat, dan bergaransi penggantian 100% jika mengalami kendala saat perjalanan."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Shipping Schedule & SLA */}
        <div className="rounded-xl border border-black/[0.06] bg-white p-6 sm:p-8 shadow-2xs mb-12">
          <div className="flex items-center gap-2 mb-3">
            <Truck className="w-4 h-4 text-primary" />
            <h3 className="font-serif text-xl text-text font-normal">
              1. Jadwal &amp; Standar Pengiriman
            </h3>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-text-secondary leading-relaxed mb-6">
            <p>
              • <strong>Standar Pengemasan Aman:</strong> Setiap botol dan kemasan dilapisi pelindung bubble wrap tebal dan ditempatkan dalam kardus kokoh tanpa biaya tambahan.
            </p>
            <p>
              • <strong>Waktu Pemrosesan:</strong> Pesanan yang pembayaran atau konfirmasinya berhasil sebelum pukul 14.00 WIB akan diserahkan ke pihak ekspedisi pada hari yang sama (Senin – Sabtu).
            </p>
            <p>
              • <strong>Pilihan Ekspedisi:</strong> Kami bermitra dengan ekspedisi resmi JNE, SiCepat, J&amp;T, Lion Parcel, dan Anteraja.
            </p>
          </div>

          <div className="overflow-x-auto pt-2 border-t border-black/[0.04]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-black/[0.06] bg-[#FAF9FB]">
                  <th className="py-3 px-4 font-semibold text-text uppercase tracking-wider text-[11px]">
                    Wilayah Pengiriman
                  </th>
                  <th className="py-3 px-4 font-semibold text-text uppercase tracking-wider text-[11px]">
                    Estimasi Tiba (Hari Kerja)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] text-text-secondary">
                <tr>
                  <td className="py-3 px-4 font-medium text-text">Pulau Jawa &amp; Kota Besar</td>
                  <td className="py-3 px-4 font-mono text-text">1 – 3 Hari</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-text">Luar Pulau Jawa (Sumatera, Bali, NTB, Kalimantan, Sulawesi)</td>
                  <td className="py-3 px-4 font-mono text-text">3 – 6 Hari</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-text">Wilayah Timur (Maluku, Papua &amp; Daerah Pelosok)</td>
                  <td className="py-3 px-4 font-mono text-text">5 – 9 Hari</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-text">Regional Internasional (Malaysia &amp; Singapura)</td>
                  <td className="py-3 px-4 font-mono text-text">5 – 10 Hari</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 100% Replacement Warranty Protocol */}
        <div className="rounded-xl border border-black/[0.06] bg-[#FAF9FB] p-6 sm:p-8 mb-12">
          <div className="flex items-center gap-2 mb-3">
            <RotateCcw className="w-4 h-4 text-emerald-600" />
            <h3 className="font-serif text-xl text-text font-normal">
              2. Garansi Retur &amp; Penggantian Produk 100%
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-6">
            Kepuasan dan kenyamanan berbelanja Anda adalah prioritas kami. Kami memberikan garansi penggantian produk 100% baru jika pesanan yang Anda terima rusak atau tidak sesuai dengan invoice pesanan.
          </p>

          <div className="space-y-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-black/[0.04]">
              <h5 className="font-semibold text-xs text-text mb-1">
                Syarat &amp; Ketentuan Klaim:
              </h5>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-text-secondary leading-relaxed">
                <li>
                  <strong>Video Unboxing Utuh:</strong> Pembeli wajib merekam video saat pertama kali membuka paket tanpa jeda (unbroken video), memperlihatkan label resi dan segel luar paket.
                </li>
                <li>
                  <strong>Batas Waktu:</strong> Pengajuan klaim diajukan maksimal 2 x 24 jam sejak paket tercatat berstatus "Delivered" oleh kurir.
                </li>
                <li>
                  <strong>Kondisi yang Digaransi:</strong> Botol rusak/pecah saat transit, isi bocor, varian produk berbeda, atau jumlah pesanan kurang.
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-black/[0.04] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h5 className="font-semibold text-xs text-text mb-0.5">
                Cara Mengajukan Klaim Retur
              </h5>
              <p className="text-xs text-text-secondary">
                Kirim nomor pesanan, video unboxing, dan foto kendala ke WhatsApp Customer Care resmi kami.
              </p>
            </div>
            <a
              href="https://wa.me/6287777118186?text=Halo%20Customer%20Care%20Beautyinu%2C%20saya%20ingin%20mengajukan%20klaim%20garansi%20paket"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-xs flex-shrink-0"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Klaim Garansi Retur</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 8. GENERIC PAGE VIEW (Fallback for Other Pages)
// ---------------------------------------------------------------------------
function GenericView({page}: {page: any}) {
  const cleanedBody = cleanCmsHtml(page.body);

  return (
    <div>
      <PageHeader
        kicker="Beautyinu · Official"
        title={page.title}
        subtitle="Informasi resmi dari Beautyinu Official Store."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div
          dangerouslySetInnerHTML={{__html: cleanedBody}}
          className="
            [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:mt-12 [&_h2]:mb-5 [&_h2]:text-text [&_h2]:font-normal
            [&_hr]:hidden
            [&_h3]:font-semibold [&_h3]:text-base [&_h3]:md:text-lg [&_h3]:mt-7 [&_h3]:mb-2.5 [&_h3]:text-text
            [&_p]:leading-relaxed [&_p]:mb-4 [&_p]:text-text [&_p]:text-xs [&_p]:sm:text-sm [&_p]:md:text-base
            [&_a]:text-primary [&_a]:underline hover:[&_a]:text-primary-hover
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:text-xs [&_ul]:sm:text-sm [&_ul]:md:text-base
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:text-xs [&_ol]:sm:text-sm [&_ol]:md:text-base
            [&_li]:mb-2 [&_li]:leading-relaxed
            [&_strong]:font-semibold
            [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6 [&_blockquote]:bg-[#FAF7FD] [&_blockquote]:py-3 [&_blockquote]:rounded-r-lg
            [&_table]:w-full [&_table]:border-collapse [&_table]:my-8 [&_table]:rounded-xl [&_table]:overflow-hidden [&_table]:border [&_table]:border-black/[0.06]
            [&_thead]:bg-[#FAF7FD]
            [&_th]:text-left [&_th]:p-3.5 [&_th]:border-b [&_th]:border-black/[0.06] [&_th]:font-semibold [&_th]:text-xs [&_th]:uppercase [&_th]:tracking-wider
            [&_td]:p-3.5 [&_td]:border-b [&_td]:border-black/[0.04] [&_td]:text-xs [&_td]:sm:text-sm
          "
        />
      </div>
    </div>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  ) @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      id
      title
      body
      handle
      seo {
        description
        title
      }
    }
  }
` as const;
