"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
} from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { mainNav } from "@/lib/site";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/server/actions/session.actions";

export interface HeaderUser {
  name?: string | null;
  role: "CUSTOMER" | "ADMIN";
}

export function SiteHeaderNav({ user }: { user: HeaderUser | null }) {
  const pathname = usePathname();
  const { itemCount, isReady } = useCart();
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href.split("?")[0];

  return (
    <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:px-6 lg:px-8">
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Mở menu"
          >
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" title="Menu" description="Second Shot">
          <nav className="flex flex-col">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-border py-3 text-sm text-foreground hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/account"
              className="border-b border-border py-3 text-sm hover:text-accent"
            >
              Tài khoản
            </Link>
            {user?.role === "ADMIN" ? (
              <Link href="/admin" className="border-b border-border py-3 text-sm hover:text-accent">
                Trang quản trị
              </Link>
            ) : null}
          </nav>
        </SheetContent>
      </Sheet>

      <Link href="/" className="flex items-baseline gap-2">
        <span className="font-serif text-xl tracking-tight text-foreground">Second Shot</span>
        <span className="hidden text-[10px] uppercase tracking-[0.24em] text-muted sm:inline">
          since 2026
        </span>
      </Link>

      <nav className="ml-6 hidden items-center gap-5 lg:flex">
        {mainNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm text-muted transition-colors hover:text-foreground",
              isActive(item.href) && "text-foreground underline decoration-accent decoration-2 underline-offset-[6px]",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-1">
        <form
          action="/products"
          method="get"
          role="search"
          className="hidden items-center md:flex"
        >
          <label htmlFor="site-search" className="sr-only">
            Tìm kiếm sản phẩm
          </label>
          <Input
            id="site-search"
            name="q"
            type="search"
            placeholder="Tìm máy ảnh, lens…"
            className="h-9 w-44 lg:w-56"
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            aria-label="Tìm kiếm"
            className="-ml-9"
          >
            <Search />
          </Button>
        </form>

        {user ? (
          <div className="group relative">
            <Button variant="ghost" size="icon" aria-label="Tài khoản" asChild>
              <Link href="/account">
                <UserRound />
              </Link>
            </Button>
            <div className="invisible absolute right-0 top-full z-50 w-52 border border-border bg-surface py-1 opacity-0 shadow-lg transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <p className="px-3 py-2 text-xs text-muted">
                Xin chào, {user.name?.split(" ").at(-1) ?? "bạn"}
              </p>
              <Link
                href="/account/orders"
                className="block px-3 py-2 text-sm hover:bg-surface-muted"
              >
                Đơn hàng của tôi
              </Link>
              {user.role === "ADMIN" ? (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-surface-muted"
                >
                  <LayoutDashboard className="size-4" /> Trang quản trị
                </Link>
              ) : null}
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-danger hover:bg-surface-muted"
                >
                  <LogOut className="size-4" /> Đăng xuất
                </button>
              </form>
            </div>
          </div>
        ) : (
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Đăng nhập</Link>
          </Button>
        )}

        <Button variant="ghost" size="icon" aria-label="Giỏ hàng" asChild>
          <Link href="/cart" className="relative">
            <ShoppingBag />
            {isReady && itemCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            ) : null}
          </Link>
        </Button>
      </div>
    </div>
  );
}
