import { z } from "zod";

import { BLOG_CATEGORY_SLUGS, BLOG_STATUSES } from "@/lib/blog/types";

const integerString = (label: string, max = 4) =>
  z
    .string()
    .trim()
    .regex(new RegExp(`^\\d{1,${max}}$`), `${label} phải là số nguyên không âm`);

/**
 * Schema dùng chung cho form admin (client) và server action.
 * Nội dung bài viết dùng "markdown tối giản" để sinh mục lục tự động.
 */
export const blogPostFormSchema = z.object({
  title: z.string().trim().min(5, "Tiêu đề tối thiểu 5 ký tự").max(180),
  slug: z
    .string()
    .trim()
    .min(3, "Slug tối thiểu 3 ký tự")
    .max(90)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chỉ gồm chữ thường, số và dấu gạch ngang"),
  excerpt: z.string().trim().min(20, "Mô tả ngắn tối thiểu 20 ký tự").max(320),
  categorySlug: z.enum(BLOG_CATEGORY_SLUGS),
  tags: z.string().trim().max(400),
  coverImage: z.string().trim().max(2000),
  coverAlt: z.string().trim().max(200),
  /** Mỗi dòng một URL ảnh minh hoạ. */
  galleryImages: z.string().trim().max(4000),
  author: z.string().trim().min(1, "Vui lòng nhập tác giả").max(80),
  readingMinutes: integerString("Thời gian đọc", 3),
  content: z.string().trim().min(50, "Nội dung tối thiểu 50 ký tự").max(20000),
  isFeatured: z.boolean(),
  status: z.enum(BLOG_STATUSES),
});

export type BlogPostFormValues = z.infer<typeof blogPostFormSchema>;
