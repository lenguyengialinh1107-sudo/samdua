export const FALLBACK_PRODUCT_IMAGE = "/placeholders/camera.svg";

export function productImageUrl(url?: string | null): string {
  if (!url) return FALLBACK_PRODUCT_IMAGE;
  const trimmed = url.trim();
  return trimmed === "" ? FALLBACK_PRODUCT_IMAGE : trimmed;
}

export function primaryImageUrl(images: { url: string }[] | undefined): string {
  return productImageUrl(images?.[0]?.url);
}

/**
 * Ảnh minh hoạ cho các khối giao diện (hero, banner danh mục).
 * Chỉ dùng cho phần trang trí — ảnh sản phẩm thật do admin nhập.
 */
export function demoImage(prompt: string, size: string = "landscape_4_3"): string {
  return `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
    prompt,
  )}&image_size=${size}`;
}
