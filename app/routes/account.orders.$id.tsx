import {redirect, useLoaderData, Link} from 'react-router';
import type {Route} from './+types/account.orders.$id';
import {Money, Image} from '@shopify/hydrogen';
import type {
  OrderLineItemFullFragment,
  OrderQuery,
} from 'customer-accountapi.generated';
import {CUSTOMER_ORDER_QUERY} from '~/graphql/customer-account/CustomerOrderQuery';
import {ArrowLeft, ExternalLink, Package, Truck, MapPin, CheckCircle2} from 'lucide-react';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Pesanan ${data?.order?.name} — Beautyinu`}];
};

export async function loader({params, context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  if (!params.id) {
    return redirect('/account/orders');
  }

  const orderId = atob(params.id);
  const {data, errors}: {data: OrderQuery; errors?: Array<{message: string}>} =
    await customerAccount.query(CUSTOMER_ORDER_QUERY, {
      variables: {
        orderId,
        language: customerAccount.i18n.language,
      },
    });

  if (errors?.length || !data?.order) {
    throw new Error('Order not found');
  }

  const {order} = data;

  // Extract line items directly from nodes array
  const lineItems = order.lineItems.nodes;

  // Extract discount applications directly from nodes array
  const discountApplications = order.discountApplications.nodes;

  // Get fulfillment status from first fulfillment node
  const fulfillmentStatus = order.fulfillments.nodes[0]?.status ?? 'N/A';

  // Get first discount value with proper type checking
  const firstDiscount = discountApplications[0]?.value;

  // Type guard for MoneyV2 discount
  const discountValue =
    firstDiscount?.__typename === 'MoneyV2'
      ? (firstDiscount as Extract<
          typeof firstDiscount,
          {__typename: 'MoneyV2'}
        >)
      : null;

  // Type guard for percentage discount
  const discountPercentage =
    firstDiscount?.__typename === 'PricingPercentageValue'
      ? (
          firstDiscount as Extract<
            typeof firstDiscount,
            {__typename: 'PricingPercentageValue'}
          >
        ).percentage
      : null;

  return {
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus,
  };
}

export default function OrderRoute() {
  const {
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus,
  } = useLoaderData<typeof loader>();

  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(order.processedAt!));

  return (
    <div className="max-w-3xl space-y-6">
      {/* Back to Orders */}
      <div>
        <Link
          to="/account/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-primary transition-colors py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Pesanan Saya</span>
        </Link>
      </div>

      {/* Main Order Card */}
      <div className="rounded-2xl bg-[#FAF9FB] border border-black/[0.05] p-6 sm:p-8 space-y-6">
        {/* Header Information */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/[0.06]">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-serif text-2xl sm:text-3xl text-text font-normal">
                Pesanan {order.name}
              </h1>
              {fulfillmentStatus && fulfillmentStatus !== 'N/A' && (
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60 font-medium">
                  {fulfillmentStatus}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Dipesan pada {formattedDate}
              {order.confirmationNumber && (
                <span className="ml-2 font-mono text-[11px] text-text-secondary/80">
                  (Konfirmasi: {order.confirmationNumber})
                </span>
              )}
            </p>
          </div>

          {order.statusPageUrl && (
            <a
              target="_blank"
              href={order.statusPageUrl}
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-black/10 text-xs font-semibold text-text hover:border-black transition-all hover:shadow-2xs self-start sm:self-auto"
            >
              <span>Status Pengiriman</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Ordered Items List */}
        <div>
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-text-secondary mb-3 flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-primary" />
            <span>Daftar Produk ({lineItems.length})</span>
          </h2>
          <div className="divide-y divide-black/[0.04] bg-white rounded-2xl border border-black/[0.05] p-3 sm:p-4 shadow-xs">
            {lineItems.map((lineItem, lineItemIndex) => (
              // eslint-disable-next-line react/no-array-index-key
              <OrderLineRow key={lineItemIndex} lineItem={lineItem} />
            ))}
          </div>
        </div>

        {/* Order Summary & Shipping Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Shipping Address */}
          <div className="p-5 rounded-xl bg-white border border-black/[0.05] shadow-2xs">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>Alamat Pengiriman</span>
            </h3>
            {order?.shippingAddress ? (
              <address className="not-italic text-xs sm:text-sm text-text space-y-1 leading-relaxed">
                <p className="font-semibold text-text">{order.shippingAddress.name}</p>
                {order.shippingAddress.formatted && (
                  <p className="text-text-secondary">{order.shippingAddress.formatted}</p>
                )}
                {order.shippingAddress.formattedArea && (
                  <p className="text-text-secondary">{order.shippingAddress.formattedArea}</p>
                )}
              </address>
            ) : (
              <p className="text-xs text-text-secondary">Tidak ada alamat pengiriman tercatat</p>
            )}
          </div>

          {/* Pricing Breakdown */}
          <div className="p-5 rounded-xl bg-white border border-black/[0.05] shadow-2xs space-y-2.5 text-xs sm:text-sm">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text mb-3">
              Rincian Pembayaran
            </h3>

            <div className="flex justify-between items-center text-text-secondary">
              <span>Subtotal</span>
              <span className="font-medium text-text">
                <Money data={order.subtotal!} withoutTrailingZeros />
              </span>
            </div>

            {((discountValue && discountValue.amount) || discountPercentage) && (
              <div className="flex justify-between items-center text-emerald-700">
                <span>Diskon Promo</span>
                <span className="font-medium">
                  {discountPercentage ? (
                    `-${discountPercentage}% OFF`
                  ) : (
                    discountValue && <Money data={discountValue!} withoutTrailingZeros />
                  )}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center text-text-secondary">
              <span>Pajak &amp; Biaya</span>
              <span className="font-medium text-text">
                <Money data={order.totalTax!} withoutTrailingZeros />
              </span>
            </div>

            <div className="pt-2.5 border-t border-black/[0.06] flex justify-between items-center text-sm sm:text-base font-bold text-text">
              <span>Total Pembayaran</span>
              <span className="text-primary font-bold">
                <Money data={order.totalPrice!} withoutTrailingZeros />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderLineRow({lineItem}: {lineItem: OrderLineItemFullFragment}) {
  return (
    <div className="py-3.5 first:pt-1 last:pb-1 flex items-center justify-between gap-3.5">
      <div className="flex items-center gap-3 min-w-0">
        {lineItem?.image ? (
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#FAF9FB] border border-black/[0.05] flex-shrink-0">
            <Image
              data={lineItem.image}
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-xl bg-[#FAF9FB] border border-black/[0.05] flex items-center justify-center text-text-secondary/40 text-[10px] font-mono flex-shrink-0">
            Beautyinu
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-semibold text-text truncate">
            {lineItem.title}
          </p>
          {lineItem.variantTitle && (
            <p className="text-xs text-text-secondary mt-0.5 truncate">
              Varian: {lineItem.variantTitle}
            </p>
          )}
          <p className="text-xs text-text-secondary mt-0.5">
            Jumlah: <span className="font-mono font-medium text-text">{lineItem.quantity}</span>
          </p>
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        <span className="text-xs sm:text-sm font-bold text-text">
          <Money data={lineItem.price!} withoutTrailingZeros />
        </span>
      </div>
    </div>
  );
}
