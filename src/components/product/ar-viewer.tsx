"use client";

import { Camera } from "lucide-react";
import * as React from "react";

interface ARViewerProps {
  /** Đường dẫn tới mô hình 3D (.glb). */
  src: string;
  /** Mô tả mô hình cho trình đọc màn hình. */
  alt?: string;
  /** Ảnh poster hiển thị trong lúc mô hình đang tải. */
  poster?: string;
}

/**
 * Khung trải nghiệm 3D / AR bằng thẻ <model-viewer> của Google.
 * Trên điện thoại, người dùng bấm nút để mở camera sau và đặt mô hình xuống mặt bàn ngoài đời thật.
 */
export function ARViewer({ src, alt = "Mô hình 3D sản phẩm", poster }: ARViewerProps) {
  // Nạp web component ở phía client để tránh lỗi customElements khi server-render.
  React.useEffect(() => {
    void import("@google/model-viewer");
  }, []);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="relative aspect-[4/3] w-full overflow-hidden border border-border bg-surface-muted sm:aspect-video">
        <model-viewer
          src={src}
          alt={alt}
          poster={poster}
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-scale="fixed"
          camera-controls
          auto-rotate
          shadow-intensity="1.2"
          shadow-softness="0.8"
          className="block h-full w-full"
        >
          <button
            type="button"
            slot="ar-button"
            className="absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-sm bg-accent px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-accent-foreground shadow-lg transition-colors hover:bg-accent-hover"
          >
            <Camera className="size-4" />
            Mở Camera xem ngoài đời thật (AR)
          </button>
        </model-viewer>
      </div>
    </div>
  );
}
