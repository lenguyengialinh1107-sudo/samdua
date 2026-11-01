import { mockBlogPosts } from "@/lib/blog/mock-posts";
import type { BlogCategorySlug, BlogPost, BlogStatus } from "@/lib/blog/types";

/**
 * Repository của Blog.
 *
 * Hiện tại dữ liệu được giữ trong bộ nhớ và nạp từ `mock-posts.ts`, nhờ đó
 * website chạy được ngay mà không cần cấu hình backend. Toàn bộ giao diện và
 * server action chỉ đi qua lớp này, nên khi chuyển sang Headless CMS chỉ cần
 * thay phần thân của các hàm bên dưới.
 */
const globalForBlog = globalThis as unknown as {
  __secondShotBlogPosts?: Map<string, BlogPost>;
};

function getStore(): Map<string, BlogPost> {
  if (!globalForBlog.__secondShotBlogPosts) {
    globalForBlog.__secondShotBlogPosts = new Map(
      mockBlogPosts.map((post) => [
        post.id,
        { ...post, tags: [...post.tags], gallery: [...post.gallery] },
      ]),
    );
  }
  return globalForBlog.__secondShotBlogPosts;
}

export interface BlogPostFilters {
  q?: string;
  categorySlug?: BlogCategorySlug;
  page?: number;
  perPage?: number;
}

export interface AdminBlogPostFilters {
  q?: string;
  categorySlug?: BlogCategorySlug;
  status?: "all" | "draft" | "published";
  page?: number;
  perPage?: number;
}

export const BLOG_PER_PAGE = 6;
export const ADMIN_BLOG_PER_PAGE = 12;

function byNewest(a: BlogPost, b: BlogPost): number {
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
}

function matchesQuery(post: BlogPost, q: string): boolean {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  return [post.title, post.excerpt, post.author, post.content, post.tags.join(" ")]
    .join(" ")
    .toLowerCase()
    .includes(needle);
}

export function findPublishedPosts(filters: BlogPostFilters = {}) {
  const page = Math.max(1, filters.page ?? 1);
  const perPage = filters.perPage ?? BLOG_PER_PAGE;

  const all = [...getStore().values()]
    .filter((post) => post.status === "PUBLISHED")
    .filter((post) => (filters.categorySlug ? post.categorySlug === filters.categorySlug : true))
    .filter((post) => matchesQuery(post, filters.q ?? ""))
    .sort(byNewest);

  const total = all.length;
  const items = all.slice((page - 1) * perPage, (page - 1) * perPage + perPage);

  return {
    items,
    total,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
  };
}

export function findFeaturedPosts(limit = 3): BlogPost[] {
  return [...getStore().values()]
    .filter((post) => post.status === "PUBLISHED" && post.isFeatured)
    .sort(byNewest)
    .slice(0, limit);
}

export function findPublishedPostBySlug(slug: string): BlogPost | null {
  return (
    [...getStore().values()].find(
      (post) => post.slug === slug && post.status === "PUBLISHED",
    ) ?? null
  );
}

export function findBlogPostById(id: string): BlogPost | null {
  return getStore().get(id) ?? null;
}

export function findBlogPostBySlug(slug: string): BlogPost | null {
  return [...getStore().values()].find((post) => post.slug === slug) ?? null;
}

/** Bài viết liên quan: ưu tiên cùng danh mục, sau đó bù bằng bài mới nhất. */
export function findRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  const published = [...getStore().values()]
    .filter((item) => item.status === "PUBLISHED" && item.id !== post.id)
    .sort(byNewest);

  const sameCategory = published.filter((item) => item.categorySlug === post.categorySlug);
  const others = published.filter((item) => item.categorySlug !== post.categorySlug);

  return [...sameCategory, ...others].slice(0, limit);
}

export function findPublishedBlogSlugs() {
  return [...getStore().values()]
    .filter((post) => post.status === "PUBLISHED")
    .map((post) => ({ slug: post.slug, updatedAt: post.updatedAt }))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function countPublishedPostsByCategory(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const post of getStore().values()) {
    if (post.status !== "PUBLISHED") continue;
    counts[post.categorySlug] = (counts[post.categorySlug] ?? 0) + 1;
  }
  return counts;
}

export function listAdminBlogPosts(filters: AdminBlogPostFilters = {}) {
  const page = Math.max(1, filters.page ?? 1);
  const perPage = filters.perPage ?? ADMIN_BLOG_PER_PAGE;

  const all = [...getStore().values()]
    .filter((post) => (filters.categorySlug ? post.categorySlug === filters.categorySlug : true))
    .filter((post) => {
      if (filters.status === "draft") return post.status === "DRAFT";
      if (filters.status === "published") return post.status === "PUBLISHED";
      return true;
    })
    .filter((post) => matchesQuery(post, filters.q ?? ""))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const total = all.length;
  const items = all.slice((page - 1) * perPage, (page - 1) * perPage + perPage);

  return {
    items,
    total,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
  };
}

export function getBlogStats() {
  const posts = [...getStore().values()];
  return {
    total: posts.length,
    published: posts.filter((post) => post.status === "PUBLISHED").length,
    drafts: posts.filter((post) => post.status === "DRAFT").length,
    featured: posts.filter((post) => post.isFeatured && post.status === "PUBLISHED").length,
  };
}

/** Ghi dữ liệu — dùng bởi service. */
export function insertBlogPost(post: BlogPost): BlogPost {
  getStore().set(post.id, post);
  return post;
}

export function updateBlogPostRecord(id: string, patch: Partial<BlogPost>): BlogPost | null {
  const current = getStore().get(id);
  if (!current) return null;

  const next: BlogPost = { ...current, ...patch, id: current.id };
  getStore().set(id, next);
  return next;
}

export function removeBlogPost(id: string): boolean {
  return getStore().delete(id);
}

export function setBlogPostStatus(id: string, status: BlogStatus): BlogPost | null {
  return updateBlogPostRecord(id, { status });
}
