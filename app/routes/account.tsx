import {
  data as remixData,
  redirect,
  Form,
  NavLink,
  Outlet,
  useLoaderData,
} from 'react-router';
import type {Route} from './+types/account';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
import {getSeoMeta} from '~/lib/seo';

export const meta: Route.MetaFunction = () => {
  return getSeoMeta({
    title: 'My Account — Beautyinu',
    noIndex: true,
  });
};

export function shouldRevalidate() {
  return true;
}

export async function loader({context}: Route.LoaderArgs) {
  if (!context.env.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID) {
    const customerAccountUrl =
      context.env.PUBLIC_CUSTOMER_ACCOUNT_API_URL || 'https://account.beautyinu.co';
    return redirect(customerAccountUrl);
  }

  const {customerAccount} = context;
  const {data, errors} = await customerAccount.query(CUSTOMER_DETAILS_QUERY, {
    variables: {
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  return remixData(
    {customer: data.customer},
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  );
}

export default function AccountLayout() {
  const {customer} = useLoaderData<typeof loader>();

  const heading = customer
    ? customer.firstName
      ? `Selamat Datang, ${customer.firstName}`
      : `Akun Saya`
    : 'Rincian Akun';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 md:px-8">
      {/* Header Account */}
      <div className="mb-8 border-b border-black/[0.06] pb-6">
        <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.25em] text-black/50 block mb-2">
          Akun Pengguna · Beautyinu
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-text font-normal tracking-tight">
          {heading}
        </h1>
        <div className="mt-6">
          <AccountMenu />
        </div>
      </div>

      <div className="pt-2">
        <Outlet context={{customer}} />
      </div>
    </div>
  );
}

function AccountMenu() {
  const baseTabClasses =
    'px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer inline-flex items-center gap-1.5';

  return (
    <nav role="navigation" className="flex items-center gap-2 flex-wrap">
      <NavLink
        to="/account/orders"
        className={({isActive}) =>
          `${baseTabClasses} ${
            isActive
              ? 'bg-[#111111] text-white shadow-2xs font-semibold'
              : 'bg-[#FAF9FB] hover:bg-[#F3EEFA] text-black/70 hover:text-primary border border-black/[0.05]'
          }`
        }
      >
        Pesanan Saya
      </NavLink>
      <NavLink
        to="/account/profile"
        className={({isActive}) =>
          `${baseTabClasses} ${
            isActive
              ? 'bg-[#111111] text-white shadow-2xs font-semibold'
              : 'bg-[#FAF9FB] hover:bg-[#F3EEFA] text-black/70 hover:text-primary border border-black/[0.05]'
          }`
        }
      >
        Profil
      </NavLink>
      <NavLink
        to="/account/addresses"
        className={({isActive}) =>
          `${baseTabClasses} ${
            isActive
              ? 'bg-[#111111] text-white shadow-2xs font-semibold'
              : 'bg-[#FAF9FB] hover:bg-[#F3EEFA] text-black/70 hover:text-primary border border-black/[0.05]'
          }`
        }
      >
        Buku Alamat
      </NavLink>
      <Logout />
    </nav>
  );
}

function Logout() {
  return (
    <Form className="inline-block ml-auto sm:ml-2" method="POST" action="/account/logout">
      <button
        type="submit"
        className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-black/50 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
      >
        Keluar
      </button>
    </Form>
  );
}
