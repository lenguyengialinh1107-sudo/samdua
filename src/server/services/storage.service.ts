import { v2 as cloudinary } from "cloudinary";

import { getCloudinaryConfig } from "@/server/env";

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export class UploadError extends Error {
  constructor(
    message: string,
    readonly code: "NOT_CONFIGURED" | "INVALID_FILE" | "TOO_LARGE" | "FAILED" = "FAILED",
  ) {
    super(message);
    this.name = "UploadError";
  }
}

export function isUploadConfigured(): boolean {
  return getCloudinaryConfig() !== null;
}

/**
 * Upload ảnh sản phẩm lên Cloudinary từ server.
 * API secret chỉ tồn tại ở server, không bao giờ gửi xuống client.
 */
export async function uploadProductImage(file: File): Promise<{ url: string }> {
  const config = getCloudinaryConfig();
  if (!config) {
    throw new UploadError(
      "Chưa cấu hình Cloudinary (CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET). " +
        "Bạn vẫn có thể dán URL ảnh trực tiếp vào ô \"URL ảnh\" khi không dùng upload.",
      "NOT_CONFIGURED",
    );
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new UploadError("Chỉ chấp nhận ảnh JPG, PNG, WEBP hoặc AVIF.", "INVALID_FILE");
  }

  if (file.size > MAX_FILE_BYTES) {
    throw new UploadError("Ảnh vượt quá 5MB.", "TOO_LARGE");
  }

  cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret,
    secure: true,
  });

  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise<{ url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "second-shot/products", resource_type: "image" },
      (error, result) => {
        if (error || !result) {
          reject(new UploadError("Upload ảnh thất bại.", "FAILED"));
          return;
        }
        resolve({ url: result.secure_url });
      },
    );
    stream.end(buffer);
  });
}
