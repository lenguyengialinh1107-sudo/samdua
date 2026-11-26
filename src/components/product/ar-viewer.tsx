interface ARViewerProps {
  /** Tiêu đề mô hình 3D (dùng cho thuộc tính title và nội dung ghi nguồn). */
  title: string;
  /** Đường dẫn nhúng iframe (Sketchfab). */
  src: string;
  /** Link tới trang mô hình gốc. */
  href: string;
  /** Tên tác giả mô hình. */
  authorName: string;
  /** Link tới trang tác giả. */
  authorUrl: string;
}

/**
 * Khung trải nghiệm 3D / AR bằng iframe Sketchfab.
 * Tự co giãn theo tỉ lệ khung (4/3 trên mobile, 16/9 trên màn lớn) và căn giữa.
 */
export function ARViewer({ title, src, href, authorName, authorUrl }: ARViewerProps) {
  const linkClass = "font-semibold text-accent transition-colors hover:text-accent-hover";

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="relative aspect-[4/3] w-full overflow-hidden border border-border bg-charcoal sm:aspect-video">
        <iframe
          title={title}
          src={src}
          className="absolute inset-0 h-full w-full"
          frameBorder={0}
          allow="autoplay; fullscreen; xr-spatial-tracking; web-share"
          allowFullScreen
        />
      </div>
      <p className="mt-3 text-center text-xs text-muted">
        <a href={href} target="_blank" rel="nofollow noopener noreferrer" className={linkClass}>
          {title}
        </a>{" "}
        by{" "}
        <a href={authorUrl} target="_blank" rel="nofollow noopener noreferrer" className={linkClass}>
          {authorName}
        </a>{" "}
        on{" "}
        <a
          href="https://sketchfab.com"
          target="_blank"
          rel="nofollow noopener noreferrer"
          className={linkClass}
        >
          Sketchfab
        </a>
      </p>
    </div>
  );
}
