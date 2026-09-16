import {Link} from 'react-router';
import {Image, Money, Pagination} from '@shopify/hydrogen';
import {urlWithTrackingParams, type RegularSearchReturn} from '~/lib/search';

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
    <div className="mt-12 pt-4">
      <h2 className="font-serif text-2xl mb-4">Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles?.nodes?.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.handle}`,
            trackingParams: article.trackingParameters,
            term,
          });

          return (
            <div
              key={article.id}
              className="p-4 rounded-xl bg-[#FAF7FD] hover:bg-[#F3EEFA] transition-colors"
            >
              <Link prefetch="intent" to={articleUrl} className="block">
                <span className="font-medium text-text hover:text-primary transition-colors">
                  {article.title}
                </span>
              </Link>
            </div>
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
    <div className="mt-12 pt-4">
      <h2 className="font-serif text-2xl mb-4">Pages</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pages?.nodes?.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term,
          });

          return (
            <div
              key={page.id}
              className="p-4 rounded-xl bg-[#FAF7FD] hover:bg-[#F3EEFA] transition-colors"
            >
              <Link prefetch="intent" to={pageUrl} className="block">
                <span className="font-medium text-text hover:text-primary transition-colors">
                  {page.title}
                </span>
              </Link>
            </div>
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
      <h2 className="font-serif text-2xl mb-6">Products</h2>
      <Pagination connection={products}>
        {({nodes, isLoading, NextLink, PreviousLink}) => {
          return (
            <div>
              <div className="text-center mb-4">
                <PreviousLink className="text-sm font-medium text-primary hover:underline">
                  {isLoading ? 'Loading...' : '↑ Load previous'}
                </PreviousLink>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                      className="group block rounded-2xl bg-[#FAF7FD] p-4 hover:-translate-y-0.5 transition-transform"
                    >
                      <div className="aspect-square w-full rounded-xl overflow-hidden bg-surface mb-3 flex items-center justify-center">
                        {image && (
                          <Image
                            data={image}
                            alt={product.title}
                            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
                          />
                        )}
                      </div>
                      <h3 className="text-sm font-medium text-text line-clamp-2 group-hover:text-primary transition-colors">
                        {product.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-2">
                        {price && (
                          <span className="text-sm font-semibold text-text">
                            <Money data={price} withoutTrailingZeros />
                          </span>
                        )}
                        {compareAtPrice && (
                          <span className="text-xs text-text-secondary line-through">
                            <Money data={compareAtPrice} withoutTrailingZeros />
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="text-center mt-8">
                <NextLink className="inline-flex items-center rounded-full bg-text text-white px-6 py-2.5 text-sm font-semibold hover:bg-black transition-colors">
                  {isLoading ? 'Loading...' : 'Load more ↓'}
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
    <div className="py-16 text-center">
      <p className="text-lg text-text-secondary mb-4">No results found.</p>
      <p className="text-sm text-text-secondary">
        Try checking for typos or searching for a generic term like &ldquo;lotion&rdquo; or &ldquo;soap&rdquo;.
      </p>
    </div>
  );
}
