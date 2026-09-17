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
   * - 'bar': Dedicated top strip bar (h-11, border-b, backdrop-blur) for catalog & archive pages.
   * - 'inline': Directly embedded within content/grid (PDP, CMS pages, Cart, Search).
   * - 'hero': Translucent white for dark/cinematic hero covers (Single Article).
   */
  variant?: 'bar' | 'inline' | 'hero';
  /**
   * Visual theme when variant is 'bar':
   * - 'light' (default): Glass white with dark text and subtle dark fading bottom border.
   * - 'dark': Translucent black glass (bg-black/25 backdrop-blur-md) with white text and white fading bottom border (for dark hero images).
   */
  theme?: 'light' | 'dark';
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
   * Optional additional class name for the wrapper element.
   */
  className?: string;
}

export function Breadcrumb({
  items,
  variant = 'inline',
  theme = 'light',
  includeHome = true,
  homeLabel = 'Home',
  align = 'left',
  className = '',
}: BreadcrumbProps) {
  const fullItems: BreadcrumbItem[] = includeHome
    ? [{label: homeLabel, to: '/'}, ...items]
    : items;

  if (fullItems.length === 0) return null;

  const isDark = theme === 'dark' || variant === 'hero';
  const isBar = variant === 'bar';
  const isCentered = align === 'center' || variant === 'hero';

  const navContent = (
    <nav
      aria-label="Breadcrumb"
      className={`w-full min-w-0 ${isCentered ? 'text-center' : ''}`}
    >
      <ol
        className={`flex items-center gap-1 sm:gap-1.5 text-xs w-full min-w-0 overflow-hidden flex-nowrap whitespace-nowrap ${
          isDark
            ? 'text-white/80'
            : isCentered
              ? 'justify-center text-text-secondary'
              : 'text-text-secondary'
        } ${isCentered ? 'justify-center' : ''}`}
      >
        {fullItems.map((item, index) => {
          const isLast = index === fullItems.length - 1;

          return (
            <li
              key={`${item.label}-${index}`}
              className={`flex items-center gap-1 sm:gap-1.5 min-w-0 ${
                isLast
                  ? isCentered
                    ? 'flex-shrink min-w-0'
                    : 'flex-1 min-w-0'
                  : 'flex-shrink-0'
              }`}
              aria-current={isLast ? 'page' : undefined}
            >
              {index > 0 && (
                <ChevronRight
                  className={`w-3.5 h-3.5 flex-shrink-0 select-none ${
                    isDark ? 'text-white/40' : 'text-black/30'
                  }`}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              )}

              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  title={item.label}
                  className={`transition-colors flex-shrink-0 max-w-[110px] sm:max-w-none truncate ${
                    isDark ? 'hover:text-white' : 'hover:text-primary'
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`truncate block min-w-0 ${
                    isCentered ? 'max-w-xs sm:max-w-md' : 'flex-1 w-full'
                  } ${
                    isDark
                      ? 'text-white font-medium'
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
      <div
        className={`relative w-full h-11 flex items-center z-10 ${
          isDark
            ? 'bg-black/25 backdrop-blur-md'
            : 'bg-white/75 backdrop-blur-md'
        } ${className}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {navContent}
        </div>
        {/* Soft Fading Bottom Border: Smooth edge fade with consistent plateau across content */}
        <div
          className={`absolute inset-x-0 bottom-0 h-px pointer-events-none select-none ${
            isDark ? 'hairline-divider-dark' : 'hairline-divider'
          }`}
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <div className={`w-full min-w-0 ${className}`}>
      {navContent}
    </div>
  );
}
