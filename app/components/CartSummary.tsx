import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {useEffect, useId, useRef, useState} from 'react';
import {useFetcher, Link} from 'react-router';
import {
  ArrowRight,
  Truck,
  CheckCircle2,
  ShieldCheck,
  Package,
  Tag,
} from 'lucide-react';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const summaryId = useId();
  const discountsHeadingId = useId();
  const discountCodeInputId = useId();
  const giftCardHeadingId = useId();
  const giftCardInputId = useId();

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);

  // Free shipping logic (Rp 150.000 threshold)
  const FREE_SHIPPING_THRESHOLD = 150000;
  const rawSubtotal = cart?.cost?.subtotalAmount?.amount
    ? parseFloat(cart.cost.subtotalAmount.amount)
    : cart?.lines?.nodes?.reduce((acc, line) => {
        const itemPrice = line?.cost?.totalAmount?.amount
          ? parseFloat(line.cost.totalAmount.amount)
          : (line?.merchandise?.price?.amount
              ? parseFloat(line.merchandise.price.amount)
              : ((line as any)?.selectedVariant?.price?.amount
                  ? parseFloat((line as any).selectedVariant.price.amount)
                  : 0)) * (line.quantity || 1);
        return acc + itemPrice;
      }, 0) || 0;

  const subtotal = rawSubtotal;
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const isUnlocked = progress >= 100;

  return (
    <div aria-labelledby={summaryId} className="flex flex-col gap-3.5">
      <h4 id={summaryId} className="sr-only">Rincian Keranjang</h4>
      
      {/* Free Shipping Progress Indicator */}
      <div className="rounded-2xl bg-[#F7F6F9] p-3.5">
        <div className="flex items-center justify-between text-xs font-semibold text-text mb-2">
          <div className="flex items-center gap-1.5">
            {isUnlocked ? (
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={1.5} />
            ) : (
              <Truck className="w-4 h-4 text-accent flex-shrink-0" strokeWidth={1.5} />
            )}
            <span>
              {isUnlocked ? (
                <strong className="text-primary">Gratis Ongkir Aktif!</strong>
              ) : (
                <>Tambah <span className="font-bold text-primary">Rp {remaining.toLocaleString('id-ID')}</span> lagi untuk Gratis Ongkir</>
              )}
            </span>
          </div>
          <span className="text-[10px] font-mono text-text-secondary font-bold">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-black/[0.06] rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div className="space-y-1.5 text-xs text-text-secondary pt-0.5">
        <div className="flex justify-between items-center text-sm font-semibold text-text">
          <span>Subtotal</span>
          <span className="font-bold">
            {cart?.cost?.subtotalAmount?.amount ? (
              <Money data={cart?.cost?.subtotalAmount} withoutTrailingZeros />
            ) : (
              `Rp ${subtotal.toLocaleString('id-ID')}`
            )}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>Estimasi Ongkir</span>
          <span className="text-text font-medium">
            {isUnlocked ? (
              <span className="text-primary font-bold">GRATIS</span>
            ) : (
              'Dihitung di checkout'
            )}
          </span>
        </div>
      </div>

      {/* Promo / Discount Voucher */}
      <div className="pt-1">
        <CartDiscounts
          discountCodes={cart?.discountCodes}
          discountsHeadingId={discountsHeadingId}
          discountCodeInputId={discountCodeInputId}
        />
        <CartGiftCard
          giftCardCodes={cart?.appliedGiftCards}
          giftCardHeadingId={giftCardHeadingId}
          giftCardInputId={giftCardInputId}
        />
      </div>

      {/* Primary Checkout CTA Button */}
      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} isEmpty={!linesCount} />

      {/* Trust & Guarantee Badges */}
      <div className="pt-3 border-t border-black/[0.04] grid grid-cols-3 gap-2 text-center text-text-secondary">
        <div className="flex flex-col items-center gap-0.5">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
          <span className="text-[10px] font-medium leading-tight">100% BPOM</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <Package className="w-3.5 h-3.5 text-accent" strokeWidth={1.5} />
          <span className="text-[10px] font-medium leading-tight">Garansi Pecah</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <Truck className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
          <span className="text-[10px] font-medium leading-tight">Kirim Cepat</span>
        </div>
      </div>
    </div>
  );
}

function CartCheckoutActions({
  checkoutUrl,
  isEmpty = false,
}: {
  checkoutUrl?: string;
  isEmpty?: boolean;
}) {
  if (isEmpty) {
    return (
      <div>
        <Link
          to="/collections/all"
          className="inline-flex justify-center items-center gap-2 w-full bg-[#111111] hover:bg-primary text-white text-center rounded-full py-3.5 px-6 text-xs sm:text-sm font-bold uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-primary/25 active:scale-98 cursor-pointer"
        >
          <span>Mulai Belanja Sekarang</span>
          <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
        </Link>
      </div>
    );
  }

  return (
    <div>
      <a
        href={checkoutUrl || '/cart'}
        target="_self"
        className="inline-flex justify-center items-center gap-2 w-full bg-[#111111] hover:bg-primary text-white text-center rounded-full py-3.5 px-6 text-xs sm:text-sm font-bold uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-primary/25 active:scale-98 cursor-pointer"
      >
        <span>Lanjut ke Pembayaran</span>
        <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
      </a>
    </div>
  );
}

function CartDiscounts({
  discountCodes,
  discountsHeadingId,
  discountCodeInputId,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
  discountsHeadingId: string;
  discountCodeInputId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <section aria-label="Discounts" className="flex flex-col gap-2">
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt id={discountsHeadingId} className="sr-only">Discounts</dt>
          <UpdateDiscountForm>
            <div
              className="flex justify-between items-center bg-[#FAF8FC] px-3.5 py-2.5 rounded-xl border border-black/[0.04]"
              role="group"
              aria-labelledby={discountsHeadingId}
            >
              <div className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
                <code className="text-xs font-semibold text-text">{codes?.join(', ')}</code>
              </div>
              <button type="submit" aria-label="Hapus diskon" className="text-xs font-semibold text-text-secondary hover:text-rose-600 transition-colors cursor-pointer active:scale-95">
                Hapus
              </button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Collapsible voucher input */}
      {!codes.length && (
        <div>
          {!isOpen ? (
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="text-xs font-semibold text-primary hover:text-primary-hover hover:underline flex items-center gap-1 cursor-pointer py-1 transition-colors"
            >
              <Tag className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Punya kode voucher / promo?</span>
            </button>
          ) : (
            <UpdateDiscountForm discountCodes={codes}>
              <div className="flex gap-2">
                <label htmlFor={discountCodeInputId} className="sr-only">
                  Kode voucher
                </label>
                <input
                  id={discountCodeInputId}
                  type="text"
                  name="discountCode"
                  placeholder="Kode voucher promo..."
                  className="flex-1 bg-[#FAF8FC] border border-black/10 rounded-xl px-3.5 py-2 text-base sm:text-xs text-text placeholder:text-text-secondary/60 focus:outline-none focus:border-primary"
                />
                <button type="submit" aria-label="Terapkan voucher" className="bg-[#111111] hover:bg-primary active:scale-[0.98] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xs hover:shadow-md hover:shadow-primary/20 cursor-pointer">
                  Terapkan
                </button>
              </div>
            </UpdateDiscountForm>
          )}
        </div>
      )}
    </section>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartGiftCard({
  giftCardCodes,
  giftCardHeadingId,
  giftCardInputId,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
  giftCardHeadingId: string;
  giftCardInputId: string;
}) {
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const removeButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const previousCardIdsRef = useRef<string[]>([]);
  const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});
  const [removedCardIndex, setRemovedCardIndex] = useState<number | null>(null);

  useEffect(() => {
    if (giftCardAddFetcher.data) {
      if (giftCardCodeInput.current !== null) {
        giftCardCodeInput.current.value = '';
      }
    }
  }, [giftCardAddFetcher.data]);

  useEffect(() => {
    const currentCardIds = giftCardCodes?.map((card) => card.id) || [];

    if (removedCardIndex !== null && giftCardCodes) {
      const focusTargetIndex = Math.min(
        removedCardIndex,
        giftCardCodes.length - 1,
      );
      const focusTargetCard = giftCardCodes[focusTargetIndex];
      const focusButton = focusTargetCard
        ? removeButtonRefs.current.get(focusTargetCard.id)
        : null;

      if (focusButton) {
        focusButton.focus();
      } else if (giftCardCodeInput.current) {
        giftCardCodeInput.current.focus();
      }

      setRemovedCardIndex(null);
    }

    previousCardIdsRef.current = currentCardIds;
  }, [giftCardCodes, removedCardIndex]);

  const handleRemoveClick = (cardId: string) => {
    const index = previousCardIdsRef.current.indexOf(cardId);
    if (index !== -1) {
      setRemovedCardIndex(index);
    }
  };

  const [isGiftCardOpen, setIsGiftCardOpen] = useState(false);

  return (
    <section aria-label="Gift cards" className="mt-1">
      {giftCardCodes && giftCardCodes.length > 0 && (
        <dl className="mb-2">
          <dt id={giftCardHeadingId} className="sr-only">Applied Gift Card(s)</dt>
          {giftCardCodes.map((giftCard) => (
            <dd key={giftCard.id}>
              <RemoveGiftCardForm
                giftCardId={giftCard.id}
                lastCharacters={giftCard.lastCharacters}
                onRemoveClick={() => handleRemoveClick(giftCard.id)}
                buttonRef={(el: HTMLButtonElement | null) => {
                  if (el) {
                    removeButtonRefs.current.set(giftCard.id, el);
                  } else {
                    removeButtonRefs.current.delete(giftCard.id);
                  }
                }}
              >
                <div className="flex justify-between items-center bg-[#FAF8FC] px-3.5 py-2.5 rounded-xl border border-black/[0.04]">
                  <code className="text-xs font-semibold text-text">***{giftCard.lastCharacters} (<Money data={giftCard.amountUsed} />)</code>
                  <button
                    type="submit"
                    aria-label={`Hapus gift card berakhiran ${giftCard.lastCharacters}`}
                    className="text-xs font-semibold text-text-secondary hover:text-rose-600 transition-colors cursor-pointer active:scale-95"
                  >
                    Hapus
                  </button>
                </div>
              </RemoveGiftCardForm>
            </dd>
          ))}
        </dl>
      )}

      {!isGiftCardOpen ? (
        <button
          type="button"
          onClick={() => setIsGiftCardOpen(true)}
          className="text-[11px] font-medium text-text-secondary/70 hover:text-primary flex items-center gap-1 cursor-pointer py-0.5 transition-colors"
        >
          <span>Punya gift card?</span>
        </button>
      ) : (
        <AddGiftCardForm fetcherKey="gift-card-add">
          <div className="flex gap-2 mt-1">
            <label htmlFor={giftCardInputId} className="sr-only">
              Kode gift card
            </label>
            <input
              id={giftCardInputId}
              type="text"
              name="giftCardCode"
              placeholder="Kode gift card..."
              ref={giftCardCodeInput}
              className="flex-1 bg-[#FAF8FC] border border-black/10 rounded-xl px-3.5 py-2 text-base sm:text-xs text-text placeholder:text-text-secondary/60 focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={giftCardAddFetcher.state !== 'idle'}
              aria-label="Terapkan gift card"
              className="bg-[#111111] hover:bg-primary active:scale-[0.98] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xs hover:shadow-md hover:shadow-primary/20 disabled:opacity-50 cursor-pointer"
            >
              Terapkan
            </button>
          </div>
        </AddGiftCardForm>
      )}
    </section>
  );
}

function AddGiftCardForm({
  fetcherKey,
  children,
}: {
  fetcherKey?: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      fetcherKey={fetcherKey}
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesAdd}
    >
      {children}
    </CartForm>
  );
}

function RemoveGiftCardForm({
  giftCardId,
  lastCharacters,
  children,
  onRemoveClick,
  buttonRef,
}: {
  giftCardId: string;
  lastCharacters: string;
  children: React.ReactNode;
  onRemoveClick?: () => void;
  buttonRef?: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{
        giftCardCodes: [giftCardId],
      }}
    >
      {children}
      &nbsp;
      <button
        type="submit"
        aria-label={`Remove gift card ending in ${lastCharacters}`}
        onClick={onRemoveClick}
        ref={buttonRef}
      >
        Remove
      </button>
    </CartForm>
  );
}
