"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/** Mục lục tự động, tự làm nổi bật mục đang xem khi cuộn trang. */
export function BlogTableOfContents({
  items,
  className,
}: {
  items: { id: string; text: string }[];
  className?: string;
}) {
  const [active, setActive] = React.useState(items[0]?.id ?? "");
  const key = items.map((item) => item.id).join("|");

  React.useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: [0, 1] },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Mục lục bài viết" className={cn("space-y-3", className)}>
      <p className="ah-label">Mục lục</p>
      <ol className="space-y-2 border-l border-border pl-4">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                "block text-sm transition-colors",
                active === item.id
                  ? "text-accent"
                  : "text-muted hover:text-foreground",
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
