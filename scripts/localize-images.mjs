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

/** Ảnh dùng khi bài viết chưa có ảnh bìa (BLOG_FALLBACK_COVER trong src/lib/blog/blog.ts). */
const EXTRA_PROMPTS = [
  [
    "a 35mm film roll and a vintage camera resting on warm cream paper, soft window light, muted terracotta and brown analog palette, editorial still life",
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

async function exists(file) {
  try {
    const info = await stat(file);
    return info.size > 0;
  } catch {
    return false;
  }
}

async function download(remoteUrl, file, seen) {
  if (await exists(file)) return "skip";

  const res = await fetch(remoteUrl, { headers: { "user-agent": "second-shot-localizer" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.length === 0) throw new Error("nội dung rỗng");

  await writeFile(file, buffer);
  seen.set(remoteUrl, path.basename(file));
  return "ok";
}

async function main() {
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
    const parsed = new URL(remoteUrl);
    const prompt = parsed.searchParams.get("prompt");
    const size = parsed.searchParams.get("image_size") ?? "landscape_4_3";
    if (!prompt) continue;
    targets.set(fileNameFor(prompt, size), remoteUrl);
  }

  console.log(`Thu thập được ${targets.size} ảnh cần tải.`);

  const entries = [...targets.entries()];
  const seen = new Map();
  let done = 0;
  let skipped = 0;

  const CONCURRENCY = 4;
  let cursor = 0;

  async function worker() {
    while (cursor < entries.length) {
      const [fileName, remoteUrl] = entries[cursor];
      cursor += 1;
      const file = path.join(OUT_DIR, fileName);
      try {
        const result = await download(remoteUrl, file, seen);
        if (result === "skip") skipped += 1;
        else done += 1;
        process.stdout.write(`\rĐã tải ${done + skipped}/${entries.length}`);
      } catch (error) {
        console.error(`\n! Lỗi tải ${fileName}: ${error.message}`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  console.log(`\nHoàn tất: ${done} ảnh mới, ${skipped} ảnh đã có.`);
  console.log(`Thư mục: ${OUT_DIR}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
