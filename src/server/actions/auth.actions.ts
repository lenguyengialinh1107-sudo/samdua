"use server";

import bcrypt from "bcryptjs";

import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { prisma } from "@/server/db";
import { failure, zodFieldErrors, type ActionResult } from "@/server/actions/action-result";

/**
 * Đăng ký tài khoản khách hàng.
 * Role luôn là CUSTOMER — client không thể gửi role để nâng quyền.
 */
export async function registerAction(values: RegisterInput): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(values);
  if (!parsed.success) {
    return failure("Vui lòng kiểm tra lại thông tin.", zodFieldErrors(parsed.error));
  }

  const { name, email, phone, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return failure("Email này đã được đăng ký.", {
      email: ["Email này đã được đăng ký."],
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      phone: phone ? phone : null,
      passwordHash,
      role: "CUSTOMER",
    },
  });

  return { ok: true };
}
