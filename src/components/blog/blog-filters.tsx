import Link from "next/link";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { blogCategories } from "@/lib/blog/categories";
import { cn } from "@/lib/utils";

function buildHref(params: { q?: string; category?: string }): string {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.category) search.set("category", params.category);
  const query = search.toString();
  return query ? `/blog?${query}` : "/blog";
}

/**
 * Tìm kiếm và lọc bài viết theo danh mục.
 * Dùng form GET thuần: mọi trạng thái nằm trên URL nên chia sẻ được.
 */
export function BlogFilters({
  q,
  categorySlug,
  counts,
}: {
  q: string;
  categorySlug?: string;
  counts: Record<string, number>;
}) {
  return (
    <div className="space-y-5">
      <form action="/blog" method="get" role="search" className="flex flex-wrap gap-2">
        {categorySlug ? <input type="hidden" name="category" value={categorySlug} /> : null}
        <label htmlFor="blog-search" className="sr-only">
          Tìm kiếm bài viết
        </label>
        <Input
          id="blog-search"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Tìm bài viết theo tiêu đề, thẻ, nội dung…"
          className="h-10 min-w-0 flex-1"
        />
        <Button type="submit" variant="default" className="shrink-0">
          <Search />
          Tìm kiếm
        </Button>
      </form>

      <div className="flex flex-wrap gap-2">
        <Link
          href={buildHref({ q })}
          className={cn(
            "border px-3 py-1.5 text-xs uppercase tracking-wider transition-colors",
            !categorySlug
              ? "border-accent bg-accent text-accent-foreground"
              : "border-border-strong bg-surface text-muted hover:border-film hover:text-foreground",
          )}
        >
          Tất cả
        </Link>
        {blogCategories.map((category) => {
          const active = categorySlug === category.slug;
          return (
            <Link
              key={category.slug}
              href={buildHref({ q, category: category.slug })}
              className={cn(
                "border px-3 py-1.5 text-xs uppercase tracking-wider transition-colors",
                active
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border-strong bg-surface text-muted hover:border-film hover:text-foreground",
              )}
            >
              {category.name}
              <span className={cn("ml-1.5", active ? "text-accent-foreground/75" : "text-muted/70")}>
                {counts[category.slug] ?? 0}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
