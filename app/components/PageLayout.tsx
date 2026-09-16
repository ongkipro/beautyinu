import {Await, Link} from 'react-router';
import {Suspense, useId} from 'react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, MobileMenu} from '~/components/Header';
import {CartMain} from '~/components/CartMain';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,
  isLoggedIn,
}: PageLayoutProps) {
  return (
    <Aside.Provider>
      <CartAside cart={cart} />
      <SearchAside />
      <MobileMenuAside />
      <Header cart={cart} isLoggedIn={isLoggedIn} />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
    </Aside.Provider>
  );
}

function CartAside({cart}: {cart: PageLayoutProps['cart']}) {
  return (
    <Aside type="cart" heading="Your Cart">
      <Suspense fallback={<p className="p-4">Loading cart...</p>}>
        <Await resolve={cart}>
          {(cart) => <CartMain cart={cart} layout="aside" />}
        </Await>
      </Suspense>
    </Aside>
  );
}

function SearchAside() {
  const queriesDatalistId = useId();
  return (
    <Aside type="search" heading="Search">
      <div className="predictive-search">
        <br />
        <SearchFormPredictive>
          {({fetchResults, goToSearch, inputRef}) => (
            <div className="flex gap-2 px-4">
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search products..."
                ref={inputRef}
                type="search"
                list={queriesDatalistId}
                className="flex-1 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                onClick={goToSearch}
                className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-hover transition-colors"
              >
                Search
              </button>
            </div>
          )}
        </SearchFormPredictive>

        <SearchResultsPredictive>
          {({items, total, term, state, closeSearch}) => {
            const {articles, collections, pages, products, queries} = items;

            if (state === 'loading' && term.current) {
              return <div className="p-4 text-sm text-text-secondary">Loading...</div>;
            }

            if (!total) {
              return <SearchResultsPredictive.Empty term={term} />;
            }

            return (
              <>
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
                {term.current && total ? (
                  <Link
                    onClick={closeSearch}
                    to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                    className="block p-4 text-sm text-primary hover:underline"
                  >
                    View all results for <q>{term.current}</q> →
                  </Link>
                ) : null}
              </>
            );
          }}
        </SearchResultsPredictive>
      </div>
    </Aside>
  );
}

function MobileMenuAside() {
  return (
    <Aside type="mobile" heading="Menu">
      <MobileMenu />
    </Aside>
  );
}
