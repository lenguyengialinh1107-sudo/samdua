import { slugify } from "@/lib/format";

import type { BlogBlock } from "./types";

/**
 * Bộ phân tích nội dung bài viết.
 *
 * Nội dung được soạn ở dạng "markdown tối giản" để admin nhập liệu nhanh,
 * nhưng vẫn đủ cấu trúc cho mục lục tự động:
 *
 *   ## Tiêu đề mục        -> tiêu đề (xuất hiện trong mục lục)
 *   - gạch đầu dòng       -> danh sách
 *   > trích dẫn           -> khối trích dẫn
 *   Dòng trống            -> ngăn cách các khối
 *   Dòng còn lại          -> đoạn văn
 */
export function parseBlogContent(markdown: string): BlogBlock[] {
  const blocks: BlogBlock[] = [];
  const usedIds = new Map<string, number>();
  let listBuffer: string[] = [];

  const flushList = () => {
    if (listBuffer.length > 0) {
      blocks.push({ type: "list", items: listBuffer });
      listBuffer = [];
    }
  };

  for (const rawLine of markdown.replace(/\r\n/g, "\n").split("\n")) {
    const line = rawLine.trim();

    if (line === "") {
      flushList();
      continue;
    }

    if (line.startsWith("## ")) {
      flushList();
      const text = line.slice(3).trim();
      if (!text) continue;

      const base = slugify(text) || "muc";
      const seen = usedIds.get(base) ?? 0;
      usedIds.set(base, seen + 1);
      const id = seen === 0 ? base : `${base}-${seen + 1}`;

      blocks.push({ type: "heading", id, text });
      continue;
    }

    if (line.startsWith("> ")) {
      flushList();
      blocks.push({ type: "quote", text: line.slice(2).trim() });
      continue;
    }

    if (line.startsWith("- ")) {
      listBuffer.push(line.slice(2).trim());
      continue;
    }

    flushList();
    blocks.push({ type: "paragraph", text: line });
  }

  flushList();
  return blocks;
}

/** Lấy danh sách tiêu đề để dựng mục lục. */
export function blogTableOfContents(markdown: string): { id: string; text: string }[] {
  return parseBlogContent(markdown)
    .filter((block): block is Extract<BlogBlock, { type: "heading" }> => block.type === "heading")
    .map((block) => ({ id: block.id, text: block.text }));
}

/** Thời gian đọc ước tính, tối thiểu 1 phút. */
export function estimateReadingMinutes(markdown: string): number {
  const words = markdown.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
