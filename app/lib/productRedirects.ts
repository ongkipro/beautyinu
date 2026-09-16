import {redirect} from 'react-router';

/**
 * Permanent (301) URL Redirects map from legacy product handles to current clean handles.
 * Ensures backlinks, ads, search engines, and bookmarks are seamlessly routed without 404.
 */
export const PRODUCT_301_REDIRECTS: Record<string, string> = {
  // Active bundles cleaned handles
  'beautyinu-glowing-set-paket-hemat-isi-3-sabun-kefir-collagen-bibit-pemutih-lotion-jumbo':
    'glowing-set-3-in-1',
  'beautyinu-bright-glow-body-lotion-with-uv-filter-750ml-brightening-booster-gold-powder-25gr':
    'body-lotion-booster-set',
  'beautyinu-isi-brightening-booster-gold-powder-brightening-body-cream-200gr':
    'body-cream-booster-set',
  'beautyinu-special-all-product-sabun-booster-body-wash-lotion-dan-body-cream-100gr':
    'complete-brightening-set',
  'paket-lebih-hemat-banget-isi-7-brightening-booster-gold-powder-25gr':
    'booster-gold-powder-7-pack',

  // Legacy single handles mapped to current active clean handles
  'english-pear-freesia-deep-cleansing-body-toner-100ml':
    'english-pear-body-toner-100ml',
  'brightening-body-cream-grape-scent-gr':
    'brightening-body-cream-grape-200g',
  'beautyinu-brightening-body-cream-grape-scent-bleaching-pemutih-badan-100-gram-200-gram':
    'brightening-body-cream-grape-100g',
  'beautyinu-bright-glow-body-lotion-jumbo-with-uv-filter-750ml':
    'bright-glow-body-lotion-uv-filter-750ml-classic',
  'beautyinu-brightening-booster-gold-powder-serbuk-pemutih-badan-wajah-25-gram':
    'brightening-booster-gold-powder-25gr-classic',
};

/**
 * Checks if the requested product handle is a legacy handle and throws an HTTP 301 redirect.
 * Preserves query parameters (e.g. ?variant=..., ?utm_source=...).
 */
export function checkLegacyProductRedirect(request: Request, handle: string): void {
  const targetHandle = PRODUCT_301_REDIRECTS[handle];
  if (targetHandle) {
    const url = new URL(request.url);
    url.pathname = `/products/${targetHandle}`;
    throw redirect(url.toString(), 301);
  }
}
