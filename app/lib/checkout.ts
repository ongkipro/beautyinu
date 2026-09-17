/**
 * Custom checkout domain utility for Beautyinu.
 * Ensures all checkout URLs route to the branded checkout subdomain (checkout.beautyinu.co)
 * instead of raw myshopify.com or infinite loops on the apex domain.
 */
export const DEFAULT_CHECKOUT_DOMAIN = 'checkout.beautyinu.co';

/**
 * Transforms any Shopify checkout URL to point to the dedicated checkout domain.
 * Example:
 *   https://p1d3wg-6i.myshopify.com/checkouts/cn/c1-xxx?key=yyy
 *   -> https://checkout.beautyinu.co/checkouts/cn/c1-xxx?key=yyy
 */
export function formatCheckoutUrl(
  checkoutUrl?: string | null,
  customCheckoutDomain: string = DEFAULT_CHECKOUT_DOMAIN,
): string {
  if (!checkoutUrl) return '/cart';
  try {
    const url = new URL(checkoutUrl);
    if (customCheckoutDomain) {
      url.hostname = customCheckoutDomain;
      url.protocol = 'https:';
    }
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

/**
 * Deeply transforms cart objects or cart query/mutation results to ensure
 * their checkoutUrl points to the custom checkout domain.
 */
export function transformCartCheckoutUrl<T>(
  result: T,
  customCheckoutDomain: string = DEFAULT_CHECKOUT_DOMAIN,
): T {
  if (!result || typeof result !== 'object') return result;

  const target = result as Record<string, any>;

  if (typeof target.checkoutUrl === 'string') {
    target.checkoutUrl = formatCheckoutUrl(target.checkoutUrl, customCheckoutDomain);
  }

  if (target.cart && typeof target.cart === 'object' && typeof target.cart.checkoutUrl === 'string') {
    target.cart.checkoutUrl = formatCheckoutUrl(target.cart.checkoutUrl, customCheckoutDomain);
  }

  return result;
}
