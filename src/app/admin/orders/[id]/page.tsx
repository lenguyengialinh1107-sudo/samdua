import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { OrderStatusActions, PaymentStatusControl } from "@/components/admin/order-actions";
import { OrderItemsTable } from "@/components/order/order-items-table";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/order/order-status-badge";
import { formatDateTime } from "@/lib/format";
import { paymentMethodLabels } from "@/lib/site";
import { findOrderById } from "@/server/repositories/order.repository";

export const metadata: Metadata = {
  title: "Chi tiết đơn hàng",
  robots: { index: false, follow: false },
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await findOrderById(id);
  if (!order) notFound();

  const timeline: { label: string; at: Date }[] = [
    { label: "Đơn được tạo", at: order.createdAt },
  ];
  if (order.confirmedAt) timeline.push({ label: "Xác nhận đơn", at: order.confirmedAt });
  if (order.completedAt) timeline.push({ label: "Hoàn tất", at: order.completedAt });
  if (order.cancelledAt) timeline.push({ label: "Huỷ đơn", at: order.cancelledAt });

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="text-xs text-muted">
        <Link href="/admin/orders" className="hover:text-accent">
          Đơn hàng
        </Link>
        <span className="px-2" aria-hidden>
          /
        </span>
        <span className="text-foreground">{order.orderNumber}</span>
      </nav>

      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-mono text-2xl">{order.orderNumber}</h1>
          <p className="text-sm text-muted">Đặt ngày {formatDateTime(order.createdAt)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <OrderStatusBadge status={order.orderStatus} />
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="space-y-4 border border-border bg-surface p-5">
            <h2 className="font-serif text-lg">Xử lý đơn hàng</h2>
            <OrderStatusActions orderId={order.id} status={order.orderStatus} />
          </section>

          <section className="space-y-4 border border-border bg-surface p-5">
            <h2 className="font-serif text-lg">Sản phẩm & thanh toán</h2>
            <OrderItemsTable order={order} />
          </section>

          <section className="space-y-4 border border-border bg-surface p-5">
            <h2 className="font-serif text-lg">Thông tin giao hàng</h2>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="ah-label">Người nhận</dt>
                <dd className="mt-1">{order.customerName}</dd>
              </div>
              <div>
                <dt className="ah-label">Điện thoại</dt>
                <dd className="mt-1">{order.customerPhone}</dd>
              </div>
              {order.customerEmail ? (
                <div>
                  <dt className="ah-label">Email</dt>
                  <dd className="mt-1">{order.customerEmail}</dd>
                </div>
              ) : null}
              <div>
                <dt className="ah-label">Tài khoản</dt>
                <dd className="mt-1">
                  {order.user ? order.user.email : "Khách vãng lai"}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="ah-label">Địa chỉ</dt>
                <dd className="mt-1">{order.shippingAddress}</dd>
              </div>
              {order.note ? (
                <div className="sm:col-span-2">
                  <dt className="ah-label">Ghi chú</dt>
                  <dd className="mt-1">{order.note}</dd>
                </div>
              ) : null}
            </dl>
          </section>
        </div>

        <aside className="h-fit space-y-6 xl:sticky xl:top-24">
          <section className="space-y-4 border border-border bg-surface p-5">
            <h2 className="font-serif text-lg">Thanh toán</h2>
            <p className="text-sm">
              Phương thức: <strong>{paymentMethodLabels[order.paymentMethod]}</strong>
            </p>
            <PaymentStatusControl orderId={order.id} paymentStatus={order.paymentStatus} />
          </section>

          <section className="space-y-4 border border-border bg-surface p-5">
            <h2 className="font-serif text-lg">Lịch sử</h2>
            <ol className="space-y-3 text-sm">
              {timeline.map((entry) => (
                <li key={entry.label} className="flex items-start justify-between gap-3">
                  <span>{entry.label}</span>
                  <span className="whitespace-nowrap text-xs text-muted">
                    {formatDateTime(entry.at)}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
    </div>
  );
}
