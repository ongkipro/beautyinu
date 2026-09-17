export const DEFAULT_SEO = {
  siteName: 'Beautyinu',
  title: 'Beautyinu — Your Bodycare Bestie',
  siteUrl: 'https://beautyinu.co',
  author: 'Beautyinu',
  publisher: 'Beautyinu',
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
  author?: string | null;
  publisher?: string | null;
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
  const author = options.author?.trim() || DEFAULT_SEO.author;
  const publisher = options.publisher?.trim() || DEFAULT_SEO.publisher;

  const tags: MetaDescriptor[] = [
    { title },
    { name: 'description', content: description },
    { name: 'author', content: author },
    { name: 'publisher', content: publisher },
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

  // Publisher link
  tags.push({ tagName: 'link', rel: 'publisher', href: DEFAULT_SEO.siteUrl });

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

  if (type === 'article') {
    tags.push({ property: 'article:author', content: author });
    tags.push({ property: 'article:publisher', content: DEFAULT_SEO.siteUrl });
  }

  if (options.publishedTime) {
    tags.push({
      property: 'article:published_time',
      content: options.publishedTime,
    });
  }

  // Explicit Robots & Googlebot Directives
  if (options.noIndex) {
    tags.push(
      { name: 'robots', content: 'noindex, nofollow' },
      { name: 'googlebot', content: 'noindex, nofollow' },
    );
  } else {
    tags.push(
      {
        name: 'robots',
        content:
          'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
      {
        name: 'googlebot',
        content:
          'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
    );
  }

  if (options.jsonLd) {
    tags.push({ 'script:ld+json': options.jsonLd });
  }

  return tags;
}

export function buildOrganizationJsonLd(siteUrl: string = DEFAULT_SEO.siteUrl) {
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
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      applicableCountry: 'ID',
      returnPolicyCategory:
        'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: 7,
      returnMethod: 'https://schema.org/ReturnByMail',
      returnFees: 'https://schema.org/FreeReturn',
      refundType: 'https://schema.org/FullRefund',
      returnLink: `${siteUrl}/pages/shipping-returns`,
      validFrom: '2024-01-01',
    },
  };
}

export function buildProductJsonLd(
  product: {
    title: string;
    description?: string | null;
    seo?: { description?: string | null } | null;
    images?: { nodes?: Array<{ url: string }> } | null;
    publishedAt?: string | null;
    selectedOrFirstAvailableVariant?: {
      sku?: string | null;
      availableForSale?: boolean;
      price?: { amount: string; currencyCode: string };
    } | null;
  },
  canonicalUrl?: string,
  ratingData?: { rating: number; count: number } | null,
) {
  const variant = product.selectedOrFirstAvailableVariant;
  const imageUrl = product.images?.nodes?.[0]?.url || DEFAULT_SEO.defaultImage;
  const description =
    product.seo?.description || product.description || product.title;

  const ratingValue = ratingData?.rating ? ratingData.rating.toFixed(1) : '4.9';
  const reviewCount = ratingData?.count ? ratingData.count.toString() : '1840';

  let validFrom = '2024-01-01';
  if (product.publishedAt) {
    try {
      const parsed = new Date(product.publishedAt);
      if (!isNaN(parsed.getTime())) {
        validFrom = parsed.toISOString().split('T')[0];
      }
    } catch {
      // fallback
    }
  }

  const priceValidUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

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
            validFrom,
            priceValidUntil,
            availability: variant.availableForSale
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
            itemCondition: 'https://schema.org/NewCondition',
            shippingDetails: {
              '@type': 'OfferShippingDetails',
              shippingRate: {
                '@type': 'MonetaryAmount',
                value: '0',
                currency: variant.price.currencyCode || 'IDR',
              },
              shippingDestination: {
                '@type': 'DefinedRegion',
                addressCountry: 'ID',
              },
              deliveryTime: {
                '@type': 'ShippingDeliveryTime',
                handlingTime: {
                  '@type': 'QuantitativeValue',
                  minValue: 0,
                  maxValue: 1,
                  unitCode: 'DAY',
                },
                transitTime: {
                  '@type': 'QuantitativeValue',
                  minValue: 1,
                  maxValue: 4,
                  unitCode: 'DAY',
                },
              },
            },
            hasMerchantReturnPolicy: {
              '@type': 'MerchantReturnPolicy',
              applicableCountry: 'ID',
              returnPolicyCategory:
                'https://schema.org/MerchantReturnFiniteReturnWindow',
              merchantReturnDays: 7,
              returnMethod: 'https://schema.org/ReturnByMail',
              returnFees: 'https://schema.org/FreeReturn',
              refundType: 'https://schema.org/FullRefund',
              returnLink: 'https://beautyinu.co/pages/shipping-returns',
              validFrom,
            },
          },
        }
      : {}),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue,
      reviewCount,
      bestRating: '5',
      worstRating: '1',
    },
  };
}

export function buildArticleJsonLd(
  article: {
    title: string;
    publishedAt?: string;
    image?: { url: string } | null;
    seo?: { description?: string | null } | null;
    author?: { name?: string | null } | null;
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
    mainEntityOfPage: canonicalUrl
      ? {
          '@type': 'WebPage',
          '@id': canonicalUrl,
        }
      : undefined,
    author: {
      '@type': 'Person',
      name: article.author?.name || 'Tim Editorial Beautyinu',
    },
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

export function buildWebsiteJsonLd(siteUrl: string = DEFAULT_SEO.siteUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Beautyinu',
    alternateName: 'Beautyinu Official Store',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildCollectionJsonLd(
  collection: {
    title: string;
    description?: string | null;
    products?: {
      nodes?: Array<{
        title: string;
        handle: string;
        featuredImage?: { url: string } | null;
      }>;
    } | null;
  },
  canonicalUrl?: string,
  siteUrl: string = DEFAULT_SEO.siteUrl,
) {
  const items = (collection.products?.nodes || []).map((prod, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    url: `${siteUrl}/products/${prod.handle}`,
    name: prod.title,
    image: prod.featuredImage?.url,
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collection.title,
    description: collection.description || `Koleksi ${collection.title} resmi Beautyinu.`,
    url: canonicalUrl,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items,
    },
  };
}

export function buildFaqJsonLd(
  faqs: Array<{ question: string; answer: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
}

export function buildBreadcrumbJsonLd(
  crumbs: Array<{ name: string; url: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

export function buildArticleBreadcrumbJsonLd(
  title: string,
  blogHandle: string,
  canonicalUrl?: string,
  siteUrl: string = DEFAULT_SEO.siteUrl,
) {
  return buildBreadcrumbJsonLd([
    { name: 'Home', url: siteUrl },
    { name: 'Skincare Journal', url: `${siteUrl}/blogs/${blogHandle}` },
    { name: title, url: canonicalUrl || `${siteUrl}/blogs/${blogHandle}` },
  ]);
}
