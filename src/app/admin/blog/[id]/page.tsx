import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogForm } from "@/components/admin/blog-form";
import { findBlogPostById } from "@/server/repositories/blog.repository";

export const metadata: Metadata = { title: "Sửa bài viết", robots: { index: false, follow: false } };

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = findBlogPostById(id);
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="text-xs text-muted">
        <Link href="/admin/blog" className="hover:text-accent">
          Blog
        </Link>
        <span className="px-2" aria-hidden>
          /
        </span>
        <span className="text-foreground">{post.title}</span>
      </nav>

      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl">Sửa bài viết</h1>
          <p className="font-mono text-xs text-muted">/blog/{post.slug}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href={`/admin/blog/${post.id}/preview`}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-accent hover:underline"
          >
            Xem trước ↗
          </Link>
          {post.status === "PUBLISHED" ? (
            <Link
              href={`/blog/${post.slug}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-accent hover:underline"
            >
              Xem trên cửa hàng ↗
            </Link>
          ) : null}
        </div>
      </header>

      <BlogForm
        post={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          categorySlug: post.categorySlug,
          tags: post.tags,
          coverImage: post.coverImage,
          coverAlt: post.coverAlt,
          gallery: post.gallery,
          author: post.author,
          readingMinutes: post.readingMinutes,
          isFeatured: post.isFeatured,
          status: post.status,
          content: post.content,
        }}
      />
    </div>
  );
}
