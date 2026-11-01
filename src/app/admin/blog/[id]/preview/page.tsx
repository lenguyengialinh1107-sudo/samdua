import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogArticle } from "@/components/blog/blog-article";
import { Button } from "@/components/ui/button";
import { findBlogPostById } from "@/server/repositories/blog.repository";

export const metadata: Metadata = { title: "Xem trước bài viết", robots: { index: false, follow: false } };

export default async function BlogPostPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = findBlogPostById(id);
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border border-warning/40 bg-warning/5 p-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-warning">Chế độ xem trước</p>
          <p className="text-xs text-muted">
            Đây là bản xem trước dành cho quản trị viên. Khách chỉ thấy bài viết khi trạng thái là
            &ldquo;Đã xuất bản&rdquo;.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/blog/${post.id}`}>Quay lại chỉnh sửa</Link>
          </Button>
          {post.status === "PUBLISHED" ? (
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/blog/${post.slug}`} target="_blank" rel="noreferrer">
                Xem trên cửa hàng ↗
              </Link>
            </Button>
          ) : null}
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl">
        <BlogArticle post={post} />
      </div>
    </div>
  );
}
