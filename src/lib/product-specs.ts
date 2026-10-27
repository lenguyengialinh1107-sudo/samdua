/**
 * cameraSpecs lưu dạng JSONB. Trong form admin, người dùng nhập mỗi dòng
 * theo dạng `Tên thông số: giá trị`.
 */

export function parseSpecsText(text: string | null | undefined): Record<string, string> {
  if (!text) return {};
  const result: Record<string, string> = {};
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) {
      result[line] = "";
      continue;
    }
    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    if (key) result[key] = value;
  }
  return result;
}

export function formatSpecsText(specs: unknown): string {
  if (!specs || typeof specs !== "object" || Array.isArray(specs)) return "";
  return Object.entries(specs as Record<string, unknown>)
    .map(([key, value]) => `${key}: ${value ?? ""}`)
    .join("\n");
}

export function parseImageUrlsText(text: string | null | undefined): string[] {
  if (!text) return [];
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .slice(0, 12);
}
