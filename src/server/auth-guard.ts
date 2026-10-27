import { redirect } from "next/navigation";

import { auth } from "@/auth";

export interface SessionUser {
  id: string;
  email?: string | null;
  name?: string | null;
  role: "CUSTOMER" | "ADMIN";
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role ?? "CUSTOMER",
  };
}

/** Dùng trong Server Component: chuyển hướng nếu chưa đăng nhập. */
export async function requireUser(redirectTo = "/login"): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect(redirectTo);
  return user;
}

/** Dùng trong Server Component của khu vực /admin. */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "ADMIN") redirect("/account");
  return user;
}

/**
 * Dùng trong Server Action / Route Handler: ném lỗi thay vì redirect,
 * vì mọi hành động nhạy cảm phải được chặn ở tầng server.
 */
export async function assertAdmin(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new Error("Bạn cần đăng nhập để thực hiện thao tác này.");
  if (user.role !== "ADMIN") throw new Error("Bạn không có quyền thực hiện thao tác này.");
  return user;
}

export async function assertUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new Error("Bạn cần đăng nhập để thực hiện thao tác này.");
  return user;
}
