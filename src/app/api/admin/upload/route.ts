import { NextResponse } from "next/server";

import { getSessionUser } from "@/server/auth-guard";
import { uploadProductImage, UploadError } from "@/server/services/storage.service";

export const runtime = "nodejs";

const MAX_FILE_BYTES = 5 * 1024 * 1024;

/** Chỉ cho phép các thư mục đã biết để tránh ghi lung tung lên Cloudinary. */
const ALLOWED_FOLDERS: Record<string, string> = {
  products: "second-shot/products",
  blog: "second-shot/blog",
};

export async function POST(request: Request) {
  // Kiểm tra quyền ở server — ẩn nút trên UI không phải là bảo mật.
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ ok: false, message: "Không có quyền upload ảnh." }, { status: 403 });
  }

  const contentLength = Number.parseInt(request.headers.get("content-length") ?? "0", 10);
  if (contentLength > MAX_FILE_BYTES + 1024 * 512) {
    return NextResponse.json({ ok: false, message: "Ảnh vượt quá 5MB." }, { status: 413 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, message: "Dữ liệu gửi lên không hợp lệ." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, message: "Thiếu tệp ảnh." }, { status: 400 });
  }

  const folderKey = formData.get("folder");
  const folder =
    (typeof folderKey === "string" ? ALLOWED_FOLDERS[folderKey] : undefined) ??
    ALLOWED_FOLDERS.products;

  try {
    const result = await uploadProductImage(file, folder);
    return NextResponse.json({ ok: true, url: result.url });
  } catch (error) {
    if (error instanceof UploadError) {
      const status = error.code === "NOT_CONFIGURED" ? 501 : 400;
      return NextResponse.json({ ok: false, message: error.message }, { status });
    }
    return NextResponse.json(
      { ok: false, message: "Upload ảnh thất bại, vui lòng thử lại." },
      { status: 500 },
    );
  }
}
