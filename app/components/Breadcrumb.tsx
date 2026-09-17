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

  const navContent = (
    <nav
      aria-label="Breadcrumb"
      className={`min-w-0 ${align === 'center' || variant === 'hero' ? 'w-full' : ''}`}
    >
      <ol
        className={`flex items-center gap-1.5 text-xs min-w-0 ${
          isDark
            ? 'text-white/80'
            : align === 'center'
              ? 'justify-center text-text-secondary'
              : 'text-text-secondary'
        } ${
          align === 'center' || variant === 'hero' ? 'justify-center' : ''
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
                    isDark ? 'text-white/40' : 'text-black/30'
                  }`}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              )}

              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className={`transition-colors flex-shrink-0 ${
                    isDark ? 'hover:text-white' : 'hover:text-primary'
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`truncate ${
                    isDark
                      ? 'text-white font-medium max-w-[200px] sm:max-w-md'
                      : isBar
                        ? 'font-semibold text-text max-w-[150px] xs:max-w-[220px] sm:max-w-xs md:max-w-md'
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
    <div className={className}>
      {navContent}
    </div>
  );
}
