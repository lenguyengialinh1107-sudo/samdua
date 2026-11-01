export const FALLBACK_PRODUCT_IMAGE = "/placeholders/camera.svg";

/** Thư mục chứa ảnh demo đã tải sẵn về máy (xem scripts/localize-images.mjs). */
export const DEMO_IMAGE_DIR = "/images/demo/";

const TRAE_IMAGE_HOST = "coresg-normal.trae.ai";

/**
 * Băm FNV-1a 32-bit -> 8 ký tự hex.
 * PHẢI trùng với hàm hashKey trong scripts/localize-images.mjs để tên file khớp nhau.
 */
function hashKey(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

/**
 * Chuyển URL ảnh AI của Trae sang file local tương ứng.
 * Các URL khác (Cloudinary, ảnh do admin tải lên...) được giữ nguyên.
 */
export function toLocalImage(url: string): string {
  if (url.includes(TRAE_IMAGE_HOST)) {
    try {
      const parsed = new URL(url);
      const prompt = parsed.searchParams.get("prompt") || "";
      const size = parsed.searchParams.get("image_size") ?? "landscape_4_3";

      // Ánh xạ các ảnh đặc biệt sang file có sẵn trong public/images/
      if (prompt.includes("young person shooting with a vintage film camera")) {
        return "/images/hero-analog.jpg";
      }
      if (prompt.includes("vintage 35mm film SLR camera collection")) {
        return "/images/category-may-film.jpg";
      }
      if (prompt.includes("modern compact digital camera")) {
        return "/images/category-digital-compact.jpg";
      }
      if (prompt.includes("neatly stacked 35mm film rolls")) {
        return "/images/category-cuon-film.jpg";
      }
      if (prompt.includes("camera accessories flat lay")) {
        return "/images/category-phu-kien.jpg";
      }

      if (prompt) {
        const fileName = `${hashKey(`${prompt}::${size}`)}.jpg`;
        return `${DEMO_IMAGE_DIR}${fileName}`;
      }
    } catch {
      // Bỏ qua lỗi parse URL, trả về URL gốc
    }
  }
  return url;
}

/**
 * Ảnh minh hoạ cho các khối giao diện (hero, banner danh mục).
 * Trả về file local đã tải sẵn — không gọi dịch vụ ngoài nên không bị chặn khi deploy.
 */
export function demoImage(prompt: string, size: string = "landscape_4_3"): string {
  const remoteUrl = `https://${TRAE_IMAGE_HOST}/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
    prompt,
  )}&image_size=${size}`;
  return toLocalImage(remoteUrl);
}

export function productImageUrl(url?: string | null): string {
  if (!url) return FALLBACK_PRODUCT_IMAGE;
  const trimmed = url.trim();
  return trimmed === "" ? FALLBACK_PRODUCT_IMAGE : toLocalImage(trimmed);
}

export function primaryImageUrl(images: { url: string }[] | undefined): string {
  return productImageUrl(images?.[0]?.url);
}
