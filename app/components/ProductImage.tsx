import {useState, useRef, useCallback, useEffect} from 'react';
import {Image} from '@shopify/hydrogen';
import {ChevronLeft, ChevronRight} from 'lucide-react';

interface ProductImageProps {
  images: Array<{
    id?: string | null;
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  }>;
}

export function ProductImage({images}: ProductImageProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [stageHeight, setStageHeight] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const mainStageRef = useRef<HTMLDivElement | null>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const safeImages = images && images.length > 0 ? images : [];
  const activeImage = safeImages[selectedIndex] || safeImages[0];

  // Monitor desktop viewport breakpoint
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener('resize', checkDesktop, {passive: true});
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Measure main stage height on desktop so mini thumbnails match 100% precisely
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stageEl = mainStageRef.current;
    if (!stageEl) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Main stage is aspect-square, width is the true invariant source of truth
        const width = Math.round(entry.contentRect.width);
        if (width > 0) {
          setStageHeight(width);
        }
      }
    });

    observer.observe(stageEl);
    return () => observer.disconnect();
  }, []);

  // 5 thumbnails visible with 4 gaps of 8px (32px total gap)
  const thumbGap = 8;
  const isDesktopActive = isDesktop && stageHeight !== null;
  const thumbSize = isDesktopActive
    ? Math.floor((stageHeight - 4 * thumbGap) / 5)
    : null;

  const handleSelect = useCallback(
    (index: number) => {
      setSelectedIndex(index);
      const targetBtn = thumbnailRefs.current[index];
      if (targetBtn) {
        targetBtn.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    },
    [],
  );

  const prevImage = useCallback(() => {
    if (safeImages.length <= 1) return;
    const nextIdx = (selectedIndex - 1 + safeImages.length) % safeImages.length;
    handleSelect(nextIdx);
  }, [selectedIndex, safeImages.length, handleSelect]);

  const nextImage = useCallback(() => {
    if (safeImages.length <= 1) return;
    const nextIdx = (selectedIndex + 1) % safeImages.length;
    handleSelect(nextIdx);
  }, [selectedIndex, safeImages.length, handleSelect]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (safeImages.length === 0) {
    return (
      <div className="w-full aspect-square bg-[#F8F7FA] rounded-3xl flex items-center justify-center text-text-secondary/50 text-xs font-mono uppercase tracking-wider">
        <span>No image available</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse md:flex-row md:items-start gap-3 sm:gap-4 min-w-0 max-w-full">
      {/* 1. Precision Mini Thumbnails: Exact height of main thumbnail, 5 items visible, remainder scrollable */}
      {safeImages.length > 1 && (
        <div
          style={isDesktopActive ? {height: `${stageHeight}px`} : undefined}
          className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto scrollbar-none py-1 px-0.5 md:p-0 flex-shrink-0 snap-x md:snap-y"
        >
          {safeImages.map((img, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={img.id || img.url || idx}
                ref={(el) => {
                  thumbnailRefs.current[idx] = el;
                }}
                type="button"
                onClick={() => handleSelect(idx)}
                style={
                  isDesktopActive && thumbSize
                    ? {
                        height: `${thumbSize}px`,
                        width: `${thumbSize}px`,
                      }
                    : undefined
                }
                className={`group snap-start relative flex-shrink-0 w-16 h-16 md:w-auto md:h-auto aspect-square rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'opacity-100'
                    : 'opacity-40 hover:opacity-90'
                }`}
                aria-label={`Lihat foto ${idx + 1}`}
                aria-current={isSelected ? 'true' : undefined}
              >
                <Image
                  alt={img.altText || `Thumbnail ${idx + 1}`}
                  aspectRatio="1/1"
                  data={img as any}
                  sizes="140px"
                  loading="lazy"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300 select-none"
                />
                {/* Minimalist Flat Active Indicator Bar */}
                <span
                  className={`absolute bottom-0 inset-x-2 h-[2.5px] rounded-full transition-all duration-200 pointer-events-none ${
                    isSelected
                      ? 'bg-primary opacity-100'
                      : 'bg-transparent opacity-0'
                  }`}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* 2. Main Stage Image Canvas (Flat Minimalist, 100% Frameless & Borderless, Edge-to-Edge) */}
      <div
        ref={mainStageRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="group relative aspect-square w-full flex-1 overflow-hidden rounded-3xl flex items-center justify-center min-w-0 select-none"
      >
        <Image
          key={activeImage.id || activeImage.url}
          alt={activeImage.altText || 'Beautyinu Product'}
          aspectRatio="1/1"
          data={activeImage as any}
          sizes="(min-width: 1024px) 50vw, 100vw"
          loading="eager"
          className="h-full w-full object-contain transition-all duration-300 pointer-events-none select-none"
        />

        {/* Minimalist Micro Photo Counter (Flat frosted pill) */}
        {safeImages.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md text-white/90 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium tracking-wider pointer-events-none select-none">
            {selectedIndex + 1} / {safeImages.length}
          </div>
        )}

        {/* Floating Minimalist Arrow Controls (Borderless Frosted Glass - Desktop hover only) */}
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              aria-label="Foto sebelumnya"
              className="hidden sm:flex absolute left-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-text backdrop-blur-md items-center justify-center transition-all active:scale-95 cursor-pointer opacity-0 group-hover:opacity-100 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              aria-label="Foto selanjutnya"
              className="hidden sm:flex absolute right-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-text backdrop-blur-md items-center justify-center transition-all active:scale-95 cursor-pointer opacity-0 group-hover:opacity-100 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
