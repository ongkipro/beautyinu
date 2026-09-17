import {Link} from 'react-router';
import {Image, Money, Pagination} from '@shopify/hydrogen';
import {urlWithTrackingParams, type RegularSearchReturn} from '~/lib/search';
import {ArrowRight, Search, FileText, Sparkles, CheckCircle2, Star} from 'lucide-react';

type SearchItems = RegularSearchReturn['result']['items'];
type PartialSearchResult<ItemType extends keyof SearchItems> = Pick<
  SearchItems,
  ItemType
> &
  Pick<RegularSearchReturn, 'term'>;

type SearchResultsProps = RegularSearchReturn & {
  children: (args: SearchItems & {term: string}) => React.ReactNode;
};

export function SearchResults({
  term,
  result,
  children,
}: Omit<SearchResultsProps, 'error' | 'type'>) {
  if (!result?.total) {
    return null;
  }

  return children({...result.items, term});
}

SearchResults.Articles = SearchResultsArticles;
SearchResults.Pages = SearchResultsPages;
SearchResults.Products = SearchResultsProducts;
SearchResults.Empty = SearchResultsEmpty;

function SearchResultsArticles({
  term,
  articles,
}: PartialSearchResult<'articles'>) {
  if (!articles?.nodes.length) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t border-black/[0.06]">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-5 h-5 text-primary" strokeWidth={1.5} />
        <h2 className="font-serif text-2xl text-text">Artikel &amp; Panduan Kulit</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles?.nodes?.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.handle}`,
            trackingParams: article.trackingParameters,
            term,
          });

          return (
            <Link
              key={article.id}
              prefetch="intent"
              to={articleUrl}
              className="group p-5 rounded-2xl bg-[#FAF8FC] hover:bg-[#F3EEFA]/80 border border-black/[0.04] transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent-light px-2 py-0.5 rounded-md mb-3 inline-block">
                  Tips Perawatan
                </span>
                <h3 className="font-semibold text-sm text-text line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary">
                <span>Baca Selengkapnya</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SearchResultsPages({term, pages}: PartialSearchResult<'pages'>) {
  if (!pages?.nodes.length) {
    return null;
  }

  return (
    <div className="mt-8 pt-6 border-t border-black/[0.06]">
      <h2 className="font-serif text-xl mb-4 text-text">Halaman Bantuan</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {pages?.nodes?.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term,
          });

          return (
            <Link
              key={page.id}
              prefetch="intent"
              to={pageUrl}
              className="p-4 rounded-xl bg-white border border-black/[0.06] hover:border-primary/40 hover:shadow-2xs transition-all flex items-center justify-between"
            >
              <span className="text-xs font-semibold text-text hover:text-primary transition-colors">
                {page.title}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-text-secondary/50" strokeWidth={1.5} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SearchResultsProducts({
  term,
  products,
}: PartialSearchResult<'products'>) {
  if (!products?.nodes.length) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl text-text">Produk Perawatan Kulit</h2>
        <span className="text-xs text-text-secondary font-medium">
          Menampilkan {products.nodes.length} formula
        </span>
      </div>

      <Pagination connection={products}>
        {({nodes, isLoading, NextLink, PreviousLink}) => {
          return (
            <div>
              <div className="text-center mb-6">
                <PreviousLink className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FAF8FC] text-xs font-bold text-text hover:text-primary transition-colors">
                  {isLoading ? 'Memuat...' : '↑ Halaman Sebelumnya'}
                </PreviousLink>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-8 sm:gap-y-10 lg:gap-y-12">
                {nodes.map((product) => {
                  const productUrl = urlWithTrackingParams({
                    baseUrl: `/products/${product.handle}`,
                    trackingParams: product.trackingParameters,
                    term,
                  });

                  const price =
                    product?.selectedOrFirstAvailableVariant?.price;
                  const compareAtPrice =
                    product?.selectedOrFirstAvailableVariant?.compareAtPrice;
                  const image =
                    product?.selectedOrFirstAvailableVariant?.image;

                  return (
                    <Link
                      key={product.id}
                      prefetch="intent"
                      to={productUrl}
                      className="group flex flex-col justify-between rounded-2xl bg-white border border-black/[0.06] p-3.5 sm:p-4 hover:shadow-md hover:-translate-y-0.5 transition-all"
                    >
                      <div>
                        <div className="aspect-square w-full rounded-xl overflow-hidden bg-[#FAF8FC] mb-3 flex items-center justify-center p-3 border border-black/[0.03] relative">
                          {image && (
                            <Image
                              data={image}
                              alt={product.title}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                          )}
                          <div className="absolute top-2 left-2">
                            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-white/90 backdrop-blur-xs text-primary rounded-md border border-primary/20 shadow-2xs">
                              BPOM RI
                            </span>
                          </div>
                        </div>
                        <h3 className="text-sm sm:text-base font-semibold text-text line-clamp-2 text-center group-hover:text-primary transition-colors leading-snug">
                          {product.title}
                        </h3>
                      </div>

                      <div className="mt-3 pt-3 border-t border-black/[0.04] flex flex-col items-center text-center">
                        <div className="flex items-baseline justify-center gap-2">
                          {price && (
                            <span className="text-sm sm:text-base font-bold text-text">
                              <Money data={price} withoutTrailingZeros />
                            </span>
                          )}
                          {compareAtPrice && (
                            <span className="text-xs sm:text-sm text-text-secondary line-through">
                              <Money data={compareAtPrice} withoutTrailingZeros />
                            </span>
                          )}
                        </div>
                        <div className="mt-1.5 flex items-center justify-center gap-1.5 text-xs sm:text-sm text-text-secondary">
                          <div className="flex items-center gap-0.5 font-semibold text-text">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 flex-shrink-0" />
                            <span>4.9</span>
                          </div>
                          <span className="text-black/20 text-xs">•</span>
                          <span className="font-medium text-text-secondary">10rb+ terjual</span>
                        </div>
                        <div className="mt-2.5 w-full py-2.5 rounded-xl bg-[#FAF8FC] group-hover:bg-primary text-text group-hover:text-white text-xs sm:text-sm font-bold transition-all duration-300 group-hover:shadow-md group-hover:shadow-primary/25 text-center flex items-center justify-center gap-1 active:scale-[0.98]">
                          <span>Lihat Formula</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="text-center mt-10">
                <NextLink className="inline-flex items-center gap-2 rounded-xl bg-[#111111] text-white px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-primary transition-all duration-300 shadow-xs hover:shadow-md hover:shadow-primary/25">
                  <span>{isLoading ? 'Memuat...' : 'Muat Lebih Banyak'}</span>
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                </NextLink>
              </div>
            </div>
          );
        }}
      </Pagination>
    </div>
  );
}

function SearchResultsEmpty() {
  return (
    <div className="py-16 text-center max-w-md mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-accent-light/50 border border-accent/20 flex items-center justify-center text-accent mx-auto mb-4">
        <Search className="w-6 h-6" strokeWidth={1.5} />
      </div>
      <h3 className="font-serif text-2xl text-text mb-2">Produk Tidak Ditemukan</h3>
      <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-6">
        Kami tidak menemukan produk yang cocok dengan kata kunci Anda. Coba periksa ejaan atau gunakan kata kunci umum seperti <em>sabun</em>, <em>lotion</em>, atau <em>kefir</em>.
      </p>
      <Link
        to="/collections/all"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#111111] hover:bg-primary text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-xs hover:shadow-md hover:shadow-primary/25 transition-all duration-300"
      >
        <span>Jelajahi Semua Produk</span>
        <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
      </Link>
    </div>
  );
}
