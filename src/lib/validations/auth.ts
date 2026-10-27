import { z } from "zod";

const phoneRegex = /^(0|\+84)\d{9}$/;

export const loginSchema = z.object({
  email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Họ tên tối thiểu 2 ký tự").max(80),
    email: z.string().trim().toLowerCase().email("Email không hợp lệ"),
    phone: z
      .string()
      .trim()
      .regex(phoneRegex, "Số điện thoại không hợp lệ (ví dụ: 0901234567)")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, "Mật khẩu tối thiểu 8 ký tự")
      .regex(/[A-Za-z]/, "Mật khẩu cần có ít nhất 1 chữ cái")
      .regex(/\d/, "Mật khẩu cần có ít nhất 1 chữ số"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu nhập lại không khớp",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
