import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";

import { AdminNav } from "@/components/admin/admin-nav";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/server/auth-guard";
import { signOutAction } from "@/server/actions/session.actions";

export const metadata: Metadata = {
  title: "Trang quản trị",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Chặn ngay ở server: không phụ thuộc vào việc ẩn menu trên UI.
  const user = await requireAdmin();

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="border-b border-border bg-charcoal text-accent-foreground">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="font-serif text-lg">
              Second Shot
            </Link>
            <span className="text-[10px] uppercase tracking-[0.22em] text-accent-soft">
              Quản trị
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-accent-foreground/75 sm:inline">
              {user.name ?? user.email}
            </span>
            <Button variant="ghost" size="sm" className="text-accent-foreground hover:bg-white/10" asChild>
              <Link href="/" target="_blank" rel="noreferrer">
                <ExternalLink /> Xem cửa hàng
              </Link>
            </Button>
            <form action={signOutAction}>
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="text-accent-foreground hover:bg-white/10"
              >
                <LogOut /> Đăng xuất
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:gap-8">
        <aside className="lg:w-56 lg:shrink-0">
          <AdminNav />
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
