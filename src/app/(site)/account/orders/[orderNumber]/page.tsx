import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { OrderItemsTable } from "@/components/order/order-items-table";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/order/order-status-badge";
import { formatDateTime } from "@/lib/format";
import { paymentMethodLabels, site } from "@/lib/site";
import { getSessionUser } from "@/server/auth-guard";
import { findOrderByNumber } from "@/server/repositories/order.repository";

export const metadata: Metadata = {
  title: "Chi tiết đơn hàng",
  robots: { index: false, follow: false },
};

export default async function AccountOrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { orderNumber } = await params;
  const { token } = await searchParams;

  const order = await findOrderByNumber(orderNumber);
  if (!order) notFound();

  const user = await getSessionUser();
  const isOwner = Boolean(user && order.userId && order.userId === user.id);
  const hasToken = Boolean(token) && token === order.accessToken;

  // Chỉ chủ đơn hoặc người có token truy cập hợp lệ mới xem được.
  if (!isOwner && !hasToken) notFound();

  const timeline: { label: string; at: Date }[] = [
    { label: "Đơn được tạo", at: order.createdAt },
  ];
  if (order.confirmedAt) timeline.push({ label: "Xác nhận đơn", at: order.confirmedAt });
  if (order.completedAt) timeline.push({ label: "Hoàn tất", at: order.completedAt });
  if (order.cancelledAt) timeline.push({ label: "Huỷ đơn", at: order.cancelledAt });

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="text-xs text-muted">
        <Link href="/account/orders" className="hover:text-accent">
          Đơn hàng
        </Link>
        <span className="px-2" aria-hidden>
          /
        </span>
        <span className="text-foreground">{order.orderNumber}</span>
      </nav>

      <header className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-mono text-2xl">{order.orderNumber}</h1>
          <p className="text-sm text-muted">Đặt ngày {formatDateTime(order.createdAt)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <OrderStatusBadge status={order.orderStatus} />
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
      </header>

      <div className="mt-8 space-y-6">
        <section className="border border-border bg-surface p-5">
          <h2 className="font-serif text-lg">Thông tin giao hàng</h2>
          <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
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

        <section className="border border-border bg-surface p-5">
          <h2 className="font-serif text-lg">Trạng thái đơn</h2>
          <ol className="mt-4 space-y-3">
            {timeline.map((entry) => (
              <li key={entry.label} className="flex items-start gap-3 text-sm">
                <span className="mt-1 size-2 shrink-0 rounded-full bg-accent" aria-hidden />
                <span>
                  <span className="block">{entry.label}</span>
                  <span className="text-xs text-muted">{formatDateTime(entry.at)}</span>
                </span>
              </li>
            ))}
            {order.orderStatus === "PENDING" ? (
              <li className="text-sm text-muted">
                Đơn đang chờ cửa hàng xác nhận. Cần hỗ trợ? Gọi {site.hotline}.
              </li>
            ) : null}
          </ol>
        </section>

        <section className="border border-border bg-surface p-5">
          <h2 className="font-serif text-lg">Sản phẩm & thanh toán</h2>
          <p className="mt-1 text-xs text-muted">
            Phương thức: {paymentMethodLabels[order.paymentMethod]}
          </p>
          <div className="mt-4">
            <OrderItemsTable order={order} />
          </div>
          {order.paymentMethod === "BANK_TRANSFER" && order.paymentStatus !== "PAID" ? (
            <div className="mt-4 border border-dashed border-accent/50 bg-accent-soft/40 p-4 text-sm">
              <p className="font-medium">Thông tin chuyển khoản</p>
              <p className="mt-1 text-muted">{site.bank.bankName}</p>
              <p className="text-muted">Số tài khoản: {site.bank.accountNumber}</p>
              <p className="text-muted">Chủ tài khoản: {site.bank.accountHolder}</p>
              <p className="text-muted">
                Nội dung: <span className="font-mono">{order.orderNumber}</span>
              </p>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
