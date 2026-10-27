import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { RegisterForm } from "@/components/auth/register-form";
import { getSessionUser } from "@/server/auth-guard";

export const metadata: Metadata = {
  title: "Đăng ký",
  description: "Tạo tài khoản Second Shot để theo dõi đơn hàng.",
  robots: { index: false, follow: false },
};

export default async function RegisterPage() {
  const user = await getSessionUser();
  if (user) redirect("/account");

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-16 sm:px-6">
      <header className="space-y-2 text-center">
        <p className="ah-label">Second Shot</p>
        <h1 className="font-serif text-3xl">Tạo tài khoản</h1>
        <p className="text-sm text-muted">
          Chỉ mất một phút để lưu lại lịch sử đơn hàng của bạn.
        </p>
      </header>

      <div className="mt-8 border border-border bg-surface p-6">
        <RegisterForm />
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/" className="hover:text-accent">
          ← Về trang chủ
        </Link>
      </p>
    </div>
  );
}
