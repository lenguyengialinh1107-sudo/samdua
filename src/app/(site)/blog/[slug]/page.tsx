import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { BlogArticle } from "@/components/blog/blog-article";
import { BlogCard } from "@/components/blog/blog-card";
import { BlogShare } from "@/components/blog/blog-share";
import { BlogTableOfContents } from "@/components/blog/blog-table-of-contents";
import { Badge } from "@/components/ui/badge";
import { blogCoverUrl } from "@/lib/blog/blog";
import { blogCategoryLabels } from "@/lib/blog/categories";
import { blogTableOfContents } from "@/lib/blog/content";
import { site } from "@/lib/site";
import {
  findPublishedPostBySlug,
  findRelatedPosts,
} from "@/server/repositories/blog.repository";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = findPublishedPostBySlug(slug);
  if (!post) return { title: "Không tìm thấy bài viết" };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      tags: post.tags,
      images: [{ url: blogCoverUrl(post.coverImage) }],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = findPublishedPostBySlug(slug);
  if (!post) notFound();

  const related = findRelatedPosts(post, 3);
  const toc = blogTableOfContents(post.content);
  const shareUrl = `${site.url}/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: [blogCoverUrl(post.coverImage)],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: site.name },
    articleSection: blogCategoryLabels[post.categorySlug],
    keywords: post.tags.join(", "),
    mainEntityOfPage: shareUrl,
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        // Nội dung JSON-LD do server tạo từ dữ liệu bài viết.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="text-xs text-muted">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/" className="hover:text-accent">
              Trang chủ
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/blog" className="hover:text-accent">
              Blog
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-foreground">{blogCategoryLabels[post.categorySlug]}</li>
        </ol>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div className="min-w-0">
          <BlogArticle post={post} />

          {post.tags.length > 0 ? (
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="ah-label">Thẻ</span>
              {post.tags.map((tag) => (
                <Badge key={tag} variant="default">
                  #{tag}
                </Badge>
              ))}
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
            <BlogShare url={shareUrl} title={post.title} />
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Về trang Blog
            </Link>
          </div>

          {related.length > 0 ? (
            <section className="mt-12 space-y-5 border-t border-border pt-8">
              <h2 className="font-serif text-2xl">Bài viết liên quan</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <BlogCard key={item.id} post={item} />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="border border-border bg-surface p-5">
            <BlogTableOfContents items={toc} />

            <div className="mt-6 space-y-2 border-t border-border pt-5">
              <p className="ah-label">Cần tư vấn?</p>
              <p className="text-xs text-muted">
                Ghé cửa hàng hoặc gọi hotline {site.hotline} để được tư vấn máy và film.
              </p>
              <Link
                href="/products"
                className="inline-block text-sm text-accent hover:underline"
              >
                Xem sản phẩm →
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
