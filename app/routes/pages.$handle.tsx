import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/pages.$handle';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {getSeoMeta} from '~/lib/seo';
import {ChevronRight} from 'lucide-react';

export const meta: Route.MetaFunction = ({data}) => {
  if (!data?.page) {
    return getSeoMeta({title: 'Page Not Found — Beautyinu'});
  }
  const {page, canonicalUrl} = data;
  const title = page.seo?.title || `${page.title} — Beautyinu`;
  const description =
    page.seo?.description ||
    page.body?.replace(/<[^>]+>/g, '').trim().slice(0, 160) ||
    `${page.title} — Beautyinu Official Store.`;

  return getSeoMeta({
    title,
    description,
    url: canonicalUrl,
    type: 'website',
  });
};

export async function loader(args: Route.LoaderArgs) {
  const criticalData = await loadCriticalData(args);
  return criticalData;
}

async function loadCriticalData({context, request, params}: Route.LoaderArgs) {
  if (!params.handle) {
    throw new Response('Not found', {status: 404});
  }

  const [{page}] = await Promise.all([
    context.storefront.query(PAGE_QUERY, {
      variables: {handle: params.handle},
    }),
  ]);

  if (!page) {
    throw new Response('Not found', {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle: params.handle, data: page});
  return {
    page,
    canonicalUrl: `${new URL(request.url).origin}/pages/${page.handle}`,
  };
}

export default function Page() {
  const {page} = useLoaderData<typeof loader>();

  return (
    <div className="mx-auto max-w-4xl px-4 lg:px-8 py-10 md:py-16">
      {/* Breadcrumb navigation */}
      <nav className="text-xs sm:text-sm text-text-secondary mb-8 flex items-center gap-1.5">
        <Link to="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="text-text font-medium truncate">{page.title}</span>
      </nav>

      <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-text mb-8">
        {page.title}
      </h1>

      <div
        dangerouslySetInnerHTML={{__html: page.body}}
        className="
          [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:mt-12 [&_h2]:mb-5 [&_h2]:text-text
          [&_hr]:hidden
          [&_h3]:font-semibold [&_h3]:text-base [&_h3]:md:text-lg [&_h3]:mt-7 [&_h3]:mb-2.5 [&_h3]:text-text
          [&_p]:leading-relaxed [&_p]:mb-4 [&_p]:text-text
          [&_a]:text-primary [&_a]:underline hover:[&_a]:text-primary-hover
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6
          [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6
          [&_li]:mb-2 [&_li]:leading-relaxed
          [&_strong]:font-semibold
          [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6 [&_blockquote]:bg-[#FAF7FD] [&_blockquote]:py-3 [&_blockquote]:rounded-r-lg
          [&_table]:w-full [&_table]:border-collapse [&_table]:my-8 [&_table]:rounded-xl [&_table]:overflow-hidden [&_table]:border [&_table]:border-black/[0.06]
          [&_thead]:bg-[#FAF7FD]
          [&_th]:text-left [&_th]:p-3.5 [&_th]:border-b [&_th]:border-black/[0.06] [&_th]:font-semibold [&_th]:text-xs [&_th]:uppercase [&_th]:tracking-wider
          [&_td]:p-3.5 [&_td]:border-b [&_td]:border-black/[0.04] [&_td]:text-sm
        "
      />
    </div>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  ) @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      id
      title
      body
      handle
      seo {
        description
        title
      }
    }
  }
` as const;
