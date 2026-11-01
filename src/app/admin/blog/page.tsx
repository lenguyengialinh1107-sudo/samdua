import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Plus } from "lucide-react";

import { DeleteBlogPostButton, ToggleBlogStatusButton } from "@/components/admin/blog-actions";
import { Pagination } from "@/components/product/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input, Select } from "@/components/ui/input";
import { blogCoverUrl, formatBlogDate } from "@/lib/blog/blog";
import { blogCategories, blogCategoryLabels, findBlogCategory } from "@/lib/blog/categories";
import { BLOG_CATEGORY_SLUGS, type BlogCategorySlug } from "@/lib/blog/types";
import { formatNumber } from "@/lib/format";
import { toQueryString, type SearchParamsRecord } from "@/lib/search-params";
import { getBlogStats, listAdminBlogPosts } from "@/server/repositories/blog.repository";

export const metadata: Metadata = { title: "Blog", robots: { index: false, follow: false } };

const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "published", label: "Đã xuất bản" },
  { value: "draft", label: "Bản nháp" },
] as const;

type StatusValue = (typeof STATUS_OPTIONS)[number]["value"];

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseStatus(value: string | undefined): StatusValue {
  return STATUS_OPTIONS.some((option) => option.value === value)
    ? (value as StatusValue)
    : "all";
}

function parseCategory(value: string | undefined): BlogCategorySlug | undefined {
  return BLOG_CATEGORY_SLUGS.includes(value as BlogCategorySlug)
    ? (value as BlogCategorySlug)
    : undefined;
}

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsRecord>;
}) {
  const params = await searchParams;
  const q = first(params.q) ?? "";
  const status = parseStatus(first(params.status));
  const categorySlug = parseCategory(first(params.category));
  const page = Number.parseInt(first(params.page) ?? "1", 10) || 1;

  const [{ items, totalPages }, stats] = await Promise.all([
    listAdminBlogPosts({ q, status, categorySlug, page }),
    Promise.resolve(getBlogStats()),
  ]);

  const activeCategory = findBlogCategory(categorySlug);

  const statCards = [
    { label: "Tổng bài viết", value: stats.total },
    { label: "Đã xuất bản", value: stats.published },
    { label: "Bản nháp", value: stats.drafts },
    { label: "Đang nổi bật", value: stats.featured },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl">Blog</h1>
          <p className="text-sm text-muted">
            Quản lý bài viết, bản nháp và trạng thái xuất bản.
          </p>
        </div>
        <Button variant="accent" asChild>
          <Link href="/admin/blog/new">
            <Plus />
            Thêm bài viết
          </Link>
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="border border-border bg-surface p-4">
            <p className="ah-label">{card.label}</p>
            <p className="mt-2 font-serif text-2xl">{formatNumber(card.value)}</p>
          </div>
        ))}
      </div>

      <form action="/admin/blog" method="get" className="flex flex-wrap gap-3">
        <Input
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Tìm theo tiêu đề, thẻ, nội dung…"
          className="max-w-xs"
        />
        <Select name="category" defaultValue={categorySlug ?? ""} className="max-w-[220px]">
          <option value="">Tất cả danh mục</option>
          {blogCategories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </Select>
        <Select name="status" defaultValue={status} className="max-w-[180px]">
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Button type="submit" variant="outline">
          Lọc
        </Button>
      </form>

      {items.length === 0 ? (
        <EmptyState
          title="Không có bài viết nào"
          description="Thử đổi bộ lọc hoặc tạo bài viết mới."
          action={
            <Button variant="accent" asChild>
              <Link href="/admin/blog/new">Thêm bài viết</Link>
            </Button>
          }
        />
      ) : (
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-surface-muted/60 text-left">
              <tr>
                <th scope="col" className="px-4 py-2 font-medium">
                  Bài viết
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  Danh mục
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  Trạng thái
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  Cập nhật
                </th>
                <th scope="col" className="px-4 py-2 text-right font-medium">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {items.map((post) => (
                <tr key={post.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={blogCoverUrl(post.coverImage)}
                        alt=""
                        width={56}
                        height={42}
                        unoptimized
                        className="h-10 w-14 shrink-0 border border-border object-cover"
                      />
                      <div className="min-w-0">
                        <Link
                          href={`/admin/blog/${post.id}`}
                          className="block truncate hover:text-accent"
                        >
                          {post.title}
                        </Link>
                        <span className="block truncate font-mono text-xs text-muted">
                          /blog/{post.slug}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {blogCategoryLabels[post.categorySlug]}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {post.status === "PUBLISHED" ? (
                        <Badge variant="success">Đã xuất bản</Badge>
                      ) : (
                        <Badge variant="warning">Bản nháp</Badge>
                      )}
                      {post.isFeatured ? <Badge variant="accent">Nổi bật</Badge> : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">{formatBlogDate(post.updatedAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/blog/${post.id}`}>Sửa</Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/blog/${post.id}/preview`} target="_blank" rel="noreferrer">
                          <ExternalLink />
                          Xem trước
                        </Link>
                      </Button>
                      <ToggleBlogStatusButton id={post.id} status={post.status} />
                      <DeleteBlogPostButton id={post.id} title={post.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeCategory ? (
        <p className="text-xs text-muted">
          Đang lọc theo danh mục: {activeCategory.name}
        </p>
      ) : null}

      <Pagination
        page={page}
        totalPages={totalPages}
        buildHref={(target) => `/admin/blog${toQueryString(params, { page: String(target) })}`}
      />
    </div>
  );
}
