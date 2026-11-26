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
 *
 * `scale="0.0008"`: mô hình gốc rộng ~122 đơn vị; hệ số này quy đổi về đúng kích thước
 * thực tế (Canon PowerShot G9 X Mark II ~98mm ngang) khi đặt vào AR.
 */
export function ARViewer({ src, alt = "Mô hình 3D sản phẩm", poster }: ARViewerProps) {
  const viewerRef = React.useRef<HTMLElement>(null);
  const [hasError, setHasError] = React.useState(false);

  // Nạp web component ở phía client để tránh lỗi customElements khi server-render.
  React.useEffect(() => {
    void import("@google/model-viewer");
  }, []);

  // model-viewer phát sự kiện "error" khi không tải được mô hình → hiển thị thông báo.
  React.useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    const handleError = () => setHasError(true);
    viewer.addEventListener("error", handleError);
    return () => viewer.removeEventListener("error", handleError);
  }, []);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="relative aspect-[4/3] w-full overflow-hidden border border-border bg-surface-muted sm:aspect-video">
        <model-viewer
          ref={viewerRef}
          src={src}
          alt={alt}
          poster={poster}
          scale="0.0008"
          camera-orbit="auto auto auto"
          camera-target="auto auto auto"
          bounds="tight"
          loading="eager"
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

        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-muted/95 px-6 text-center">
            <p className="text-sm text-muted">
              Không tải được mô hình 3D. Vui lòng kiểm tra kết nối mạng và tải lại trang.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
