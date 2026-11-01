"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import { productImageUrl } from "@/lib/images";
import { cn } from "@/lib/utils";

const SWIPE_THRESHOLD = 45;

export function ProductGallery({
  images,
  name,
}: {
  images: { id: string; url: string; alt: string | null }[];
  name: string;
}) {
  const gallery = images.length > 0 ? images : [{ id: "fallback", url: "", alt: name }];
  const count = gallery.length;

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [zoomed, setZoomed] = React.useState(false);
  const touchStartX = React.useRef<number | null>(null);
  const swiped = React.useRef(false);

  const safeIndex = Math.min(activeIndex, count - 1);
  const active = gallery[safeIndex];

  const goPrev = React.useCallback(
    () => setActiveIndex((index) => (index - 1 + count) % count),
    [count],
  );
  const goNext = React.useCallback(
    () => setActiveIndex((index) => (index + 1) % count),
    [count],
  );

  const handleTouchStart = (event: React.TouchEvent) => {
    swiped.current = false;
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = (event.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
    touchStartX.current = null;
    if (count <= 1 || Math.abs(deltaX) < SWIPE_THRESHOLD) return;
    swiped.current = true;
    if (deltaX < 0) goNext();
    else goPrev();
  };

  const openZoom = () => {
    // Bỏ qua cú nhấp phát sinh ngay sau thao tác vuốt.
    if (swiped.current) {
      swiped.current = false;
      return;
    }
    setZoomed(true);
  };

  const arrowClass =
    "absolute top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center border border-border bg-background/85 text-foreground transition-colors hover:bg-background";

  return (
    <div className="space-y-3">
      {/* Ảnh chính */}
      <div
        className="relative aspect-[4/3] overflow-hidden border border-border bg-surface-muted"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button
          type="button"
          onClick={openZoom}
          aria-label={`Phóng to ảnh ${safeIndex + 1} trên ${count}`}
          className="group absolute inset-0 block cursor-zoom-in"
        >
          <Image
            src={productImageUrl(active.url)}
            alt={active.alt ?? name}
            fill
            priority
            quality={90}
            unoptimized
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-contain"
          />
          <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1 border border-border bg-background/85 px-2 py-1 text-[11px] uppercase tracking-widest text-muted opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            <ZoomIn className="size-3.5" />
            Phóng to
          </span>
        </button>

        {count > 1 ? (
          <>
            <button type="button" onClick={goPrev} aria-label="Ảnh trước" className={cn(arrowClass, "left-3")}>
              <ChevronLeft className="size-5" />
            </button>
            <button type="button" onClick={goNext} aria-label="Ảnh sau" className={cn(arrowClass, "right-3")}>
              <ChevronRight className="size-5" />
            </button>
            <span className="pointer-events-none absolute left-3 top-3 border border-border bg-background/85 px-2 py-1 text-[11px] tabular-nums text-muted">
              {safeIndex + 1} / {count}
            </span>
          </>
        ) : null}
      </div>

      {/* Ảnh thu nhỏ */}
      {count > 1 ? (
        <ul className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {gallery.map((image, index) => (
            <li key={image.id}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Xem ảnh ${index + 1}`}
                aria-current={index === safeIndex}
                className={cn(
                  "relative block aspect-square w-full overflow-hidden border bg-surface-muted",
                  index === safeIndex ? "border-accent" : "border-border hover:border-border-strong",
                )}
              >
                <Image
                  src={productImageUrl(image.url)}
                  alt=""
                  fill
                  unoptimized
                  sizes="120px"
                  className="object-contain"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {/* Phóng to */}
      <DialogPrimitive.Root open={zoomed} onOpenChange={setZoomed}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-charcoal/75 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content
            aria-describedby={undefined}
            className="fixed left-1/2 top-1/2 z-50 w-[94vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 border border-border bg-background p-3 shadow-xl data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
          >
            <DialogPrimitive.Title className="sr-only">{active.alt ?? name}</DialogPrimitive.Title>
            <div
              className="relative aspect-[4/3] w-full overflow-hidden bg-charcoal"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <Image
                src={productImageUrl(active.url)}
                alt={active.alt ?? name}
                fill
                quality={90}
                unoptimized
                sizes="94vw"
                className="object-contain"
              />
              {count > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Ảnh trước"
                    className={cn(arrowClass, "left-3")}
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Ảnh sau"
                    className={cn(arrowClass, "right-3")}
                  >
                    <ChevronRight className="size-5" />
                  </button>
                  <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 border border-border bg-background/85 px-2 py-1 text-[11px] tabular-nums text-muted">
                    {safeIndex + 1} / {count}
                  </span>
                </>
              ) : null}
            </div>
            <DialogPrimitive.Close
              aria-label="Đóng"
              className="absolute -right-3 -top-3 flex size-8 items-center justify-center border border-border bg-background text-foreground transition-colors hover:bg-surface-muted"
            >
              <X className="size-4" />
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  );
}
