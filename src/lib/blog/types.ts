/**
 * Kiểu dữ liệu cho hệ thống Blog.
 *
 * Toàn bộ tầng dữ liệu chỉ phụ thuộc vào các kiểu này, nhờ đó có thể thay
 * nguồn dữ liệu mẫu bằng Headless CMS (Supabase, Firebase, Sanity…) sau này
 * mà không cần sửa giao diện.
 */

export const BLOG_CATEGORY_SLUGS = [
  "huong-dan-cho-nguoi-moi",
  "review-may-anh",
  "review-cuon-film",
  "meo-chup-anh",
  "cau-chuyen-cong-dong",
] as const;

export type BlogCategorySlug = (typeof BLOG_CATEGORY_SLUGS)[number];

export const BLOG_STATUSES = ["DRAFT", "PUBLISHED"] as const;

export type BlogStatus = (typeof BLOG_STATUSES)[number];

export interface BlogCategory {
  slug: BlogCategorySlug;
  name: string;
  description: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  /** Mô tả ngắn hiển thị trên card và trong kết quả tìm kiếm. */
  excerpt: string;
  categorySlug: BlogCategorySlug;
  tags: string[];
  coverImage: string;
  coverAlt: string;
  /** Ảnh minh hoạ chèn trong nội dung bài viết. */
  gallery: string[];
  author: string;
  /** ISO string — giữ ở dạng chuỗi để dễ serialize qua server action. */
  publishedAt: string;
  readingMinutes: number;
  isFeatured: boolean;
  status: BlogStatus;
  /** Nội dung dạng "markdown tối giản" (xem `content.ts`). */
  content: string;
  updatedAt: string;
}

/** Khối nội dung sau khi phân tích, dùng để render và sinh mục lục. */
export type BlogBlock =
  | { type: "heading"; id: string; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string };
