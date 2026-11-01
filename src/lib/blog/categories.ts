import type { BlogCategory, BlogCategorySlug } from "./types";

/** Danh mục bài viết của Blog. Sửa tại đây khi thêm/bớt chuyên mục. */
export const blogCategories: BlogCategory[] = [
  {
    slug: "huong-dan-cho-nguoi-moi",
    name: "Hướng dẫn cho người mới",
    description: "Những kiến thức nền tảng để bắt đầu chơi ảnh film đúng cách.",
  },
  {
    slug: "review-may-anh",
    name: "Review máy ảnh",
    description: "Cảm nhận thực tế về các dòng máy film, compact và digital.",
  },
  {
    slug: "review-cuon-film",
    name: "Review cuộn film",
    description: "So sánh tông màu, hạt film và đặc tính của từng loại phim.",
  },
  {
    slug: "meo-chup-anh",
    name: "Mẹo chụp ảnh",
    description: "Kinh nghiệm đo sáng, bố cục và xử lý tình huống khi chụp.",
  },
  {
    slug: "cau-chuyen-cong-dong",
    name: "Câu chuyện cộng đồng",
    description: "Chuyện nghề, chuyện người và những chuyến đi cùng máy film.",
  },
];

export const blogCategoryLabels: Record<BlogCategorySlug, string> = Object.fromEntries(
  blogCategories.map((category) => [category.slug, category.name]),
) as Record<BlogCategorySlug, string>;

export function findBlogCategory(slug?: string | null): BlogCategory | undefined {
  if (!slug) return undefined;
  return blogCategories.find((category) => category.slug === slug);
}
