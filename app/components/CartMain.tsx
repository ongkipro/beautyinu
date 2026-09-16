import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem, type CartLine} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

export type LineItemChildrenMap = {[parentId: string]: CartLine[]};
/** Returns a map of all line items and their children. */
function getLineItemChildrenMap(lines: CartLine[]): LineItemChildrenMap {
  const children: LineItemChildrenMap = {};
  for (const line of lines) {
    if ('parentRelationship' in line && line.parentRelationship?.parent) {
      const parentId = line.parentRelationship.parent.id;
      if (!children[parentId]) children[parentId] = [];
      children[parentId].push(line);
    }
    if ('lineComponents' in line) {
      const lineChildren = getLineItemChildrenMap(line.lineComponents);
      for (const [parentId, childIds] of Object.entries(lineChildren)) {
        if (!children[parentId]) children[parentId] = [];
        children[parentId].push(...childIds);
      }
    }
  }
  return children;
}
/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({layout, cart: originalCart}: CartMainProps) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `flex flex-col h-full ${layout === 'page' ? 'pb-12 max-w-4xl mx-auto w-full' : ''}`;
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;
  const childrenMap = getLineItemChildrenMap(cart?.lines?.nodes ?? []);

  return (
    <section
      className={className}
      aria-label={layout === 'page' ? 'Cart page' : 'Cart drawer'}
    >
      <CartEmpty hidden={linesCount} layout={layout} />
      {!linesCount ? null : (
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <p id="cart-lines" className="sr-only">
              Line items
            </p>
            <ul aria-labelledby="cart-lines" className="space-y-6">
              {(cart?.lines?.nodes ?? []).map((line) => {
                // we do not render non-parent lines at the root of the cart
                if (
                  'parentRelationship' in line &&
                  line.parentRelationship?.parent
                ) {
                  return null;
                }
                return (
                  <CartLineItem
                    key={line.id}
                    line={line}
                    layout={layout}
                    childrenMap={childrenMap}
                  />
                );
              })}
            </ul>
          </div>
          {cartHasItems && (
            <div className="mt-auto p-4 sm:p-6 bg-surface rounded-t-2xl">
              <CartSummary cart={cart} layout={layout} />
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function CartEmpty({
  hidden = false,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const {close} = useAside();
  if (hidden) return null;
  return (
    <div className="flex flex-col items-center justify-center flex-1 h-full space-y-6 p-6 text-center mt-12">
      <h2 className="text-3xl font-serif text-text">Your cart is empty</h2>
      <Link 
        to="/collections/body-care" 
        onClick={close} 
        prefetch="viewport"
        className="w-full max-w-xs bg-primary text-white rounded-full py-3 font-semibold hover:bg-primary-hover transition text-center"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
