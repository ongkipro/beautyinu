import {type FetcherWithComponents} from 'react-router';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
  className,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
  className?: string;
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
            className={
              className ||
              'w-full h-12 flex items-center justify-center bg-[#F97F9E] hover:bg-[#F06B8D] active:scale-[0.99] text-white rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
            }
          >
            {fetcher.state !== 'idle' ? 'Menambahkan...' : children}
          </button>
        </>
      )}
    </CartForm>
  );
}
