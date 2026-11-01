import { demoImage, toLocalImage } from "@/lib/images";

/** Ảnh bìa dự phòng khi bài viết chưa có ảnh. */
export const BLOG_FALLBACK_COVER = demoImage(
  "a 35mm film roll and a vintage camera resting on warm cream paper, soft window light, muted terracotta and brown analog palette, editorial still life",
  "landscape_4_3",
);

export const BLOG_COVER_SIZES = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

export function blogCoverUrl(url?: string | null): string {
  const trimmed = url?.trim();
  return trimmed ? toLocalImage(trimmed) : BLOG_FALLBACK_COVER;
}

export function blogPostHref(slug: string): string {
  return `/blog/${slug}`;
}

/** Nhận chuỗi "a, b, #c" và trả về danh sách thẻ đã chuẩn hoá. */
export function parseTagInput(raw: string): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const part of raw.split(",")) {
    const tag = part.trim().replace(/^#/, "").trim();
    if (!tag) continue;
    const key = tag.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(tag);
    if (result.length >= 12) break;
  }

  return result;
}

export function formatTagInput(tags: string[]): string {
  return tags.join(", ");
}

/** Nhận chuỗi nhiều dòng, mỗi dòng một URL ảnh. */
export function parseImageUrlLines(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "")
    .slice(0, 8);
}

/** Hiển thị ngày đăng theo định dạng tiếng Việt. */
export function formatBlogDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(date);
}
