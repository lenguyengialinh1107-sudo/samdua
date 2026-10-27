import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { getSessionUser } from "@/server/auth-guard";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập để theo dõi đơn hàng và lưu thông tin nhận hàng.",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const redirectTo = next && next.startsWith("/") ? next : "/account";

  const user = await getSessionUser();
  if (user) redirect(redirectTo);

  return (
    <div className="mx-auto w-full max-w-md px-4 py-16 sm:px-6">
      <header className="space-y-2 text-center">
        <p className="ah-label">Second Shot</p>
        <h1 className="font-serif text-3xl">Đăng nhập</h1>
        <p className="text-sm text-muted">
          Theo dõi đơn hàng và thanh toán nhanh hơn ở lần sau.
        </p>
      </header>

      <div className="mt-8 border border-border bg-surface p-6">
        <LoginForm redirectTo={redirectTo} />
      </div>

      <div className="mt-6 border border-dashed border-border-strong p-4 text-xs text-muted">
        <p className="text-foreground">Tài khoản demo (sau khi chạy seed):</p>
        <p>Khách: khach@secondshot.vn / Khachhang@123</p>
        <p>Quản trị: admin@secondshot.vn / Admin@12345</p>
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/" className="hover:text-accent">
          ← Về trang chủ
        </Link>
      </p>
    </div>
  );
}
