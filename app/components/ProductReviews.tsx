import {useState} from 'react';
import {Star, CheckCircle2, ShieldCheck, ThumbsUp, Sparkles, MessageSquare} from 'lucide-react';
import {getShopeeProductData, type ReviewItem} from '~/data/shopeeData';

interface ProductReviewsProps {
  productTitle: string;
  productHandle?: string;
}

export function ProductReviews({productTitle, productHandle}: ProductReviewsProps) {
  const data = getShopeeProductData(productHandle);
  const [activeFilter, setActiveFilter] = useState<'all' | 'media' | '5' | '4'>('all');
  const [helpfulLikes, setHelpfulLikes] = useState<Record<string, number>>({});
  const [hasLiked, setHasLiked] = useState<Record<string, boolean>>({});

  const handleHelpfulClick = (id: string, initialCount: number) => {
    if (hasLiked[id]) return;
    setHelpfulLikes((prev) => ({
      ...prev,
      [id]: (prev[id] ?? initialCount) + 1,
    }));
    setHasLiked((prev) => ({...prev, [id]: true}));
  };

  const filteredReviews = data.reviewsList.filter((rev) => {
    if (activeFilter === 'media') return rev.hasMedia;
    if (activeFilter === '5') return rev.rating === 5;
    if (activeFilter === '4') return rev.rating === 4;
    return true;
  });

  return (
    <section id="reviews-section" className="mt-16 sm:mt-24 border-t border-black/[0.06] pt-12 sm:pt-16 min-w-0 max-w-full">
      {/* Section Header */}
      <div className="mb-8 text-center md:text-left">
        <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.25em] text-black/50 block mb-1.5">
          Ulasan Asli Terverifikasi
        </span>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="font-serif text-2xl sm:text-3xl text-text font-normal tracking-tight">
            Penilaian Produk
          </h2>
          <span className="text-xs text-text-secondary font-medium">
            {data.reviews} Penilaian Transparan &bull; {data.sold} Terjual
          </span>
        </div>
      </div>

      {/* 1. Rating Summary Overview Card (Shopee & Luxury Skincare Hybrid) */}
      <div className="bg-[#FAF9FB] border border-black/[0.05] rounded-3xl p-6 sm:p-8 lg:p-10 mb-8 shadow-2xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Rating Big Score */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-5xl sm:text-6xl font-bold text-text tracking-tight">
                {data.rating}
              </span>
              <span className="text-sm font-semibold text-text-secondary">/ 5.0</span>
            </div>

            {/* 5 Stars */}
            <div className="flex items-center gap-1 my-2 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400"
                  strokeWidth={0}
                />
              ))}
            </div>

            <p className="text-xs text-text-secondary mb-3">
              Berdasarkan {data.reviewsCountNum.toLocaleString('id-ID')} ulasan pembeli
            </p>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-[11px] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>{data.satisfactionRate} Pembeli Merekomendasikan</span>
            </div>
          </div>

          {/* Center: Star Breakdown Bars */}
          <div className="lg:col-span-4 flex flex-col justify-center gap-2 border-y lg:border-y-0 lg:border-x border-black/[0.06] py-5 lg:py-0 lg:px-6">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-14 text-text-secondary font-medium">5 Bintang</span>
              <div className="flex-1 h-2 bg-black/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{width: `${data.fiveStarPercent}%`}}
                />
              </div>
              <span className="w-8 text-right font-mono text-[11px] text-text-secondary">
                {data.fiveStarPercent}%
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="w-14 text-text-secondary font-medium">4 Bintang</span>
              <div className="flex-1 h-2 bg-black/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400/80 rounded-full"
                  style={{width: `${data.fourStarPercent}%`}}
                />
              </div>
              <span className="w-8 text-right font-mono text-[11px] text-text-secondary">
                {data.fourStarPercent}%
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="w-14 text-text-secondary font-medium">3 Bintang</span>
              <div className="flex-1 h-2 bg-black/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400/60 rounded-full"
                  style={{width: `${data.threeStarPercent}%`}}
                />
              </div>
              <span className="w-8 text-right font-mono text-[11px] text-text-secondary">
                {data.threeStarPercent}%
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-text-secondary/50">
              <span className="w-14 font-medium">2 Bintang</span>
              <div className="flex-1 h-2 bg-black/[0.04] rounded-full overflow-hidden">
                <div className="h-full bg-black/20" style={{width: '0%'}} />
              </div>
              <span className="w-8 text-right font-mono text-[11px]">0%</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-text-secondary/50">
              <span className="w-14 font-medium">1 Bintang</span>
              <div className="flex-1 h-2 bg-black/[0.04] rounded-full overflow-hidden">
                <div className="h-full bg-black/20" style={{width: '0%'}} />
              </div>
              <span className="w-8 text-right font-mono text-[11px]">0%</span>
            </div>
          </div>

          {/* Right: Interactive Filter Buttons (Shopee Style) */}
          <div className="lg:col-span-4 flex flex-col justify-center gap-2">
            <span className="text-xs font-semibold text-text mb-1">
              Filter Penilaian:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'bg-white text-text-secondary hover:text-text border border-black/[0.08]'
                }`}
              >
                Semua ({data.reviews})
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter('media')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  activeFilter === 'media'
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'bg-white text-text-secondary hover:text-text border border-black/[0.08]'
                }`}
              >
                Dengan Foto / Video ({data.mediaCount})
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter('5')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  activeFilter === '5'
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'bg-white text-text-secondary hover:text-text border border-black/[0.08]'
                }`}
              >
                5 Bintang ({data.fiveStarCount})
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter('4')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  activeFilter === '4'
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'bg-white text-text-secondary hover:text-text border border-black/[0.08]'
                }`}
              >
                4 Bintang ({data.fourStarCount})
              </button>
            </div>
            <p className="text-[11px] text-text-secondary/70 mt-2 font-mono">
              &bull; Diperbarui real-time dari Shopee Official Store
            </p>
          </div>
        </div>
      </div>

      {/* 2. Review List */}
      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((rev) => {
            const currentLikes = helpfulLikes[rev.id] ?? rev.helpfulCount;
            const isLiked = hasLiked[rev.id];

            return (
              <div
                key={rev.id}
                className="bg-white border border-black/[0.06] rounded-2xl p-5 sm:p-6 transition-all hover:border-black/[0.12] shadow-2xs"
              >
                {/* Header: User Avatar + Name + Rating Stars + Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {rev.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span className="font-semibold text-xs text-text">{rev.name}</span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200/50 px-1.5 sm:px-2 py-0.5 rounded-md flex-shrink-0">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          <span>Terverifikasi</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-3 h-3 fill-amber-400 text-amber-400"
                              strokeWidth={0}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-text-secondary/70">&bull;</span>
                        <span className="text-[11px] text-text-secondary">{rev.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Variant Tag */}
                  <div className="self-start sm:self-auto">
                    <span className="text-[11px] font-mono text-text-secondary bg-[#FAF9FB] border border-black/[0.04] px-2.5 py-1 rounded-md">
                      Varian: {rev.variant}
                    </span>
                  </div>
                </div>

                {/* Review Body Content */}
                <p className="text-xs sm:text-sm text-text/85 leading-relaxed mb-3">
                  {rev.content}
                </p>

                {/* Seller Reply Bubble if available */}
                {rev.sellerReply && (
                  <div className="mt-3 p-3.5 rounded-xl bg-[#FAF9FB] border border-black/[0.04] text-xs text-text-secondary leading-relaxed">
                    <div className="flex items-center gap-1.5 font-semibold text-text mb-1">
                      <MessageSquare className="w-3 h-3 text-primary" />
                      <span>Respon Beautyinu Official:</span>
                    </div>
                    <p className="text-[11px] text-text-secondary/90">{rev.sellerReply}</p>
                  </div>
                )}

                {/* Footer: Helpful Reaction Button */}
                <div className="mt-3.5 pt-3 border-t border-black/[0.04] flex items-center justify-between text-xs text-text-secondary">
                  <span className="text-[11px] font-mono text-text-secondary/60">
                    Shopee Official Store Verified
                  </span>
                  <button
                    type="button"
                    onClick={() => handleHelpfulClick(rev.id, rev.helpfulCount)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      isLiked
                        ? 'text-primary bg-primary/10 border border-primary/20 font-semibold'
                        : 'text-text-secondary hover:text-text bg-[#FAF9FB] hover:bg-[#F3EEFA]/70 border border-black/[0.05]'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>Membantu ({currentLikes})</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center rounded-2xl bg-[#FAF9FB] border border-black/[0.05] p-6">
            <Sparkles className="w-6 h-6 text-primary mx-auto mb-2" strokeWidth={1.5} />
            <h4 className="text-sm font-semibold text-text mb-1">Semua ulasan puas</h4>
            <p className="text-xs text-text-secondary">
              Seluruh ulasan pada kategori ini memberikan penilaian bintang 4 dan 5.
            </p>
          </div>
        )}
      </div>

      {/* Trust Reassurance Footnote */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
        <div className="p-4 rounded-2xl bg-[#FAF9FB] border border-black/[0.04] flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" strokeWidth={1.5} />
          <span className="text-xs font-semibold text-text">100% Original &amp; BPOM Resmi</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#FAF9FB] border border-black/[0.04] flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={1.5} />
          <span className="text-xs font-semibold text-text">Packing Bubble Wrap Tebal</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#FAF9FB] border border-black/[0.04] flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" strokeWidth={1.5} />
          <span className="text-xs font-semibold text-text">Pengiriman Kilat dari Surabaya</span>
        </div>
      </div>
    </section>
  );
}
