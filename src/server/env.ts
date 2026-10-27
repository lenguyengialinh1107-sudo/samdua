import { z } from "zod";

/**
 * Biến môi trường phía server. Validate một lần, báo lỗi rõ ràng nếu thiếu.
 * Không bao giờ đưa các biến này vào NEXT_PUBLIC_*.
 */
const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL là bắt buộc"),
  AUTH_SECRET: z.string().min(16, "AUTH_SECRET phải dài ít nhất 16 ký tự"),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function getServerEnv(): ServerEnv {
  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `- ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Cấu hình môi trường chưa hợp lệ:\n${issues}`);
  }
  return parsed.data;
}

/** Cloudinary chỉ được bật khi có đủ 3 biến. */
export function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) return null;
  return { cloudName, apiKey, apiSecret };
}

export function isCloudinaryEnabled(): boolean {
  return getCloudinaryConfig() !== null;
}
