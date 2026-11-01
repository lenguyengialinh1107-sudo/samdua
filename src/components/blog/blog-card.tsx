import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { blogCategoryLabels } from "@/lib/blog/categories";
import { blogCoverUrl, blogPostHref, formatBlogDate } from "@/lib/blog/blog";
import type { BlogPost } from "@/lib/blog/types";
import { cn } from "@/lib/utils";

/**
 * Card bài viết dùng chung cho trang Blog, bài nổi bật và bài viết liên quan.
 */
export function BlogCard({
  post,
  variant = "default",
}: {
  post: BlogPost;
  variant?: "default" | "featured" | "compact";
}) {
  const href = blogPostHref(post.slug);

  if (variant === "compact") {
    return (
      <article className="flex gap-4 border-b border-border pb-4 last:border-0 last:pb-0">
        <Link
          href={href}
          className="relative block aspect-square w-20 shrink-0 overflow-hidden bg-surface-muted sm:w-24"
        >
          <Image
            src={blogCoverUrl(post.coverImage)}
            alt={post.coverAlt || post.title}
            fill
            unoptimized
            sizes="96px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </Link>
        <div className="min-w-0 space-y-1">
          <p className="ah-label">{blogCategoryLabels[post.categorySlug]}</p>
          <h3 className="font-serif text-sm leading-snug">
            <Link href={href} className="hover:text-accent">
              {post.title}
            </Link>
          </h3>
          <p className="text-xs text-muted">
            {formatBlogDate(post.publishedAt)} · {post.readingMinutes} phút đọc
          </p>
        </div>
      </article>
    );
  }

  const featured = variant === "featured";

  return (
    <article className="group flex h-full flex-col border border-border bg-surface transition-colors hover:border-border-strong">
      <Link
        href={href}
        className={cn(
          "relative block overflow-hidden bg-surface-muted",
          featured ? "aspect-[16/9]" : "aspect-[4/3]",
        )}
      >
        <Image
          src={blogCoverUrl(post.coverImage)}
          alt={post.coverAlt || post.title}
          fill
          unoptimized
          sizes={featured ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {post.isFeatured ? (
          <span className="absolute left-3 top-3">
            <Badge variant="accent">Nổi bật</Badge>
          </span>
        ) : null}
      </Link>

      <div className={cn("flex flex-1 flex-col gap-2 p-5", featured && "sm:p-6")}>
        <p className="ah-label">{blogCategoryLabels[post.categorySlug]}</p>

        <h3
          className={cn(
            "font-serif leading-snug",
            featured ? "text-xl sm:text-2xl" : "text-base",
          )}
        >
          <Link href={href} className="hover:text-accent">
            {post.title}
          </Link>
        </h3>

        <p className={cn("text-sm text-muted", featured ? "line-clamp-3" : "line-clamp-3")}>
          {post.excerpt}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-3 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5" aria-hidden />
            <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden />
            {post.readingMinutes} phút đọc
          </span>
        </div>

        <Link
          href={href}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
        >
          Đọc thêm
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
