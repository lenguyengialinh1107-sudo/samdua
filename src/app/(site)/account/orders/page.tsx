import type { Metadata } from "next";
import Link from "next/link";

import { OrderLookupForm } from "@/components/order/order-lookup-form";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/order/order-status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateTime, formatVnd } from "@/lib/format";
import { requireUser } from "@/server/auth-guard";
import { findOrdersByUserId } from "@/server/repositories/order.repository";

export const metadata: Metadata = {
  title: "Đơn hàng của tôi",
  robots: { index: false, follow: false },
};

export default async function AccountOrdersPage() {
  const user = await requireUser("/login?next=/account/orders");
  const orders = await findOrdersByUserId(user.id);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <nav aria-label="Breadcrumb" className="text-xs text-muted">
          <Link href="/account" className="hover:text-accent">
            Tài khoản
          </Link>
          <span className="px-2" aria-hidden>
            /
          </span>
          <span className="text-foreground">Đơn hàng</span>
        </nav>
        <h1 className="font-serif text-3xl">Đơn hàng của tôi</h1>
        <p className="text-sm text-muted">
          Tổng {orders.length} đơn hàng gắn với tài khoản {user.email}.
        </p>
      </header>

      <div className="mt-8">
        {orders.length > 0 ? (
          <ul className="space-y-3">
            {orders.map((order) => (
              <li key={order.id} className="border border-border bg-surface p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <Link
                      href={`/account/orders/${order.orderNumber}`}
                      className="font-mono text-sm hover:text-accent"
                    >
                      {order.orderNumber}
                    </Link>
                    <p className="text-xs text-muted">
                      Đặt ngày {formatDateTime(order.createdAt)} · {order.items.length} sản phẩm
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <OrderStatusBadge status={order.orderStatus} />
                    <PaymentStatusBadge status={order.paymentStatus} />
                    <span className="text-sm font-medium">{formatVnd(order.grandTotal)}</span>
                  </div>
                </div>
                <ul className="mt-3 space-y-1 border-t border-border pt-3 text-xs text-muted">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.productName} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="Bạn chưa có đơn hàng nào"
            description="Đơn hàng đặt bằng tài khoản này sẽ được lưu lại tại đây."
          />
        )}
      </div>

      <section className="mt-12 border border-border bg-surface p-6">
        <h2 className="font-serif text-xl">Tra cứu đơn hàng khách vãng lai</h2>
        <p className="mt-1 text-sm text-muted">
          Nếu bạn đã đặt hàng mà không đăng nhập, hãy tra cứu bằng mã đơn và số điện thoại.
        </p>
        <div className="mt-4 max-w-md">
          <OrderLookupForm />
        </div>
      </section>
    </div>
  );
}
