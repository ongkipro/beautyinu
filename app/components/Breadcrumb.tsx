import {Link} from 'react-router';
import {ChevronRight} from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export interface BreadcrumbProps {
  /**
   * Breadcrumb hierarchy items after "Home".
   * E.g. [{label: 'Koleksi', to: '/collections'}, {label: 'Semua Produk'}]
   */
  items: BreadcrumbItem[];
  /**
   * - 'bar': Dedicated top strip bar (h-11, border-b, bg-white) for catalog & archive pages.
   * - 'inline': Directly embedded within content/grid (PDP, CMS pages, Cart, Search).
   * - 'hero': Translucent white for dark/cinematic hero covers (Single Article).
   */
  variant?: 'bar' | 'inline' | 'hero';
  /**
   * Whether to automatically prepend "Home" (default: true).
   */
  includeHome?: boolean;
  /**
   * Custom label for root item (default: "Home").
   */
  homeLabel?: string;
  /**
   * Alignment of breadcrumb list (default: 'left').
   */
  align?: 'left' | 'center';
  /**
   * Optional additional class name for the nav element.
   */
  className?: string;
}

export function Breadcrumb({
  items,
  variant = 'inline',
  includeHome = true,
  homeLabel = 'Home',
  align = 'left',
  className = '',
}: BreadcrumbProps) {
  const fullItems: BreadcrumbItem[] = includeHome
    ? [{label: homeLabel, to: '/'}, ...items]
    : items;

  if (fullItems.length === 0) return null;

  const isHero = variant === 'hero';
  const isBar = variant === 'bar';

  const navContent = (
    <nav
      aria-label="Breadcrumb"
      className={`min-w-0 ${isHero ? 'w-full' : ''} ${className}`}
    >
      <ol
        className={`flex items-center gap-1.5 text-xs min-w-0 ${
          isHero
            ? 'justify-center text-white/75 flex-wrap'
            : align === 'center'
              ? 'justify-center text-text-secondary'
              : 'text-text-secondary'
        } ${
          variant === 'inline'
            ? 'overflow-hidden flex-nowrap whitespace-nowrap'
            : ''
        }`}
      >
        {fullItems.map((item, index) => {
          const isLast = index === fullItems.length - 1;

          return (
            <li
              key={`${item.label}-${index}`}
              className={`flex items-center gap-1.5 min-w-0 ${
                isLast ? 'truncate flex-1 sm:flex-initial' : 'flex-shrink-0'
              }`}
              aria-current={isLast ? 'page' : undefined}
            >
              {index > 0 && (
                <ChevronRight
                  className={`w-3.5 h-3.5 flex-shrink-0 select-none ${
                    isHero ? 'text-white/40' : 'text-black/30'
                  }`}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              )}

              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className={`transition-colors flex-shrink-0 ${
                    isHero ? 'hover:text-white' : 'hover:text-primary'
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`truncate ${
                    isHero
                      ? 'text-white font-medium max-w-[200px] sm:max-w-md'
                      : isBar
                        ? 'font-semibold text-text'
                        : 'font-medium text-text'
                  }`}
                  title={item.label}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );

  if (isBar) {
    return (
      <div className="border-b border-black/[0.04] bg-white h-11 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {navContent}
        </div>
      </div>
    );
  }

  return navContent;
}
