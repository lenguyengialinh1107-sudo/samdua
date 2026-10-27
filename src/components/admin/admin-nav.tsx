"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderTree,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
} from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Sản phẩm", icon: Package, exact: false },
  { href: "/admin/orders", label: "Đơn hàng", icon: ShoppingCart, exact: false },
  { href: "/admin/categories", label: "Danh mục & thương hiệu", icon: FolderTree, exact: false },
  { href: "/admin/settings", label: "Cấu hình", icon: Settings, exact: false },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Điều hướng quản trị" className="flex gap-1 overflow-x-auto lg:flex-col">
      {items.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap px-3 py-2 text-sm transition-colors",
              active
                ? "bg-charcoal text-accent-foreground"
                : "text-muted hover:bg-surface-muted hover:text-foreground",
            )}
          >
            <item.icon className="size-4" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
