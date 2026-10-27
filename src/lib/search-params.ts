/**
 * Tiện ích dựng query string cho các trang danh sách.
 * Dùng để giữ nguyên bộ lọc hiện tại khi chuyển trang hoặc đổi kiểu sắp xếp.
 */

export type SearchParamValue = string | string[] | undefined;
export type SearchParamsRecord = Record<string, SearchParamValue>;

/** Ghép query string từ bộ lọc hiện tại, cho phép ghi đè một số khoá. */
export function toQueryString(
  params: SearchParamsRecord,
  overrides: Record<string, string | undefined> = {},
): string {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    for (const item of Array.isArray(value) ? value : [value]) {
      if (item !== "") search.append(key, item);
    }
  }

  for (const [key, value] of Object.entries(overrides)) {
    search.delete(key);
    if (value !== undefined && value !== "") search.append(key, value);
  }

  const query = search.toString();
  return query ? `?${query}` : "";
}
