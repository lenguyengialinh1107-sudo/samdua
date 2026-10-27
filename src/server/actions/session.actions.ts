"use server";

import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

import { signIn, signOut } from "@/auth";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { failure, zodFieldErrors, type ActionResult } from "@/server/actions/action-result";

export async function loginAction(
  values: LoginInput & { redirectTo?: string },
): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    return failure("Vui lòng kiểm tra lại thông tin đăng nhập.", zodFieldErrors(parsed.error));
  }

  const redirectTo =
    values.redirectTo && values.redirectTo.startsWith("/") ? values.redirectTo : "/account";

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo,
    });
    return { ok: true };
  } catch (error) {
    if (error instanceof AuthError) {
      // Không nói rõ sai email hay sai mật khẩu.
      return failure("Email hoặc mật khẩu không đúng.");
    }
    // NEXT_REDIRECT của Next.js phải được ném tiếp để điều hướng hoạt động.
    throw error;
  }
}

export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
  revalidatePath("/");
}
