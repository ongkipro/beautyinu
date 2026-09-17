import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem, type CartLine} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import {ShoppingBag, ArrowRight, ArrowLeft} from 'lucide-react';

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

const CURATED_EMPTY_CART_PICKS = [
  {
    title: 'The Glowing Set (3-in-1 Complete Ritual)',
    handle: 'the-glowing-set',
    price: 'Rp 155.092',
    badge: 'Hemat 39%',
    step: 'Paket Lengkap',
    image: 'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/WebsiteBeautyinu-3.png?v=1784278179',
  },
  {
    title: 'Sabun Kefir Collagen Bar 60gr',
    handle: 'kefir-collagen-soap-60gr',
    price: 'Rp 45.000',
    badge: 'Best Seller',
    step: 'Step 01',
    image: 'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_7.png?v=1781661857',
  },
  {
    title: 'Body Lotion UV Filter 750ml',
    handle: 'body-lotion-uv-750ml',
    price: 'Rp 109.000',
    badge: 'Favorit',
    step: 'Step 03',
    image: 'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_9.png?v=1781661846',
  },
];

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({layout, cart: originalCart}: CartMainProps) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;
  const childrenMap = getLineItemChildrenMap(cart?.lines?.nodes ?? []);

  if (layout === 'aside') {
    return (
      <section className="flex flex-col h-full overflow-hidden bg-white" aria-label="Keranjang Belanja Drawer">
        <CartEmpty hidden={linesCount} layout="aside" />
        {!linesCount ? null : (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Scrollable Line Items */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-black/[0.05] text-[10px] uppercase tracking-widest font-bold text-text-secondary">
                <span>Daftar Produk ({cart?.totalQuantity || 0})</span>
                <span className="text-[10px] uppercase tracking-wider font-bold text-accent bg-accent-light px-2 py-0.5 rounded-full">
                  100% BPOM RI
                </span>
              </div>
              <ul className="divide-y divide-black/[0.04]">
                {(cart?.lines?.nodes ?? []).map((line) => {
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
                      layout="aside"
                      childrenMap={childrenMap}
                    />
                  );
                })}
              </ul>
            </div>

            {/* Sticky Summary & Checkout Footer */}
            {cartHasItems && (
              <div className="mt-auto p-4 sm:p-5 bg-white border-t border-black/[0.06] shadow-[0_-4px_24px_rgba(0,0,0,0.04)] flex-shrink-0">
                <CartSummary cart={cart} layout="aside" />
              </div>
            )}
          </div>
        )}
      </section>
    );
  }

  // Page layout: 2-column desktop / stacked mobile (Summary ALWAYS on the right)
  return (
    <section className="w-full" aria-label="Halaman Keranjang Belanja">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Items List OR Empty State + Recommendations */}
        <div className="lg:col-span-7 space-y-6">
          {linesCount ? (
            <div className="bg-white rounded-2xl border border-black/[0.06] p-4 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-black/[0.04] text-xs font-semibold text-text-secondary">
                <span>Item dalam Keranjang ({cart?.totalQuantity || 0})</span>
                <Link
                  to="/collections/frontpage"
                  className="text-primary hover:underline text-xs font-semibold flex items-center gap-1"
                >
                  <span>Lanjut Belanja</span>
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                </Link>
              </div>
              <ul className="divide-y divide-black/[0.04] mt-2">
                {(cart?.lines?.nodes ?? []).map((line) => {
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
                      layout="page"
                      childrenMap={childrenMap}
                    />
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-black/[0.06] p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left pb-6 border-b border-black/[0.06]">
                <div className="w-16 h-16 rounded-2xl bg-accent-light/50 border border-accent/20 flex items-center justify-center text-accent flex-shrink-0 shadow-2xs">
                  <ShoppingBag className="w-7 h-7" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif text-text mb-1">
                    Keranjang Masih Kosong
                  </h2>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-md">
                    Kamu belum memilih formula ritual perawatan kulit. Pilih produk favoritmu dan dapatkan kulit glowing sehat terawat.
                  </p>
                  <div className="flex flex-wrap gap-2.5 mt-4">
                    <Link
                      to="/collections/all"
                      className="bg-[#111111] hover:bg-primary active:scale-[0.98] text-white rounded-xl py-2 px-4 text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xs hover:shadow-md hover:shadow-primary/25 cursor-pointer"
                    >
                      Lihat Produk Best Seller
                    </Link>
                    <Link
                      to="/collections/bundles"
                      className="bg-white hover:bg-[#FFF3F6] hover:text-primary hover:border-primary/40 text-text border border-black/10 rounded-xl py-2 px-4 text-xs font-bold uppercase tracking-wider transition-all duration-300 active:scale-[0.98] cursor-pointer"
                    >
                      Paket Hemat 3-in-1
                    </Link>
                  </div>
                </div>
              </div>

              {/* Quick Picks Recommendation Shelf */}
              <div className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-text">
                      Rekomendasi Formula Terlaris
                    </h3>
                    <p className="text-xs text-text-secondary">Pilihan favorit ribuan pelanggan Beautyinu</p>
                  </div>
                  <span className="text-[10px] text-accent font-bold uppercase tracking-wider px-2 py-0.5 bg-accent-light rounded-md">
                    100% BPOM RI
                  </span>
                </div>
                <div className="space-y-1">
                  {CURATED_EMPTY_CART_PICKS.map((item) => (
                    <Link
                      key={item.handle}
                      to={`/products/${item.handle}`}
                      className="group flex items-center gap-3.5 py-2.5 px-3 rounded-2xl hover:bg-[#F7F6F9] transition-colors"
                    >
                      <div className="w-14 h-14 rounded-xl bg-[#F7F6F9] group-hover:bg-white p-1.5 flex items-center justify-center flex-shrink-0 transition-colors">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                            {item.badge}
                          </span>
                          <span className="text-[9px] text-text-secondary/70 font-medium">
                            {item.step}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-text line-clamp-1 group-hover:text-primary transition-colors">
                          {item.title}
                        </p>
                        <span className="text-xs sm:text-sm font-bold text-text mt-0.5 block">
                          {item.price}
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary/30 group-hover:text-primary group-hover:bg-primary/5 transition-all flex-shrink-0">
                        <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-text-secondary px-2">
            <Link
              to="/collections/frontpage"
              className="inline-flex items-center gap-1.5 font-semibold text-text hover:text-primary transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Tambah Produk Lainnya</span>
            </Link>
            <span className="hidden sm:inline">Pemesanan aman dengan enkripsi SSL 256-bit</span>
          </div>
        </div>

        {/* Right Column: Sticky Summary */}
        <div className="lg:col-span-5 sticky top-28">
          <div className="bg-[#FAF8FC] rounded-2xl border border-black/[0.06] p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-black/[0.04]">
              <h3 className="font-serif text-xl text-text">Ringkasan Pesanan</h3>
              <span className="text-xs text-text-secondary font-medium">
                {linesCount ? `${cart?.totalQuantity || 0} Produk` : '0 Produk'}
              </span>
            </div>
            <CartSummary cart={cart} layout="page" />
          </div>
        </div>
      </div>
    </section>
  );
}

function CartEmpty({
  hidden = false,
  layout = 'aside',
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const {close} = useAside();
  if (hidden) return null;

  return (
    <div className="flex flex-col items-center justify-center flex-1 h-full p-5 sm:p-6 text-center overflow-y-auto">
      {/* Icon & Heading */}
      <div className="w-14 h-14 rounded-full bg-[#F7F6F9] flex items-center justify-center text-text mx-auto mb-3.5">
        <ShoppingBag className="w-6 h-6" strokeWidth={1.5} />
      </div>

      <h2 className="text-xl sm:text-2xl font-serif text-text mb-1.5 tracking-tight font-normal">
        Keranjangmu Masih Kosong
      </h2>

      <p className="text-xs text-text-secondary/80 max-w-xs mx-auto mb-6 leading-relaxed">
        Belum ada produk ritual yang kamu pilih. Rawat kulit glowing-mu dengan formula teruji resmi BPOM RI.
      </p>

      {/* Dual CTAs */}
      <div className="w-full max-w-xs space-y-2 mb-8">
        <Link 
          to="/collections/all" 
          onClick={layout === 'aside' ? close : undefined} 
          prefetch="intent"
          className="w-full bg-[#111111] hover:bg-primary text-white rounded-full py-3 px-6 text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-primary/25 block text-center cursor-pointer active:scale-98"
        >
          Lihat Produk Best Seller
        </Link>
        <Link 
          to="/collections/bundles" 
          onClick={layout === 'aside' ? close : undefined} 
          prefetch="intent"
          className="w-full bg-transparent hover:bg-[#FFF3F6] hover:text-primary hover:border-primary/40 text-text border border-black/10 rounded-full py-2.5 px-6 text-xs font-semibold uppercase tracking-wider transition-all block text-center cursor-pointer"
        >
          Paket Hemat 3-in-1 (Diskon 39%)
        </Link>
      </div>

      {/* Quick Picks Shelf */}
      <div className="w-full max-w-sm pt-5 border-t border-black/[0.06] text-left">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
            Rekomendasi Formula
          </span>
          <span className="text-[10px] text-accent font-bold uppercase tracking-wider">
            100% BPOM RI
          </span>
        </div>
        <div className="space-y-1">
          {CURATED_EMPTY_CART_PICKS.map((item) => (
            <Link
              key={item.handle}
              to={`/products/${item.handle}`}
              onClick={layout === 'aside' ? close : undefined}
              className="group flex items-center gap-3.5 py-2 px-2 -mx-2 rounded-2xl hover:bg-[#F7F6F9] transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-[#F7F6F9] group-hover:bg-white p-1 flex items-center justify-center flex-shrink-0 transition-colors">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                    {item.badge}
                  </span>
                  <span className="text-[9px] text-text-secondary/70 font-medium">
                    {item.step}
                  </span>
                </div>
                <p className="text-xs font-semibold text-text line-clamp-1 group-hover:text-primary transition-colors">
                  {item.title}
                </p>
                <span className="text-xs font-bold text-text mt-0.5 block">
                  {item.price}
                </span>
              </div>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-text-secondary/30 group-hover:text-primary group-hover:bg-primary/5 transition-all flex-shrink-0">
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
