import { parseImageUrlLines, parseTagInput } from "@/lib/blog/blog";
import { estimateReadingMinutes } from "@/lib/blog/content";
import type { BlogPost, BlogStatus } from "@/lib/blog/types";
import { slugify } from "@/lib/format";
import type { BlogPostFormValues } from "@/lib/validations/blog";
import {
  findBlogPostById,
  findBlogPostBySlug,
  insertBlogPost,
  removeBlogPost,
  updateBlogPostRecord,
} from "@/server/repositories/blog.repository";

/**
 * Nghiệp vụ của Blog. Tách khỏi repository để khi thay bằng Headless CMS
 * chỉ cần chỉnh phần đọc/ghi dữ liệu, không ảnh hưởng tới luồng xử lý.
 */

function ensureUniqueSlug(base: string, ignoreId: string | null): string {
  const seed = base || "bai-viet";
  let candidate = seed;
  let counter = 2;

  for (;;) {
    const existing = findBlogPostBySlug(candidate);
    if (!existing || existing.id === ignoreId) return candidate;
    candidate = `${seed}-${counter}`;
    counter += 1;
  }
}

function readMinutes(values: BlogPostFormValues): number {
  const parsed = Number.parseInt(values.readingMinutes, 10);
  if (Number.isInteger(parsed) && parsed > 0) return parsed;
  return estimateReadingMinutes(values.content);
}

export function createBlogPost(values: BlogPostFormValues): BlogPost {
  const now = new Date().toISOString();
  const slug = ensureUniqueSlug(slugify(values.slug || values.title), null);

  return insertBlogPost({
    id: `post-${crypto.randomUUID()}`,
    slug,
    title: values.title,
    excerpt: values.excerpt,
    categorySlug: values.categorySlug,
    tags: parseTagInput(values.tags),
    coverImage: values.coverImage,
    coverAlt: values.coverAlt || values.title,
    gallery: parseImageUrlLines(values.galleryImages),
    author: values.author,
    publishedAt: now,
    readingMinutes: readMinutes(values),
    isFeatured: values.isFeatured,
    status: values.status,
    content: values.content,
    updatedAt: now,
  });
}

export function updateBlogPost(id: string, values: BlogPostFormValues): BlogPost | null {
  const current = findBlogPostById(id);
  if (!current) return null;

  const now = new Date().toISOString();
  const slug = ensureUniqueSlug(slugify(values.slug || values.title), id);
  // Xuất bản lần đầu (từ bản nháp) thì lấy thời điểm hiện tại làm ngày đăng.
  const publishedAt =
    values.status === "PUBLISHED" && current.status === "DRAFT" ? now : current.publishedAt;

  return updateBlogPostRecord(id, {
    slug,
    title: values.title,
    excerpt: values.excerpt,
    categorySlug: values.categorySlug,
    tags: parseTagInput(values.tags),
    coverImage: values.coverImage,
    coverAlt: values.coverAlt || values.title,
    gallery: parseImageUrlLines(values.galleryImages),
    author: values.author,
    publishedAt,
    readingMinutes: readMinutes(values),
    isFeatured: values.isFeatured,
    status: values.status,
    content: values.content,
    updatedAt: now,
  });
}

export function updateBlogPostStatus(id: string, status: BlogStatus): BlogPost | null {
  const current = findBlogPostById(id);
  if (!current) return null;

  return updateBlogPostRecord(id, {
    status,
    updatedAt: new Date().toISOString(),
    publishedAt: status === "PUBLISHED" && current.status === "DRAFT"
      ? new Date().toISOString()
      : current.publishedAt,
  });
}

export function deleteBlogPost(id: string): boolean {
  return removeBlogPost(id);
}
