import Link from "next/link";

import { cn } from "@/lib/utils";

function buildRange(current: number, total: number): (number | "gap")[] {
  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);

  const result: (number | "gap")[] = [];
  let previous = 0;
  for (const page of sorted) {
    if (previous && page - previous > 1) result.push("gap");
    result.push(page);
    previous = page;
  }
  return result;
}

export function Pagination({
  page,
  totalPages,
  buildHref,
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const linkClass =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-sm border border-border-strong bg-surface px-3 text-sm hover:border-film";

  return (
    <nav aria-label="Phân trang" className="flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={buildHref(page - 1)} className={linkClass} rel="prev">
          Trước
        </Link>
      ) : (
        <span className={cn(linkClass, "pointer-events-none opacity-40")}>Trước</span>
      )}

      {buildRange(page, totalPages).map((item, index) =>
        item === "gap" ? (
          <span key={`gap-${index}`} className="px-1 text-muted">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={buildHref(item)}
            aria-current={item === page ? "page" : undefined}
            className={cn(
              linkClass,
              item === page && "border-accent bg-accent text-accent-foreground hover:border-accent",
            )}
          >
            {item}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link href={buildHref(page + 1)} className={linkClass} rel="next">
          Sau
        </Link>
      ) : (
        <span className={cn(linkClass, "pointer-events-none opacity-40")}>Sau</span>
      )}
    </nav>
  );
}
