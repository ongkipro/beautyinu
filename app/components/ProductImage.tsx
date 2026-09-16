import {useState} from 'react';
import {Image} from '@shopify/hydrogen';
import {ShieldCheck, ChevronLeft, ChevronRight} from 'lucide-react';

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

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-[#FAF7FD] rounded-2xl flex items-center justify-center text-text-secondary">
        <span>No image available</span>
      </div>
    );
  }

  const activeImage = images[selectedIndex] || images[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Container — Flat & borderless */}
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-[#F6F5F8]">
        <Image
          key={activeImage.id || activeImage.url}
          alt={activeImage.altText || 'Beautyinu Product'}
          aspectRatio="1/1"
          data={activeImage as any}
          sizes="(min-width: 1024px) 50vw, 100vw"
          loading="eager"
          className="h-full w-full object-contain p-6 transition-all duration-300"
        />

        {/* Floating Quality Badge — Minimalist Flat */}
        <div className="absolute top-4 left-4 bg-white/95 px-3 py-1.5 rounded-full text-xs font-semibold text-text flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>BPOM Certified</span>
        </div>

        {/* Mobile / Arrow Navigation (if more than 1 image) */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                setSelectedIndex((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1,
                )
              }
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white text-text flex items-center justify-center hover:bg-neutral-100 transition-all opacity-80 hover:opacity-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                setSelectedIndex((prev) =>
                  prev === images.length - 1 ? 0 : prev + 1,
                )
              }
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white text-text flex items-center justify-center hover:bg-neutral-100 transition-all opacity-80 hover:opacity-100"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Strip */}
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {images.map((img, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={img.id || img.url || idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-[#F6F5F8] transition-all ${
                  isSelected
                    ? 'ring-2 ring-primary scale-95'
                    : 'opacity-60 hover:opacity-100'
                }`}
                aria-label={`View image ${idx + 1}`}
              >
                <Image
                  alt={img.altText || `Thumbnail ${idx + 1}`}
                  aspectRatio="1/1"
                  data={img as any}
                  sizes="80px"
                  loading="lazy"
                  className="h-full w-full object-contain p-1"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
