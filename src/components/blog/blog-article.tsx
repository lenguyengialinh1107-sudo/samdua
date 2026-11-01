import Image from "next/image";
import { CalendarDays, Clock, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { blogCoverUrl, formatBlogDate } from "@/lib/blog/blog";
import { blogCategoryLabels } from "@/lib/blog/categories";
import { parseBlogContent } from "@/lib/blog/content";
import type { BlogPost } from "@/lib/blog/types";
import { toLocalImage } from "@/lib/images";

/**
 * Nội dung bài viết được render từ "markdown tối giản".
 * Dùng chung cho trang công khai và trang xem trước trong admin.
 */
export function BlogArticleBody({
  content,
  gallery = [],
  galleryAlt,
}: {
  content: string;
  gallery?: string[];
  galleryAlt?: string;
}) {
  const blocks = parseBlogContent(content);

  // Chèn ảnh minh hoạ vào giữa bài, trước mục thứ hai để nhịp đọc tự nhiên.
  const headingIndexes = blocks.reduce<number[]>(
    (acc, block, index) => (block.type === "heading" ? [...acc, index] : acc),
    [],
  );
  const galleryIndex = headingIndexes.length > 1 ? headingIndexes[1] : blocks.length;
  const showGallery = gallery.length > 0;

  const renderedBlocks = blocks.map((block, index) => {
    if (block.type === "heading") {
      return (
        <h2
          key={`${block.id}-${index}`}
          id={block.id}
          className="scroll-mt-24 pt-4 font-serif text-xl sm:text-2xl"
        >
          {block.text}
        </h2>
      );
    }

    if (block.type === "list") {
      return (
        <ul key={index} className="space-y-2 pl-5 text-muted">
          {block.items.map((item) => (
            <li key={item} className="list-disc">
              {item}
            </li>
          ))}
        </ul>
      );
    }

    if (block.type === "quote") {
      return (
        <blockquote
          key={index}
          className="border-l-2 border-accent bg-surface-muted/50 px-4 py-3 font-serif text-base italic sm:text-lg"
        >
          {block.text}
        </blockquote>
      );
    }

    return (
      <p key={index} className="text-muted">
        {block.text}
      </p>
    );
  });

  return (
    <div className="space-y-5 text-sm leading-relaxed sm:text-[15px]">
      {renderedBlocks.slice(0, galleryIndex)}
      {showGallery ? (
        <figure className="grid gap-4 sm:grid-cols-2">
          {gallery.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative aspect-[4/3] overflow-hidden border border-border bg-surface-muted"
            >
              <Image
                src={toLocalImage(url)}
                alt={galleryAlt ? `${galleryAlt} — ảnh minh hoạ ${index + 1}` : "Ảnh minh hoạ"}
                fill
                unoptimized
                sizes="(min-width: 640px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </figure>
      ) : null}
      {renderedBlocks.slice(galleryIndex)}
    </div>
  );
}

/** Đầu trang + ảnh bìa + nội dung — phần dùng chung giữa trang bài viết và xem trước. */
export function BlogArticle({ post }: { post: BlogPost }) {
  return (
    <article className="space-y-8">
      <header className="space-y-4 border-b border-border pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="accent">{blogCategoryLabels[post.categorySlug]}</Badge>
          {post.status === "DRAFT" ? <Badge variant="warning">Bản nháp</Badge> : null}
          {post.isFeatured ? <Badge variant="film">Nổi bật</Badge> : null}
        </div>

        <h1 className="font-serif text-3xl leading-tight sm:text-4xl">{post.title}</h1>

        <p className="max-w-2xl text-base text-muted">{post.excerpt}</p>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <UserRound className="size-3.5" aria-hidden />
            {post.author}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5" aria-hidden />
            <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden />
            {post.readingMinutes} phút đọc
          </span>
        </div>
      </header>

      <div className="relative aspect-[16/9] w-full overflow-hidden border border-border bg-surface-muted">
        <Image
          src={blogCoverUrl(post.coverImage)}
          alt={post.coverAlt || post.title}
          fill
          priority
          unoptimized
          sizes="(min-width: 1024px) 720px, 100vw"
          className="object-cover"
        />
      </div>

      <BlogArticleBody content={post.content} gallery={post.gallery} galleryAlt={post.title} />
    </article>
  );
}
