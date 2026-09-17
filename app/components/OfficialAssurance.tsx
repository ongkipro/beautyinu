import {ShieldCheck, Sparkles, Truck, Clock} from 'lucide-react';

interface OfficialAssuranceProps {
  className?: string;
}

const ASSURANCES = [
  {
    num: '01',
    icon: ShieldCheck,
    title: '100% Terdaftar BPOM RI',
    desc: 'Seluruh formula bebas merkuri & hidrokuinon, teruji klinis dan aman untuk pemakaian harian.',
  },
  {
    num: '02',
    icon: Sparkles,
    title: 'Formula Konsentrasi Tinggi',
    desc: 'Niacinamide, Alpha Arbutin & Collagen dipadukan dengan UV Filter untuk hasil cerah optimal.',
  },
  {
    num: '03',
    icon: Truck,
    title: 'Pengiriman Cepat & Aman',
    desc: 'Gratis bubble wrap ekstra tebal. Garansi ganti baru 100% jika botol pecah atau bocor saat ekspedisi.',
  },
  {
    num: '04',
    icon: Clock,
    title: 'Konsultasi Kulit Gratis',
    desc: 'Bingung menentukan produk? Konsultasikan kondisi kulitmu langsung dengan Beauty Advisor resmi kami.',
  },
];

export function OfficialAssurance({className = ''}: OfficialAssuranceProps) {
  return (
    <section className={`bg-white border-t border-black/[0.06] py-12 sm:py-16 md:py-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Minimalist Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-2.5">
          <div>
            <p className="text-[10px] sm:text-[11px] font-mono font-medium uppercase tracking-[0.25em] text-black/45 mb-1.5">
              Official Assurance
            </p>
            <h3 className="font-serif text-2xl sm:text-3xl text-text font-normal tracking-tight">
              Jaminan Belanja Resmi Beautyinu
            </h3>
          </div>
          <p className="text-xs text-text-secondary max-w-sm sm:text-right leading-relaxed font-normal">
            Standar formulasi klinis berizin resmi BPOM RI dengan komitmen proteksi penuh di setiap transaksi.
          </p>
        </div>

        {/* 4 Pillars — Flat Minimalist Modern */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
          {ASSURANCES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex flex-col items-start pt-5 border-t border-black/[0.08]"
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <Icon className="w-5 h-5 text-text stroke-[1.5]" />
                  <span className="font-mono text-[10px] tracking-widest text-black/40 font-medium">
                    {item.num}
                  </span>
                </div>
                <h4 className="text-xs sm:text-[13px] font-semibold text-text tracking-tight mb-1.5">
                  {item.title}
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
