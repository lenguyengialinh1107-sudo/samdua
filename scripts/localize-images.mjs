/**
 * Tải toàn bộ ảnh demo (sinh từ API ảnh AI của Trae) về `public/images/demo`
 * để website không còn phụ thuộc dịch vụ ngoài — tránh lỗi 403 hotlink khi deploy.
 *
 * Cách dùng (dev server phải đang chạy ở LOCAL_BASE_URL):
 *   node scripts/localize-images.mjs
 */
import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.LOCAL_BASE_URL ?? "http://localhost:3000";
const OUT_DIR = path.resolve("public/images/demo");
const URL_PATTERN =
  /https:\/\/coresg-normal\.trae\.ai\/api\/ide\/v1\/text_to_image\?[^\s"<>\\]+/g;

// Các kích thước placeholder phổ biến của Trae AI (cần tránh tải về)
const PLACEHOLDER_SIZES = new Set([
  64966,  // square / small
  176626, // landscape_4_3 / large
]);

/** Băm FNV-1a 32-bit -> 8 ký tự hex. PHẢI trùng với hashKey trong src/lib/images.ts. */
function hashKey(input) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function fileNameFor(prompt, size) {
  return `${hashKey(`${prompt}::${size}`)}.jpg`;
}

/** Ảnh dùng khi bài viết chưa có ảnh bìa hoặc banner cố định. */
const EXTRA_PROMPTS = [
  [
    "a 35mm film roll and a vintage camera resting on warm cream paper, soft window light, muted terracotta and brown analog palette, editorial still life",
    "landscape_4_3",
  ],
  [
    "overhead cinematic shot of film photography essentials: a classic camera, several film rolls, an open notebook and a magnifying glass on a warm vintage wooden table, soft golden window light, analog cinematic aesthetic",
    "landscape_4_3",
  ],
  [
    "subtle vintage film grain paper texture, warm cream and beige tones, minimal and elegant, professional analog background",
    "landscape_16_9",
  ],
  // Blog: Hướng dẫn chọn máy ảnh film cho người mới
  [
    "young person holding a classic film camera, a variety of beginner-friendly film cameras arranged on a table, warm analog tones, soft natural lighting, professional photography",
    "landscape_4_3",
  ],
  [
    "hands loading a 35mm film roll into a vintage camera, close-up, warm cinematic lighting, editorial analog photography",
    "landscape_4_3",
  ],
  [
    "collection of popular beginner film cameras like Pentax K1000 and Canon AE-1 on a wooden shelf, warm vintage atmosphere",
    "landscape_4_3",
  ],
  // Blog: Kodak Gold 200 hay Fujifilm 400?
  [
    "one Kodak Gold 200 film roll and one Fujifilm 400 film roll side by side, vintage analog mood, warm golden sunlight, cinematic film look",
    "landscape_4_3",
  ],
  [
    "photo comparison: warm golden street scene shot on Kodak Gold versus cooler green tones of Fujifilm 400, split screen, analog grain",
    "landscape_4_3",
  ],
  [
    "stack of Kodak and Fuji film boxes on a vintage wooden desk, warm cinematic lighting",
    "landscape_4_3",
  ],
  // Blog: Review Olympus Superzoom 70
  [
    "authentic Olympus Superzoom 70 black compact film camera, realistic product photo on a vintage wooden surface, warm analog tones",
    "landscape_4_3",
  ],
  [
    "detailed shot of Olympus Superzoom 70 camera and buttons, black plastic body, vintage cinematic lighting",
    "landscape_4_3",
  ],
  [
    "interior view of an Olympus Superzoom 70 film chamber, clean rollers and pressure plate, soft warm lighting",
    "landscape_4_3",
  ],
  [
    "close up of a vintage camera viewfinder, clear optics, cinematic analog atmosphere",
    "landscape_4_3",
  ],
  // Blog: 5 lỗi người mới chơi film thường mắc
  [
    "young person loading a 35mm film roll into a vintage SLR camera, concentrated expression, soft indoor lighting, analog film aesthetic",
    "landscape_4_3",
  ],
  [
    "hands holding a vintage camera, accidentally opening the back door with film inside, light leak effect, analog photography mistake",
    "landscape_4_3",
  ],
  [
    "blurry and underexposed analog photo, film grain, vintage mistake style",
    "landscape_4_3",
  ],
  // Blog: Cách bảo quản máy ảnh film
  [
    "vintage film camera, a wooden dry box, and a cleaning kit with a soft brush and cloth on a cream table, warm cinematic lighting",
    "landscape_4_3",
  ],
  [
    "close-up of hands cleaning a camera with a microfiber cloth, dust-free glass, warm analog mood",
    "landscape_4_3",
  ],
  [
    "camera equipment stored neatly in a professional dry cabinet, hygrometer visible, warm vintage lighting",
    "landscape_4_3",
  ],
  // Blog: Những địa điểm chụp ảnh film đẹp
  [
    "cinematic shot of a beautiful old street in Hanoi at sunset, warm golden light, vintage colonial buildings, analog film grain",
    "landscape_4_3",
  ],
  [
    "an old vintage cafe with wooden furniture and warm lighting, perfect for film photography, analog aesthetic",
    "landscape_4_3",
  ],
  [
    "sunlit riverside path with silhouettes of people at golden hour, warm cinematic film look",
    "landscape_4_3",
  ],
  // Blog: Cách chọn cuộn film theo điều kiện ánh sáng
  [
    "different film rolls (ISO 100, 400, 800) placed in various lighting conditions from bright sun to deep shadow, warm analog cinematic lighting",
    "landscape_4_3",
  ],
  [
    "sunlight streaming through a window onto a variety of film canisters, warm golden tones, editorial analog photography",
    "landscape_4_3",
  ],
  [
    "shadowy indoor scene with a vintage camera, soft dim lighting, analog grain, cinematic mood",
    "landscape_4_3",
  ],
];

async function fetchText(url) {
  const res = await fetch(url, { headers: { "user-agent": "second-shot-localizer" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} cho ${url}`);
  return res.text();
}

/** Thu thập mọi URL ảnh Trae xuất hiện trong HTML của các trang public. */
async function collectFromSite() {
  const routes = new Set(["/", "/products", "/blog", "/about", "/contact", "/cart"]);

  try {
    const xml = await fetchText(`${BASE}/sitemap.xml`);
    for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      try {
        routes.add(new URL(match[1]).pathname);
      } catch {
        // bỏ qua loc không hợp lệ
      }
    }
  } catch (error) {
    console.warn(`! Không đọc được sitemap.xml: ${error.message}`);
  }

  const urls = new Set();

  for (const route of routes) {
    try {
      const html = await fetchText(`${BASE}${route}`);
      for (const match of html.matchAll(URL_PATTERN)) {
        urls.add(match[0].replaceAll("&amp;", "&"));
      }
    } catch (error) {
      console.warn(`! Bỏ qua ${route}: ${error.message}`);
    }
  }

  return urls;
}

async function getFileInfo(file) {
  try {
    const info = await stat(file);
    return info;
  } catch {
    return null;
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function download(remoteUrl, file) {
  const info = await getFileInfo(file);
  
  // Nếu file đã có và KHÔNG phải là placeholder, bỏ qua
  if (info && info.size > 0 && !PLACEHOLDER_SIZES.has(info.size)) {
    return "skip";
  }

  const fileName = path.basename(file);
  let attempts = 0;
  const MAX_ATTEMPTS = 8; // Tăng số lần thử

  while (attempts < MAX_ATTEMPTS) {
    attempts += 1;
    try {
      if (attempts > 1) {
        const waitTime = 10000 * attempts; // Đợi lâu hơn (10s, 20s, 30s...)
        console.log(`\n  [${fileName}] Thử lại lần ${attempts}/${MAX_ATTEMPTS} sau ${waitTime/1000}s...`);
        await sleep(waitTime);
      }

      const res = await fetch(remoteUrl, { headers: { "user-agent": "second-shot-localizer" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const buffer = Buffer.from(await res.arrayBuffer());
      if (buffer.length === 0) throw new Error("nội dung rỗng");

      // Nếu tải về vẫn là placeholder, coi như chưa xong
      if (PLACEHOLDER_SIZES.has(buffer.length)) {
        throw new Error("nhận được placeholder từ API (đang sinh ảnh)");
      }

      await writeFile(file, buffer);
      console.log(`\n  [${fileName}] Tải thành công (${(buffer.length/1024).toFixed(1)} KB)`);
      return "ok";
    } catch (error) {
      if (attempts === MAX_ATTEMPTS) throw error;
      // Tiếp tục vòng lặp để thử lại
    }
  }
}

async function main() {
  console.log("--- Bắt đầu localize ảnh demo ---");
  await mkdir(OUT_DIR, { recursive: true });

  const targets = new Map(); // fileName -> remoteUrl

  for (const [prompt, size] of EXTRA_PROMPTS) {
    targets.set(
      fileNameFor(prompt, size),
      `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
        prompt,
      )}&image_size=${size}`,
    );
  }

  const urls = await collectFromSite();
  for (const remoteUrl of urls) {
    try {
      const parsed = new URL(remoteUrl);
      const prompt = parsed.searchParams.get("prompt");
      const size = parsed.searchParams.get("image_size") ?? "landscape_4_3";
      if (!prompt) continue;
      targets.set(fileNameFor(prompt, size), remoteUrl);
    } catch {
      // url không hợp lệ
    }
  }

  console.log(`Tìm thấy ${targets.size} ảnh cần xử lý.`);

  const entries = [...targets.entries()];
  let done = 0;
  let skipped = 0;
  let failed = 0;

  // Giảm concurrency xuống 1 để tránh rate limit của API ảnh AI
  const CONCURRENCY = 1;
  let cursor = 0;

  async function worker() {
    while (cursor < entries.length) {
      const [fileName, remoteUrl] = entries[cursor];
      cursor += 1;
      const file = path.join(OUT_DIR, fileName);
      try {
        const result = await download(remoteUrl, file);
        if (result === "skip") skipped += 1;
        else done += 1;
        process.stdout.write(`\rTiến độ: ${done + skipped + failed}/${entries.length}`);
      } catch (error) {
        failed += 1;
        console.error(`\n! Lỗi tải ${fileName}: ${error.message}`);
      }
      // Nghỉ một chút giữa các ảnh
      await sleep(500);
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  console.log(`\n\nKết quả:`);
  console.log(`- Thành công: ${done} ảnh mới`);
  console.log(`- Đã có sẵn:  ${skipped} ảnh`);
  console.log(`- Thất bại:   ${failed} ảnh`);
  console.log(`Thư mục: ${OUT_DIR}`);
  console.log("---------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
