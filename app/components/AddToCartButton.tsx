import {type FetcherWithComponents} from 'react-router';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
            className="w-full h-12 flex items-center justify-center bg-[#F97F9E] text-white rounded-full font-semibold transition hover:bg-[#F06B8D] disabled:opacity-50 disabled:cursor-not-allowed md:static md:w-full fixed bottom-4 left-4 right-4 z-50 w-[calc(100%-2rem)]"
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}
