import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, LogOut } from "lucide-react";

import { OrderStatusBadge } from "@/components/order/order-status-badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateTime, formatVnd } from "@/lib/format";
import { requireUser } from "@/server/auth-guard";
import { findOrdersByUserId } from "@/server/repositories/order.repository";
import { signOutAction } from "@/server/actions/session.actions";

export const metadata: Metadata = {
  title: "Tài khoản của tôi",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const user = await requireUser("/login?next=/account");
  const orders = await findOrdersByUserId(user.id);
  const recent = orders.slice(0, 5);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="ah-label">Tài khoản</p>
          <h1 className="font-serif text-3xl">Xin chào, {user.name ?? "bạn"}</h1>
          <p className="text-sm text-muted">
            {user.email}
            {user.role === "ADMIN" ? " · Quản trị viên" : ""}
          </p>
        </div>

        <div className="flex gap-2">
          {user.role === "ADMIN" ? (
            <Button variant="outline" asChild>
              <Link href="/admin">Trang quản trị</Link>
            </Button>
          ) : null}
          <form action={signOutAction}>
            <Button type="submit" variant="ghost">
              <LogOut /> Đăng xuất
            </Button>
          </form>
        </div>
      </header>

      <section className="mt-10 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl">Đơn hàng gần đây</h2>
          <Link href="/account/orders" className="text-sm text-accent hover:underline">
            Xem tất cả
          </Link>
        </div>

        {recent.length > 0 ? (
          <ul className="divide-y divide-border border border-border bg-surface">
            {recent.map((order) => (
              <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <Link
                    href={`/account/orders/${order.orderNumber}`}
                    className="font-mono text-sm hover:text-accent"
                  >
                    {order.orderNumber}
                  </Link>
                  <p className="text-xs text-muted">{formatDateTime(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <OrderStatusBadge status={order.orderStatus} />
                  <span className="text-sm font-medium">{formatVnd(order.grandTotal)}</span>
                  <Link
                    href={`/account/orders/${order.orderNumber}`}
                    className="text-muted hover:text-accent"
                    aria-label={`Xem đơn ${order.orderNumber}`}
                  >
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="Chưa có đơn hàng nào"
            description="Khi bạn đặt hàng, đơn sẽ xuất hiện ở đây để theo dõi trạng thái."
            action={
              <Button variant="accent" asChild>
                <Link href="/products">Bắt đầu chọn máy</Link>
              </Button>
            }
          />
        )}
      </section>
    </div>
  );
}
