import {useEffect, useId, useRef, useState} from 'react';
import {Link} from 'react-router';
import {useAside} from '~/components/Aside';
import {SearchFormPredictive} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';
import {
  ArrowLeft,
  ArrowRight,
  History,
  Search,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';

const RECENT_SEARCHES_KEY = 'beautyinu_recent_searches';

const TRENDING_SEARCHES = [
  'Sabun Kefir Bar',
  'Paket Glowing 3-in-1',
  'Body Lotion UV 750ml',
  'Booster Powder Gold',
  'Niacinamide 5.22%',
];

const SKIN_CONCERN_CHIPS = [
  {label: 'Kulit Belang & Kusam', query: 'kusam belang'},
  {label: 'Bekas Luka / Koreng', query: 'bekas luka'},
  {label: 'Kulit Kering Bersisik', query: 'kering bersisik'},
  {label: 'Proteksi Matahari UV', query: 'UV filter'},
  {label: 'Paket Glowing Rutin', query: 'glowing set'},
];

const CURATED_SEARCH_PICKS = [
  {
    title: 'The Glowing Set (3-in-1 Complete Ritual)',
    handle: 'the-glowing-set',
    price: 'Rp 155.092',
    badge: 'Hemat 39%',
    step: '3-in-1 Set',
    image:
      'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/WebsiteBeautyinu-3.png?v=1784278179',
  },
  {
    title: 'Sabun Kefir Collagen Brightening Bar 60gr',
    handle: 'kefir-collagen-soap-60gr',
    price: 'Rp 45.000',
    badge: 'Best Seller',
    step: 'Step 01 · Cleanse',
    image:
      'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_7.png?v=1781661857',
  },
  {
    title: 'Body Lotion UV Filter Brightening 750ml',
    handle: 'body-lotion-uv-750ml',
    price: 'Rp 109.000',
    badge: 'Favorit',
    step: 'Step 03 · Protect',
    image:
      'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_9.png?v=1781661846',
  },
];

/**
 * Minimalist Modern Professional Gen Z Search Suite — Floating Modal ("Modal Mengambang")
 * - Slide in smoothly from right-to-left.
 * - Inset floating island on both mobile (top-3 right-3 bottom-3 left-3) and desktop (top-4 right-4 bottom-4).
 * - Clean editorial typography, zero card-in-card AI slop, breathable flat rows.
 * - Backdrop blur with safe scroll lock and no header collision.
 */
export function SearchPopover() {
  const {type, close} = useAside();
  const isOpen = type === 'search';
  const queriesDatalistId = useId();
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputElRef = useRef<HTMLInputElement | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [queryText, setQueryText] = useState('');

  // Handle focus & queryText reset on state changes
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputElRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setQueryText('');
    }
  }, [isOpen]);

  // Load recent searches from localStorage on mount & when opened
  useEffect(() => {
    if (!isOpen) return;
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches((JSON.parse(stored) as string[]) || []);
      }
    } catch {
      // Fallback gracefully
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        close();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close]);

  const saveSearchTerm = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed || trimmed.length < 2) return;
    try {
      const existing: string[] =
        (JSON.parse(
          localStorage.getItem(RECENT_SEARCHES_KEY) || '[]',
        ) as string[]) || [];
      const updated = [
        trimmed,
        ...existing.filter(
          (item) => item.toLowerCase() !== trimmed.toLowerCase(),
        ),
      ].slice(0, 6);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      setRecentSearches(updated);
    } catch {
      // ignore
    }
  };

  const removeSearchTerm = (termToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const existing: string[] =
        (JSON.parse(
          localStorage.getItem(RECENT_SEARCHES_KEY) || '[]',
        ) as string[]) || [];
      const updated = existing.filter((item) => item !== termToRemove);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      setRecentSearches(updated);
    } catch {
      // ignore
    }
  };

  const clearAllRecent = () => {
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
      setRecentSearches([]);
    } catch {
      // ignore
    }
  };

  return (
    <>
      {/* 1. Backdrop Overlay with Dimming & Blur */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-all duration-300 ${
          isOpen
            ? 'opacity-100 pointer-events-auto visible'
            : 'opacity-0 pointer-events-none invisible'
        }`}
        onClick={close}
        aria-hidden="true"
      />

      {/* 2. Floating Modal Panel ("Modal Mengambang") — Slide Right-to-Left */}
      <div
        ref={popoverRef}
        role="dialog"
        aria-modal="true"
        aria-label="Pencarian Cepat Produk Beautyinu"
        className={`fixed z-50 bg-white flex flex-col overflow-hidden overscroll-contain transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] text-left
          /* Mobile: Floating island with 12px margin all around and safe area compensation */
          top-3 right-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] left-3 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.22)] border border-black/[0.08]
          /* Desktop: Floating card on right with 16px margins — matched with Cart modal width */
          sm:left-auto sm:top-4 sm:right-4 sm:bottom-4 sm:w-[460px] md:w-[480px] sm:max-h-[calc(100dvh-2rem)]
          ${
            isOpen
              ? 'translate-x-0 opacity-100 pointer-events-auto visible'
              : 'translate-x-[calc(100%+2rem)] opacity-0 pointer-events-none invisible'
          }
        `}
      >
        <SearchFormPredictive className="flex flex-col h-full overflow-hidden">
          {({fetchResults, goToSearch, inputRef, submitTerm}) => {
            const handleSelectQuery = (term: string) => {
              setQueryText(term);
              saveSearchTerm(term);
              submitTerm(term);
            };

            const handleViewAll = () => {
              const currentVal = inputRef.current?.value || '';
              if (currentVal) {
                saveSearchTerm(currentVal);
              }
              goToSearch();
            };

            return (
              <div className="flex flex-col h-full overflow-hidden">
                {/* 1. Search Bar Header (Clean Minimalist Form) */}
                <div className="p-3.5 sm:p-4 border-b border-black/[0.06] bg-white sticky top-0 z-10 flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  {/* Mobile Back Button */}
                  <button
                    type="button"
                    onClick={close}
                    className="sm:hidden w-9 h-9 rounded-full flex items-center justify-center text-text-secondary hover:text-text hover:bg-black/5 active:scale-95 transition-all cursor-pointer flex-shrink-0"
                    aria-label="Kembali dari pencarian"
                  >
                    <ArrowLeft className="w-4.5 h-4.5" strokeWidth={1.5} />
                  </button>

                  {/* Search Input Field */}
                  <div className="relative flex-1 flex items-center">
                    <Search
                      className="w-4 h-4 text-text-secondary absolute left-3.5 pointer-events-none"
                      strokeWidth={1.5}
                    />
                    <input
                      name="q"
                      onChange={(e) => {
                        setQueryText(e.target.value);
                        fetchResults(e);
                      }}
                      onFocus={fetchResults}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleViewAll();
                        }
                      }}
                      placeholder="Cari masalah kulit, sabun, lotion, booster..."
                      ref={(el) => {
                        inputRef.current = el;
                        inputElRef.current = el;
                      }}
                      type="search"
                      list={queriesDatalistId}
                      className="w-full pl-10 pr-9 py-2.5 sm:py-3 bg-[#F7F6F9] hover:bg-[#F2F0F5] focus:bg-white border border-transparent focus:border-black/10 rounded-full sm:rounded-2xl text-base sm:text-sm text-text placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
                    />
                    {/* Clear Button (Visible only when text is typed) */}
                    {queryText ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (inputRef.current) {
                            inputRef.current.value = '';
                            submitTerm('');
                            setQueryText('');
                          }
                        }}
                        className="absolute right-2.5 text-text-secondary/50 hover:text-text p-1 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
                        aria-label="Bersihkan input pencarian"
                      >
                        <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                    ) : null}
                  </div>

                  {/* Desktop ESC Hint and Close Button */}
                  <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                    <kbd className="text-[10px] font-mono text-text-secondary/70 bg-[#F7F6F9] px-2 py-1 rounded-md select-none">
                      ESC
                    </kbd>
                    <button
                      type="button"
                      onClick={close}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary hover:text-text hover:bg-black/5 transition-colors cursor-pointer"
                      aria-label="Tutup pencarian"
                    >
                      <X className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>

                {/* 2. Scrollable Body: Zero-State or Predictive Results */}
                <div className="flex-1 overflow-y-auto overscroll-contain">
                  <SearchResultsPredictive>
                    {({items, total, term, state, closeSearch}) => {
                      const {articles, collections, pages, products, queries} =
                        items;

                      // Loading State
                      if (state === 'loading' && term.current) {
                        return (
                          <div className="p-10 text-center flex flex-col items-center justify-center">
                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
                            <p className="text-xs text-text-secondary font-medium">
                              Mencari formula terbaik untuk kulitmu...
                            </p>
                          </div>
                        );
                      }

                      // A. ZERO-QUERY STATE (When search field is empty)
                      if (!term.current) {
                        return (
                          <div className="p-4 sm:p-6 space-y-6 pb-24 sm:pb-8">
                            {/* 1. Recent Searches (LocalStorage) */}
                            {recentSearches.length > 0 && (
                              <div>
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2.5">
                                  <div className="flex items-center gap-1.5">
                                    <History
                                      className="w-3.5 h-3.5 text-primary"
                                      strokeWidth={1.5}
                                    />
                                    <span>Pencarian Terakhir</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={clearAllRecent}
                                    className="text-[10px] lowercase text-text-secondary/60 hover:text-red-500 font-medium transition-colors cursor-pointer"
                                  >
                                    hapus riwayat
                                  </button>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {recentSearches.map((query) => (
                                    <div
                                      key={query}
                                      className="group inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 bg-[#F7F6F9] hover:bg-[#ECE9EE] text-text hover:text-primary rounded-full text-xs font-medium transition-all"
                                    >
                                      <button
                                        type="button"
                                        onClick={() => handleSelectQuery(query)}
                                        className="cursor-pointer"
                                      >
                                        {query}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={(e) =>
                                          removeSearchTerm(query, e)
                                        }
                                        className="text-text-secondary/40 hover:text-red-500 p-0.5 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
                                        aria-label={`Hapus ${query}`}
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* 2. Solusi Masalah Kulit (Problem-First Search) */}
                            <div>
                              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2.5">
                                <Sparkles
                                  className="w-3.5 h-3.5 text-primary"
                                  strokeWidth={1.5}
                                />
                                <span>Solusi Masalah Kulit</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {SKIN_CONCERN_CHIPS.map((chip) => (
                                  <button
                                    key={chip.label}
                                    type="button"
                                    onClick={() =>
                                      handleSelectQuery(chip.query)
                                    }
                                    className="px-3 py-1.5 bg-[#F7F6F9] hover:bg-[#ECE9EE] text-text/80 hover:text-primary rounded-full text-xs font-medium transition-colors cursor-pointer"
                                  >
                                    {chip.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* 3. Trending Now (Social Virality) */}
                            <div>
                              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2.5">
                                <TrendingUp
                                  className="w-3.5 h-3.5 text-accent"
                                  strokeWidth={1.5}
                                />
                                <span>Trending Sekarang</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {TRENDING_SEARCHES.map((item) => (
                                  <button
                                    key={item}
                                    type="button"
                                    onClick={() =>
                                      handleSelectQuery(item)
                                    }
                                    className="px-3 py-1.5 bg-[#F7F6F9] hover:bg-[#ECE9EE] text-text/80 hover:text-text rounded-full text-xs font-medium transition-colors cursor-pointer"
                                  >
                                    {item}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* 4. Curated Bestseller Routine Picks (Clean Editorial Flat Rows — Zero AI Slop) */}
                            <div>
                              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2.5">
                                <span>Rekomendasi Rangkaian Rutin</span>
                                <Link
                                  to="/collections/frontpage"
                                  onClick={close}
                                  className="text-primary hover:underline text-[10px] font-bold"
                                >
                                  Semua Produk →
                                </Link>
                              </div>
                              <div className="space-y-1">
                                {CURATED_SEARCH_PICKS.map((item) => (
                                  <Link
                                    key={item.handle}
                                    to={`/products/${item.handle}`}
                                    onClick={close}
                                    className="group flex items-center gap-3.5 py-2 px-2 -mx-2 rounded-2xl hover:bg-[#F7F6F9] transition-colors"
                                  >
                                    <div className="w-13 h-13 rounded-xl bg-[#F7F6F9] group-hover:bg-white p-1.5 flex items-center justify-center flex-shrink-0 transition-colors">
                                      <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-contain"
                                      />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                                          {item.badge}
                                        </span>
                                        <span className="text-[9px] text-text-secondary/70 font-medium">
                                          {item.step}
                                        </span>
                                      </div>
                                      <p className="text-xs sm:text-sm font-semibold text-text line-clamp-1 group-hover:text-primary transition-colors">
                                        {item.title}
                                      </p>
                                      <span className="text-xs font-bold text-text mt-0.5 block">
                                        {item.price}
                                      </span>
                                    </div>
                                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-text-secondary/30 group-hover:text-primary group-hover:bg-primary/5 transition-all flex-shrink-0">
                                      <ArrowRight
                                        className="w-3.5 h-3.5"
                                        strokeWidth={1.5}
                                      />
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      }

                      // B. NO RESULTS STATE
                      if (!total) {
                        return <SearchResultsPredictive.Empty term={term} />;
                      }

                      // C. RESULTS FOUND STATE
                      return (
                        <div className="divide-y divide-black/[0.04] pb-20 sm:pb-16">
                          <SearchResultsPredictive.Queries
                            queries={queries}
                            queriesDatalistId={queriesDatalistId}
                          />
                          <SearchResultsPredictive.Products
                            products={products}
                            closeSearch={closeSearch}
                            term={term}
                          />
                          <SearchResultsPredictive.Collections
                            collections={collections}
                            closeSearch={closeSearch}
                            term={term}
                          />
                          <SearchResultsPredictive.Pages
                            pages={pages}
                            closeSearch={closeSearch}
                            term={term}
                          />
                          <SearchResultsPredictive.Articles
                            articles={articles}
                            closeSearch={closeSearch}
                            term={term}
                          />

                          {/* Sticky Bottom View-All Button */}
                          {term.current && total ? (
                            <div className="p-3.5 sm:p-4 bg-white/95 backdrop-blur-md sticky bottom-0 border-t border-black/[0.06] shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
                              <button
                                type="button"
                                onClick={handleViewAll}
                                className="w-full bg-[#111111] hover:bg-black text-white py-3 px-4 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
                              >
                                <span>Lihat Semua Hasil ({total})</span>
                                <ArrowRight
                                  className="w-3.5 h-3.5"
                                  strokeWidth={1.5}
                                />
                              </button>
                            </div>
                          ) : null}
                        </div>
                      );
                    }}
                  </SearchResultsPredictive>
                </div>
              </div>
            );
          }}
        </SearchFormPredictive>
      </div>
    </>
  );
}
