import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/policies._index';
import type {PoliciesQuery, PolicyItemFragment} from 'storefrontapi.generated';
import {getSeoMeta, buildBreadcrumbJsonLd} from '~/lib/seo';
import {Breadcrumb} from '~/components/Breadcrumb';
import {ChevronRight, ShieldCheck, FileText, Truck, HelpCircle} from 'lucide-react';

export const meta: Route.MetaFunction = ({data}) => {
  const canonicalUrl = data?.canonicalUrl || 'https://beautyinu.co/policies';
  return getSeoMeta({
    title: 'Kebijakan & Ketentuan Layanan — Beautyinu Official Store',
    description:
      'Pusat informasi kebijakan resmi Beautyinu: Kebijakan Privasi, Syarat & Ketentuan, Panduan Pengiriman, dan Garansi Retur Produk.',
    url: canonicalUrl,
    type: 'website',
    jsonLd: [
      buildBreadcrumbJsonLd([
        {name: 'Home', url: 'https://beautyinu.co'},
        {name: 'Kebijakan Toko', url: canonicalUrl},
      ]),
    ],
  });
};

export async function loader({context, request}: Route.LoaderArgs) {
  const data: PoliciesQuery = await context.storefront.query(POLICIES_QUERY);

  const shopPolicies = data.shop;
  const policies: PolicyItemFragment[] = [
    shopPolicies?.privacyPolicy,
    shopPolicies?.shippingPolicy,
    shopPolicies?.termsOfService,
    shopPolicies?.refundPolicy,
    shopPolicies?.subscriptionPolicy,
  ].filter((policy): policy is PolicyItemFragment => policy != null);

  return {
    policies,
    canonicalUrl: `${new URL(request.url).origin}/policies`,
  };
}

export default function Policies() {
  const {policies} = useLoaderData<typeof loader>();

  const standardPolicies = [
    {
      title: 'Kebijakan Privasi (Privacy Policy)',
      description: 'Perlindungan data pribadi dan informasi transaksi pelanggan.',
      to: '/pages/privacy-policy',
      icon: ShieldCheck,
    },
    {
      title: 'Syarat & Ketentuan (Terms of Service)',
      description: 'Aturan pemesanan, pembayaran, dan ketentuan berbelanja di Beautyinu.',
      to: '/pages/terms-of-service',
      icon: FileText,
    },
    {
      title: 'Pengiriman & Garansi Retur (Shipping & Returns)',
      description: 'Estimasi waktu ekspedisi, ongkir, serta prosedur klaim retur produk.',
      to: '/pages/shipping-returns',
      icon: Truck,
    },
    {
      title: 'Tanya Jawab (FAQ & Panduan Produk)',
      description: 'Pertanyaan seputar legalitas BPOM, cara pemakaian, dan bahan aktif.',
      to: '/pages/faq',
      icon: HelpCircle,
    },
  ];

  return (
    <div className="w-full bg-white">
      {/* 1. Standardized Breadcrumbs Wayfinding Bar */}
      <Breadcrumb
        variant="bar"
        items={[{label: 'Kebijakan Toko'}]}
      />

      <div className="bg-[#F3EEFA] py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center flex flex-col items-center">
          <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] mb-4">
            Kebijakan Toko
          </h1>
          <p className="max-w-2xl text-[#6B7280]">
            Transparansi dan keamanan Anda adalah prioritas kami. Pelajari seluruh kebijakan resmi dan syarat ketentuan berbelanja di Beautyinu.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12 md:py-16">
        <div className="grid gap-4 sm:gap-6">
          {standardPolicies.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="group flex items-start gap-4 p-6 rounded-2xl bg-[#FAF8FC] hover:bg-[#F3EEFA] transition-all border border-black/[0.03]"
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#AF8FD1] group-hover:text-primary transition-colors flex-shrink-0 shadow-sm">
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-serif text-xl text-[#1A1A1A] group-hover:text-primary transition-colors mb-1">
                    {item.title}
                  </h2>
                  <p className="text-sm text-[#6B7280]">
                    {item.description}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#6B7280] group-hover:text-primary transition-colors mt-1 flex-shrink-0" />
              </Link>
            );
          })}
        </div>

        {policies.length > 0 && (
          <div className="mt-12 pt-8 border-t border-black/[0.06]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-4">
              Legal Shop Policies
            </h3>
            <div className="flex flex-wrap gap-3">
              {policies.map((policy) => (
                <Link
                  key={policy.id}
                  to={`/policies/${policy.handle}`}
                  className="text-xs text-text hover:text-primary underline"
                >
                  {policy.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const POLICIES_QUERY = `#graphql
  fragment PolicyItem on ShopPolicy {
    id
    title
    handle
  }
  query Policies ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    shop {
      privacyPolicy {
        ...PolicyItem
      }
      shippingPolicy {
        ...PolicyItem
      }
      termsOfService {
        ...PolicyItem
      }
      refundPolicy {
        ...PolicyItem
      }
      subscriptionPolicy {
        id
        title
        handle
      }
    }
  }
` as const;
