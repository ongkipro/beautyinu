import {
  Link,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from 'react-router';
import type {Route} from './+types/account.orders._index';
import {useRef} from 'react';
import {
  Money,
  getPaginationVariables,
  flattenConnection,
} from '@shopify/hydrogen';
import {
  buildOrderSearchQuery,
  parseOrderFilters,
  ORDER_FILTER_FIELDS,
  type OrderFilterParams,
} from '~/lib/orderFilters';
import {CUSTOMER_ORDERS_QUERY} from '~/graphql/customer-account/CustomerOrdersQuery';
import type {
  CustomerOrdersFragment,
  OrderItemFragment,
} from 'customer-accountapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';

type OrdersLoaderData = {
  customer: CustomerOrdersFragment;
  filters: OrderFilterParams;
};

export const meta: Route.MetaFunction = () => {
  return [{title: 'Orders'}];
};

export async function loader({request, context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 20,
  });

  const url = new URL(request.url);
  const filters = parseOrderFilters(url.searchParams);
  const query = buildOrderSearchQuery(filters);

  const {data, errors} = await customerAccount.query(CUSTOMER_ORDERS_QUERY, {
    variables: {
      ...paginationVariables,
      query,
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.customer) {
    throw Error('Customer orders not found');
  }

  return {customer: data.customer, filters};
}

export default function Orders() {
  const {customer, filters} = useLoaderData<OrdersLoaderData>();
  const {orders} = customer;

  return (
    <div className="orders">
      <OrderSearchForm currentFilters={filters} />
      <OrdersTable orders={orders} filters={filters} />
    </div>
  );
}

function OrdersTable({
  orders,
  filters,
}: {
  orders: CustomerOrdersFragment['orders'];
  filters: OrderFilterParams;
}) {
  const hasFilters = !!(filters.name || filters.confirmationNumber);

  return (
    <div className="acccount-orders" aria-live="polite">
      {orders?.nodes.length ? (
        <PaginatedResourceSection connection={orders}>
          {({node: order}) => <OrderItem key={order.id} order={order} />}
        </PaginatedResourceSection>
      ) : (
        <EmptyOrders hasFilters={hasFilters} />
      )}
    </div>
  );
}

function EmptyOrders({hasFilters = false}: {hasFilters?: boolean}) {
  return (
    <div>
      {hasFilters ? (
        <>
          <p>No orders found matching your search.</p>
          <br />
          <p>
            <Link to="/account/orders">Clear filters →</Link>
          </p>
        </>
      ) : (
        <>
          <p>You haven&apos;t placed any orders yet.</p>
          <br />
          <p>
            <Link to="/collections">Start Shopping →</Link>
          </p>
        </>
      )}
    </div>
  );
}

function OrderSearchForm({
  currentFilters,
}: {
  currentFilters: OrderFilterParams;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const isSearching =
    navigation.state !== 'idle' &&
    navigation.location?.pathname?.includes('orders');
  const formRef = useRef<HTMLFormElement>(null);
  const hasFilters = !!filtersActive(currentFilters);

  function filtersActive(f: OrderFilterParams) {
    return Object.values(f).some(Boolean);
  }

  return (
    <form ref={formRef} className="mb-6">
      <fieldset className="flex flex-wrap items-center gap-2.5">
        <input
          name={ORDER_FILTER_FIELDS.NAME}
          type="text"
          placeholder="Cari nomor pesanan (#1001)..."
          aria-label="Nomor pesanan"
          defaultValue={currentFilters.name || ''}
          className="px-4 py-2.5 bg-white border border-black/10 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-black min-w-[220px]"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="px-5 py-2.5 rounded-xl bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
        >
          {isSearching ? 'Mencari...' : 'Cari'}
        </button>
        {hasFilters && (
          <button
            type="button"
            disabled={isSearching}
            onClick={() => {
              setSearchParams(new URLSearchParams());
              formRef.current?.reset();
            }}
            className="px-4 py-2.5 rounded-xl bg-[#FAF9FB] hover:bg-neutral-100 border border-black/10 text-xs font-medium text-text transition-colors cursor-pointer"
          >
            Reset
          </button>
        )}
      </fieldset>
    </form>
  );
}

function OrderItem({order}: {order: OrderItemFragment}) {
  const fulfillmentStatus = flattenConnection(order.fulfillments)[0]?.status;
  return (
    <div className="rounded-2xl bg-[#FAF9FB] border border-black/[0.06] p-5 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Link
            to={`/account/orders/${btoa(order.id)}`}
            className="font-bold text-base text-text hover:text-primary transition-colors"
          >
            #{order.number}
          </Link>
          {order.financialStatus && (
            <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              {order.financialStatus}
            </span>
          )}
          {fulfillmentStatus && (
            <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
              {fulfillmentStatus}
            </span>
          )}
        </div>
        <p className="text-xs text-text-secondary">
          {new Date(order.processedAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4">
        <span className="font-bold text-text text-sm sm:text-base">
          <Money data={order.totalPrice} withoutTrailingZeros />
        </span>
        <Link
          to={`/account/orders/${btoa(order.id)}`}
          className="px-4 py-2 rounded-xl bg-white border border-black/[0.1] text-xs font-semibold text-text hover:border-black transition-colors"
        >
          Lihat Pesanan →
        </Link>
      </div>
    </div>
  );
}
