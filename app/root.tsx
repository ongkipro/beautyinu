import {Analytics, getShopAnalytics, useNonce} from '@shopify/hydrogen';
import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
  NavLink,
} from 'react-router';
import type {Route} from './+types/root';
import favicon from '~/assets/favicon.png';
import appStyles from '~/styles/app.css?url';
import tailwindCss from './styles/tailwind.css?url';
import {PageLayout} from './components/PageLayout';

export type RootLoader = typeof loader;

/**
 * Avoid re-fetching root queries on sub-navigations.
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  if (formMethod && formMethod !== 'GET') return true;
  if (currentUrl.toString() === nextUrl.toString()) return true;
  return false;
};

export function links() {
  return [
    {rel: 'preconnect', href: 'https://cdn.shopify.com'},
    {rel: 'preconnect', href: 'https://shop.app'},
    {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' as const},
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..700;1,400..700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
    },
    {rel: 'icon', type: 'image/png', href: favicon},
  ];
}

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const {storefront, env} = args.context;

  return {
    ...deferredData,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
      country: args.context.storefront.i18n.country,
      language: args.context.storefront.i18n.language,
    },
  };
}

function loadDeferredData({context}: Route.LoaderArgs) {
  const {customerAccount, cart} = context;
  return {
    cart: cart.get(),
    isLoggedIn: customerAccount.isLoggedIn(),
  };
}

export function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();

  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
        <link rel="stylesheet" href={appStyles}></link>
        <link rel="stylesheet" href={tailwindCss}></link>
        <Meta />
        <Links />
      </head>
      <body className="bg-bg text-text font-sans overflow-x-clip min-h-screen">
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  const data = useRouteLoaderData<RootLoader>('root');

  if (!data) {
    return <Outlet />;
  }

  return (
    <Analytics.Provider
      cart={data.cart}
      shop={data.shop}
      consent={data.consent}
    >
      <PageLayout cart={data.cart} isLoggedIn={data.isLoggedIn}>
        <Outlet />
      </PageLayout>
    </Analytics.Provider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = 'Terjadi kendala teknis saat memuat halaman.';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage =
      error?.data?.message ??
      (typeof error.data === 'string'
        ? error.data
        : 'Halaman yang kamu cari tidak ditemukan.');
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  const is404 = errorStatus === 404;

  return (
    <div className="min-h-screen bg-[#FAF9FB] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-black/[0.06] shadow-sm">
        <NavLink to="/" className="inline-block mb-6">
          <span className="font-serif text-3xl text-primary font-bold tracking-tight">
            Beautyinu
          </span>
        </NavLink>
        <span className="inline-block text-[10px] sm:text-[11px] font-mono font-medium uppercase tracking-[0.25em] text-black/50 mb-2">
          {is404
            ? 'Kode 404 · Halaman Tidak Ditemukan'
            : `Kode ${errorStatus} · Terjadi Gangguan`}
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-text font-normal tracking-tight mb-3">
          {is404 ? 'Halaman Belum Tersedia' : 'Terjadi Kendala Teknis'}
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-8">
          {is404
            ? 'Halaman atau produk yang kamu tuju mungkin sudah berpindah, belum dirilis, atau alamat URL telah diperbarui.'
            : errorMessage}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <NavLink
            to="/"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
          >
            Ke Beranda
          </NavLink>
          <NavLink
            to="/collections/all"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#FFF3F6] hover:bg-primary/15 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider transition-all"
          >
            Lihat Semua Produk
          </NavLink>
        </div>
      </div>
    </div>
  );
}
