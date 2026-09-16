export const DEFAULT_SEO = {
  siteName: 'Beautyinu',
  title: 'Beautyinu — Your Bodycare Bestie',
  description:
    'Brightening bodycare resmi BPOM RI dengan formula Niacinamide 5.22%, Alpha Arbutin 2.30% & Kefir Collagen untuk kulit tampak cerah merata, lembap, dan glowing sehat.',
  defaultImage:
    'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_10.png?v=1781661867',
  locale: 'id_ID',
} as const;

export interface SeoMetaOptions {
  title?: string | null;
  description?: string | null;
  url?: string | null;
  image?: string | null;
  imageAlt?: string | null;
  type?: 'website' | 'product' | 'article';
  publishedTime?: string | null;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>> | null;
  noIndex?: boolean;
}

export type MetaDescriptor =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string }
  | { tagName: 'link'; rel: string; href: string }
  | { 'script:ld+json': Record<string, unknown> | Array<Record<string, unknown>> };

export function getSeoMeta(options: SeoMetaOptions = {}): MetaDescriptor[] {
  const title = options.title?.trim() || DEFAULT_SEO.title;
  const description = options.description?.trim() || DEFAULT_SEO.description;
  const image = options.image?.trim() || DEFAULT_SEO.defaultImage;
  const imageAlt = options.imageAlt?.trim() || title;
  const type = options.type || 'website';

  const tags: MetaDescriptor[] = [
    { title },
    { name: 'description', content: description },
    { property: 'og:site_name', content: DEFAULT_SEO.siteName },
    { property: 'og:type', content: type },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:locale', content: DEFAULT_SEO.locale },
  ];

  if (options.url) {
    tags.push({ property: 'og:url', content: options.url });
    tags.push({ tagName: 'link', rel: 'canonical', href: options.url });
  }

  if (image) {
    tags.push({ property: 'og:image', content: image });
    tags.push({ property: 'og:image:alt', content: imageAlt });
  }

  tags.push(
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
  );

  if (image) {
    tags.push({ name: 'twitter:image', content: image });
    tags.push({ name: 'twitter:image:alt', content: imageAlt });
  }

  if (options.publishedTime) {
    tags.push({
      property: 'article:published_time',
      content: options.publishedTime,
    });
  }

  if (options.noIndex) {
    tags.push({ name: 'robots', content: 'noindex, nofollow' });
  }

  if (options.jsonLd) {
    tags.push({ 'script:ld+json': options.jsonLd });
  }

  return tags;
}

export function buildOrganizationJsonLd(siteUrl: string = 'https://beautyinu.id') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Beautyinu',
    legalName: 'CV. DINARE ANUGRAH KOSMETIKA',
    url: siteUrl,
    logo: DEFAULT_SEO.defaultImage,
    sameAs: [
      'https://instagram.com/beautyinu.id',
      'https://tiktok.com/@beautyinu.official',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+62-877-7711-8186',
      contactType: 'customer service',
      availableLanguage: ['Indonesian', 'English'],
    },
  };
}

export function buildProductJsonLd(
  product: {
    title: string;
    description?: string | null;
    seo?: { description?: string | null } | null;
    images?: { nodes?: Array<{ url: string }> } | null;
    selectedOrFirstAvailableVariant?: {
      sku?: string | null;
      availableForSale?: boolean;
      price?: { amount: string; currencyCode: string };
    } | null;
  },
  canonicalUrl?: string,
) {
  const variant = product.selectedOrFirstAvailableVariant;
  const imageUrl = product.images?.nodes?.[0]?.url || DEFAULT_SEO.defaultImage;
  const description =
    product.seo?.description || product.description || product.title;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description,
    image: imageUrl,
    brand: {
      '@type': 'Brand',
      name: 'Beautyinu',
    },
    ...(variant?.sku ? { sku: variant.sku } : {}),
    ...(variant?.price
      ? {
          offers: {
            '@type': 'Offer',
            url: canonicalUrl,
            priceCurrency: variant.price.currencyCode,
            price: variant.price.amount,
            availability: variant.availableForSale
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
            itemCondition: 'https://schema.org/NewCondition',
          },
        }
      : {}),
  };
}

export function buildArticleJsonLd(
  article: {
    title: string;
    publishedAt?: string;
    image?: { url: string } | null;
    seo?: { description?: string | null } | null;
  },
  canonicalUrl?: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.seo?.description || article.title,
    image: article.image?.url || DEFAULT_SEO.defaultImage,
    datePublished: article.publishedAt,
    url: canonicalUrl,
    publisher: {
      '@type': 'Organization',
      name: 'Beautyinu',
      logo: {
        '@type': 'ImageObject',
        url: DEFAULT_SEO.defaultImage,
      },
    },
  };
}
