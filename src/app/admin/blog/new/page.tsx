import type { Metadata } from "next";
import Link from "next/link";

import { BlogForm } from "@/components/admin/blog-form";

export const metadata: Metadata = { title: "Thêm bài viết", robots: { index: false, follow: false } };

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="text-xs text-muted">
        <Link href="/admin/blog" className="hover:text-accent">
          Blog
        </Link>
        <span className="px-2" aria-hidden>
          /
        </span>
        <span className="text-foreground">Thêm mới</span>
      </nav>

      <header className="space-y-1">
        <h1 className="font-serif text-2xl">Thêm bài viết</h1>
        <p className="text-sm text-muted">
          Bài viết chỉ hiển thị với khách khi ở trạng thái &ldquo;Đã xuất bản&rdquo;.
        </p>
      </header>

      <BlogForm />
    </div>
  );
}
