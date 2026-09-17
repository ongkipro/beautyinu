import type {Route} from './+types/[sitemap.xml]';

const SITEMAP_QUERY = `#graphql
  query SitemapAllResources {
    products: sitemap(type: PRODUCT) {
      resources(page: 1) {
        items {
          handle
          updatedAt
        }
      }
    }
    collections: sitemap(type: COLLECTION) {
      resources(page: 1) {
        items {
          handle
          updatedAt
        }
      }
    }
    articles: sitemap(type: ARTICLE) {
      resources(page: 1) {
        items {
          handle
          updatedAt
        }
      }
    }
    pages: sitemap(type: PAGE) {
      resources(page: 1) {
        items {
          handle
          updatedAt
        }
      }
    }
    blogs: sitemap(type: BLOG) {
      resources(page: 1) {
        items {
          handle
          updatedAt
        }
      }
    }
  }
` as const;

interface SitemapItem {
  handle: string;
  updatedAt?: string;
}

interface SitemapResponse {
  products?: {resources?: {items?: SitemapItem[]}};
  collections?: {resources?: {items?: SitemapItem[]}};
  articles?: {resources?: {items?: SitemapItem[]}};
  pages?: {resources?: {items?: SitemapItem[]}};
  blogs?: {resources?: {items?: SitemapItem[]}};
}

export async function loader({
  request,
  context: {storefront},
}: Route.LoaderArgs) {
  const url = new URL(request.url);
  const host = request.headers.get('x-forwarded-host') || url.host;
  const baseUrl = host.includes('localhost')
    ? `${url.protocol}//${host}`
    : 'https://beautyinu.co';

  let data: SitemapResponse | null = null;
  try {
    data = await storefront.query<SitemapResponse>(SITEMAP_QUERY);
  } catch (err) {
    console.error('[sitemap.xml] Error querying storefront:', err);
  }

  const urls: Array<{
    loc: string;
    lastmod?: string;
    changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority: string;
  }> = [];

  const formatIso = (dateStr?: string) => {
    if (!dateStr) return undefined;
    try {
      return new Date(dateStr).toISOString().replace(/\.\d{3}Z$/, 'Z');
    } catch {
      return dateStr;
    }
  };

  const now = formatIso(new Date().toISOString());

  // 1. Core / Static Pages
  urls.push({
    loc: `${baseUrl}/`,
    lastmod: now,
    changefreq: 'daily',
    priority: '1.0',
  });

  urls.push({
    loc: `${baseUrl}/collections/all`,
    lastmod: now,
    changefreq: 'daily',
    priority: '0.9',
  });

  // 2. Products
  const products = data?.products?.resources?.items || [];
  for (const product of products) {
    urls.push({
      loc: `${baseUrl}/products/${product.handle}`,
      lastmod: formatIso(product.updatedAt) || now,
      changefreq: 'daily',
      priority: '0.8',
    });
  }

  // 3. Collections
  const collections = data?.collections?.resources?.items || [];
  for (const collection of collections) {
    if (collection.handle === 'frontpage') continue; // Skip default frontpage collection if redundant
    urls.push({
      loc: `${baseUrl}/collections/${collection.handle}`,
      lastmod: formatIso(collection.updatedAt) || now,
      changefreq: 'weekly',
      priority: '0.8',
    });
  }

  // 4. Articles
  const articles = data?.articles?.resources?.items || [];
  for (const article of articles) {
    urls.push({
      loc: `${baseUrl}/blogs/news/${article.handle}`,
      lastmod: formatIso(article.updatedAt) || now,
      changefreq: 'weekly',
      priority: '0.7',
    });
  }

  // 5. Blogs
  const blogs = data?.blogs?.resources?.items || [];
  for (const blog of blogs) {
    urls.push({
      loc: `${baseUrl}/blogs/${blog.handle}`,
      lastmod: formatIso(blog.updatedAt) || now,
      changefreq: 'weekly',
      priority: '0.7',
    });
  }

  // 6. Pages
  const pages = data?.pages?.resources?.items || [];
  for (const page of pages) {
    urls.push({
      loc: `${baseUrl}/pages/${page.handle}`,
      lastmod: formatIso(page.updatedAt) || now,
      changefreq: 'monthly',
      priority: '0.6',
    });
  }

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map(
    (item) => `  <url>
    <loc>${item.loc}</loc>
    ${item.lastmod ? `<lastmod>${item.lastmod}</lastmod>` : ''}
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;

  return new Response(xmlContent, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': `max-age=${60 * 60 * 24}`,
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

