import { useState } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import type { MediaItem } from '@/lib/types';

export interface CarouselItem {
  url: string;
  type: 'image' | 'video';
  caption?: string | null;
}

export function toCarouselItems(items: MediaItem[]): CarouselItem[] {
  return items
    .map((m): CarouselItem | null => {
      const isVideo = m.media_type === 'video' || (!!m.video_url && !m.image_url);
      const url = isVideo ? m.video_url : m.image_url;
      if (!url) return null;
      return { url, type: isVideo ? 'video' : 'image', caption: m.caption };
    })
    .filter((m): m is CarouselItem => m !== null);
}

export function MediaCarousel({
  items,
  title,
  aspect = 'aspect-[4/3]',
  showThumbnails = true,
}: {
  items: CarouselItem[];
  title: string;
  aspect?: string;
  showThumbnails?: boolean;
}) {
  const [index, setIndex] = useState(0);
  if (items.length === 0) return null;

  const safeIndex = Math.min(index, items.length - 1);
  const current = items[safeIndex];
  const go = (delta: number) => setIndex((prev) => (prev + delta + items.length) % items.length);

  return (
    <div
      className="w-full"
      role="region"
      aria-roledescription="carousel"
      aria-label={`${title} media`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') go(-1);
        if (e.key === 'ArrowRight') go(1);
      }}
    >
      <div className={`relative ${aspect} w-full overflow-hidden rounded-2xl bg-plum-950`}>
        {current.type === 'video' ? (
          <video key={current.url} src={current.url} controls playsInline className="h-full w-full object-contain" />
        ) : (
          <img key={current.url} src={current.url} alt={current.caption || `${title} image ${safeIndex + 1}`} className="h-full w-full object-cover animate-fade-in" />
        )}

        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-plum-800 shadow-lg transition hover:bg-white hover:scale-105"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-plum-800 shadow-lg transition hover:bg-white hover:scale-105"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="absolute top-3 right-3 rounded-full bg-plum-950/70 px-3 py-1 font-lato text-xs text-white">
              {safeIndex + 1} / {items.length}
            </span>
          </>
        )}
      </div>

      {current.caption && (
        <p className="mt-3 font-cormorant text-lg italic text-charcoal-700 leading-snug">{current.caption}</p>
      )}

      {showThumbnails && items.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1 scrollbar-none">
          {items.map((item, i) => (
            <button
              key={`${item.url}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show item ${i + 1}`}
              aria-current={i === safeIndex}
              className={`relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${
                i === safeIndex ? 'border-gold-400' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              {item.type === 'video' ? (
                <span className="flex h-full w-full items-center justify-center bg-plum-900 text-white">
                  <Play className="h-5 w-5" fill="currentColor" />
                </span>
              ) : (
                <img src={item.url} alt="" className="h-full w-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
