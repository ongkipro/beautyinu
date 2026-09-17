import {Link, redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/policies.$handle';
import {type Shop} from '@shopify/hydrogen/storefront-api-types';
import {getSeoMeta, buildBreadcrumbJsonLd} from '~/lib/seo';
import {Breadcrumb} from '~/components/Breadcrumb';

type SelectedPolicies = keyof Pick<
  Shop,
  'privacyPolicy' | 'shippingPolicy' | 'termsOfService' | 'refundPolicy'
>;

export const meta: Route.MetaFunction = ({data}) => {
  if (!data?.policy) {
    return getSeoMeta({title: 'Policy Not Found — Beautyinu'});
  }
  const {policy, canonicalUrl} = data;
  const title = `${policy.title} — Beautyinu Official Store`;
  const description =
    policy.body?.replace(/<[^>]+>/g, '').trim().slice(0, 160) ||
    `Kebijakan ${policy.title} resmi Beautyinu Official Store.`;

  const pageUrl = canonicalUrl || 'https://beautyinu.co/policies';
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    {name: 'Home', url: 'https://beautyinu.co'},
    {name: 'Policies', url: 'https://beautyinu.co/policies'},
    {name: policy.title, url: pageUrl},
  ]);

  return getSeoMeta({
    title,
    description,
    url: canonicalUrl,
    type: 'website',
    jsonLd: [breadcrumbSchema],
  });
};

export async function loader({params, context, request}: Route.LoaderArgs) {
  if (!params.handle) {
    throw new Response('No handle was passed in', {status: 404});
  }

  // Handle known redirects to corresponding store pages
  if (params.handle === 'shipping-policy' || params.handle === 'refund-policy') {
    return redirect('/pages/shipping-returns', 301);
  }

  const policyName = params.handle.replace(
    /-([a-z])/g,
    (_: unknown, m1: string) => m1.toUpperCase(),
  ) as SelectedPolicies;

  const validPolicyNames = ['privacyPolicy', 'shippingPolicy', 'termsOfService', 'refundPolicy'];
  if (validPolicyNames.includes(policyName)) {
    const data = await context.storefront.query(POLICY_CONTENT_QUERY, {
      variables: {
        privacyPolicy: false,
        shippingPolicy: false,
        termsOfService: false,
        refundPolicy: false,
        [policyName]: true,
        language: context.storefront.i18n?.language,
      },
    });

    const policy = data.shop?.[policyName];
    if (policy) {
      return {
        policy,
        canonicalUrl: `${new URL(request.url).origin}/policies/${params.handle}`,
      };
    }
  }

  // Fallback: check if there's an equivalent shop page (e.g. /pages/terms-of-service)
  if (params.handle === 'terms-of-service') {
    return redirect('/pages/terms-of-service', 301);
  }
  if (params.handle === 'privacy-policy') {
    return redirect('/pages/privacy-policy', 301);
  }

  throw new Response('Could not find the policy', {status: 404});
}

export default function Policy() {
  const {policy} = useLoaderData<typeof loader>();

  return (
    <div className="w-full bg-white">
      {/* 1. Standardized Breadcrumbs Wayfinding Bar */}
      <Breadcrumb
        variant="bar"
        items={[
          {label: 'Policies', to: '/policies'},
          {label: policy.title},
        ]}
      />

      {/* 2. Main Policy Content */}
      <div className="mx-auto max-w-4xl px-4 lg:px-8 py-10 md:py-16">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-text mb-8">
          {policy.title}
        </h1>

      <div
        dangerouslySetInnerHTML={{__html: policy.body}}
        className="
          [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:mt-12 [&_h2]:mb-5 [&_h2]:text-text
          [&_hr]:hidden
          [&_h3]:font-semibold [&_h3]:text-base [&_h3]:md:text-lg [&_h3]:mt-7 [&_h3]:mb-2.5 [&_h3]:text-text
          [&_p]:leading-relaxed [&_p]:mb-4 [&_p]:text-text [&_p]:text-sm [&_p]:sm:text-base
          [&_a]:text-primary [&_a]:underline hover:[&_a]:text-primary-hover
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:text-sm [&_ul]:sm:text-base
          [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:text-sm [&_ol]:sm:text-base
          [&_li]:mb-2 [&_li]:leading-relaxed
          [&_strong]:font-semibold
          [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6 [&_blockquote]:bg-[#FAF7FD] [&_blockquote]:py-3 [&_blockquote]:rounded-r-lg
          [&_table]:w-full [&_table]:border-collapse [&_table]:my-8 [&_table]:rounded-xl [&_table]:overflow-hidden [&_table]:border [&_table]:border-black/[0.06]
          [&_thead]:bg-[#FAF7FD]
          [&_th]:text-left [&_th]:p-3.5 [&_th]:border-b [&_th]:border-black/[0.06] [&_th]:font-semibold [&_th]:text-xs [&_th]:uppercase [&_th]:tracking-wider
          [&_td]:p-3.5 [&_td]:border-b [&_td]:border-black/[0.04] [&_td]:text-sm sm:[&_td]:text-base
        "
      />
      </div>
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/Shop
const POLICY_CONTENT_QUERY = `#graphql
  fragment Policy on ShopPolicy {
    body
    handle
    id
    title
    url
  }
  query Policy(
    $country: CountryCode
    $language: LanguageCode
    $privacyPolicy: Boolean!
    $refundPolicy: Boolean!
    $shippingPolicy: Boolean!
    $termsOfService: Boolean!
  ) @inContext(language: $language, country: $country) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) {
        ...Policy
      }
      shippingPolicy @include(if: $shippingPolicy) {
        ...Policy
      }
      termsOfService @include(if: $termsOfService) {
        ...Policy
      }
      refundPolicy @include(if: $refundPolicy) {
        ...Policy
      }
    }
  }
` as const;
