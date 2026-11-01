import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { BlogCard } from "@/components/blog/blog-card";
import { BlogFilters } from "@/components/blog/blog-filters";
import { Pagination } from "@/components/product/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { blogCategories, findBlogCategory } from "@/lib/blog/categories";
import { BLOG_CATEGORY_SLUGS, type BlogCategorySlug } from "@/lib/blog/types";
import { demoImage } from "@/lib/images";
import { formatNumber } from "@/lib/format";
import { toQueryString, type SearchParamsRecord } from "@/lib/search-params";
import {
  countPublishedPostsByCategory,
  findFeaturedPosts,
  findPublishedPosts,
} from "@/server/repositories/blog.repository";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Góc nội dung của Second Shot: hướng dẫn cho người mới, review máy ảnh và cuộn film, mẹo chụp ảnh và câu chuyện cộng đồng chơi film.",
  alternates: { canonical: "/blog" },
};

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseCategory(value: string | undefined): BlogCategorySlug | undefined {
  return BLOG_CATEGORY_SLUGS.includes(value as BlogCategorySlug)
    ? (value as BlogCategorySlug)
    : undefined;
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsRecord>;
}) {
  const params = await searchParams;
  const q = first(params.q)?.trim() ?? "";
  const categorySlug = parseCategory(first(params.category));
  const page = Number.parseInt(first(params.page) ?? "1", 10) || 1;

  const [{ items, total, totalPages }, featured, counts] = await Promise.all([
    findPublishedPosts({ q, categorySlug, page }),
    findFeaturedPosts(3),
    Promise.resolve(countPublishedPostsByCategory()),
  ]);

  const activeCategory = findBlogCategory(categorySlug);
  const isBrowsing = !q && !categorySlug;
  const showFeatured = isBrowsing && featured.length > 0;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="text-xs text-muted">
        <ol className="flex gap-2">
          <li>
            <Link href="/" className="hover:text-accent">
              Trang chủ
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-foreground">Blog</li>
        </ol>
      </nav>

      <header className="mt-4 grid gap-6 border border-border bg-surface p-6 ah-paper sm:p-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div className="space-y-3">
          <p className="ah-label">Góc nội dung Second Shot</p>
          <h1 className="font-serif text-4xl sm:text-5xl">Blog</h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted">
            Khám phá kiến thức, cảm hứng và những câu chuyện về nhiếp ảnh film.
          </p>
          <p className="text-xs text-muted">
            {formatNumber(total)} bài viết · {blogCategories.length} chuyên mục
          </p>
        </div>

        <div className="relative hidden aspect-[4/3] overflow-hidden border border-border bg-surface-muted lg:block">
          <Image
            src={demoImage(
              "overhead cinematic shot of film photography essentials: a classic camera, several film rolls, an open notebook and a magnifying glass on a warm vintage wooden table, soft golden window light, analog cinematic aesthetic",
              "landscape_4_3",
            )}
            alt="Máy ảnh film, cuộn phim và sổ tay trên bàn gỗ vintage"
            fill
            unoptimized
            sizes="(min-width: 1024px) 380px, 100vw"
            className="object-cover"
          />
        </div>
      </header>

      <div className="mt-8">
        <BlogFilters q={q} categorySlug={categorySlug} counts={counts} />
      </div>

      {showFeatured ? (
        <section className="mt-12 space-y-5">
          <div className="flex items-end justify-between gap-3">
            <h2 className="font-serif text-2xl">Bài viết nổi bật</h2>
            <Link href="#tat-ca-bai-viet" className="text-sm text-accent hover:underline">
              Xem tất cả
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <BlogCard post={featured[0]} variant="featured" />

            <div className="flex flex-col gap-5 border border-border bg-surface p-5">
              <p className="ah-label">Đọc tiếp</p>
              <div className="space-y-4">
                {featured.slice(1).map((post) => (
                  <BlogCard key={post.id} post={post} variant="compact" />
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section id="tat-ca-bai-viet" className="mt-12 space-y-5 scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-3">
          <h2 className="font-serif text-2xl">
            {activeCategory ? activeCategory.name : q ? `Kết quả cho “${q}”` : "Tất cả bài viết"}
          </h2>
          {q || categorySlug ? (
            <Link href="/blog" className="text-sm text-accent hover:underline">
              Xoá bộ lọc
            </Link>
          ) : null}
        </div>

        {activeCategory?.description && !q ? (
          <p className="text-sm text-muted">{activeCategory.description}</p>
        ) : null}

        {items.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              buildHref={(target) => `/blog${toQueryString(params, { page: String(target) })}`}
            />
          </>
        ) : (
          <EmptyState
            title="Không tìm thấy bài viết phù hợp"
            description="Thử tìm với từ khoá khác hoặc chọn chuyên mục khác."
            action={
              <Link href="/blog" className="text-sm text-accent underline underline-offset-4">
                Xem tất cả bài viết
              </Link>
            }
          />
        )}
      </section>
    </div>
  );
}
