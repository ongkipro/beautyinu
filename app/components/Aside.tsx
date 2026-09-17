import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useState,
} from 'react';
import {X} from 'lucide-react';

type AsideType = 'search' | 'cart' | 'mobile' | 'closed';
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

/**
 * Floating Modal Component ("Modal Mengambang")
 * - Inset floating island on mobile (top-3 right-3 bottom-3 left-3) & desktop (top-4 right-4 bottom-4).
 * - Smooth right-to-left slide transition with luxury spring curve.
 * - Backdrop blur with scroll lock.
 * - Architectural zero-clutter layout matching the homepage aesthetic.
 */
export function Aside({
  children,
  heading,
  type,
}: {
  children?: React.ReactNode;
  type: AsideType;
  heading: React.ReactNode;
}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;
  const id = useId();

  // Close on Escape key
  useEffect(() => {
    if (!expanded) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        close();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [close, expanded]);

  return (
    <>
      {/* 1. Backdrop Overlay with Dimming & Blur */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-all duration-300 ${
          expanded
            ? 'opacity-100 pointer-events-auto visible'
            : 'opacity-0 pointer-events-none invisible'
        }`}
        onClick={close}
        aria-hidden="true"
      />

      {/* 2. Floating Modal Panel ("Modal Mengambang") — Slide Right-to-Left */}
      <aside
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label={typeof heading === 'string' ? heading : 'Panel'}
        className={`fixed z-50 bg-white flex flex-col overflow-hidden overscroll-contain transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          /* Mobile: Floating island with 12px margin all-around and safe area compensation */
          top-3 right-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] left-3 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.22)] border border-black/[0.08]
          /* Desktop: Floating card on right with 16px margins */
          sm:left-auto sm:top-4 sm:right-4 sm:bottom-4 sm:w-[460px] md:w-[480px] sm:max-h-[calc(100dvh-2rem)]
          ${
            expanded
              ? 'translate-x-0 opacity-100 pointer-events-auto visible'
              : 'translate-x-[calc(100%+2rem)] opacity-0 pointer-events-none invisible'
          }
        `}
      >
        {/* Floating Modal Header */}
        <div className="px-5 py-4 border-b border-black/[0.06] flex items-center justify-between bg-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-lg sm:text-xl font-normal text-text tracking-tight m-0">
              {heading}
            </h3>
          </div>
          <button
            type="button"
            onClick={close}
            className="w-9 h-9 rounded-full flex items-center justify-center text-text-secondary hover:text-primary hover:bg-[#FFF3F6] active:scale-95 transition-all duration-200 cursor-pointer"
            aria-label="Tutup panel"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Floating Modal Body */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-white">
          {children}
        </div>
      </aside>
    </>
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed');

  // Lock body scroll when modal is active
  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (type !== 'closed') {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      document.body.classList.add('aside-modal-open');
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.classList.remove('aside-modal-open');
      };
    }
  }, [type]);

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}
