import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import { OrderItemsTable } from "@/components/order/order-items-table";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/order/order-status-badge";
import { Button } from "@/components/ui/button";
import { formatDateTime, formatVnd } from "@/lib/format";
import { paymentMethodLabels, site } from "@/lib/site";
import { findOrderByNumber } from "@/server/repositories/order.repository";

export const metadata: Metadata = {
  title: "Đặt hàng thành công",
  robots: { index: false, follow: false },
};

export default async function OrderSuccessPage({
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

  // Chỉ hiển thị đầy đủ địa chỉ/chi tiết khi có token truy cập đúng.
  const canViewFull = Boolean(token) && token === order.accessToken;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <CheckCircle2 className="size-10 text-success" aria-hidden />
        <h1 className="font-serif text-3xl">Đơn hàng đã được ghi nhận</h1>
        <p className="max-w-xl text-sm text-muted">
          Cảm ơn bạn đã đặt hàng tại {site.name}. Nhân viên sẽ liên hệ xác nhận trong thời gian
          sớm nhất.
        </p>
      </div>

      <div className="mt-8 space-y-6 border border-border bg-surface p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="ah-label">Mã đơn hàng</p>
            <p className="font-mono text-lg">{order.orderNumber}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <OrderStatusBadge status={order.orderStatus} />
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
        </div>

        <dl className="grid gap-4 border-t border-border pt-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="ah-label">Ngày đặt</dt>
            <dd className="mt-1">{formatDateTime(order.createdAt)}</dd>
          </div>
          <div>
            <dt className="ah-label">Tổng tiền</dt>
            <dd className="mt-1 font-serif text-lg">{formatVnd(order.grandTotal)}</dd>
          </div>
          <div>
            <dt className="ah-label">Phương thức thanh toán</dt>
            <dd className="mt-1">{paymentMethodLabels[order.paymentMethod]}</dd>
          </div>
          {canViewFull ? (
            <div>
              <dt className="ah-label">Người nhận</dt>
              <dd className="mt-1">
                {order.customerName} · {order.customerPhone}
                <br />
                {order.shippingAddress}
              </dd>
            </div>
          ) : null}
        </dl>

        {order.paymentMethod === "BANK_TRANSFER" && order.paymentStatus !== "PAID" ? (
          <div className="border border-dashed border-accent/50 bg-accent-soft/40 p-4 text-sm">
            <p className="font-medium">Thông tin chuyển khoản</p>
            <p className="mt-1 text-muted">{site.bank.bankName}</p>
            <p className="text-muted">Số tài khoản: {site.bank.accountNumber}</p>
            <p className="text-muted">Chủ tài khoản: {site.bank.accountHolder}</p>
            <p className="text-muted">
              Nội dung: <span className="font-mono">{order.orderNumber}</span>
            </p>
          </div>
        ) : null}

        {canViewFull ? (
          <div className="border-t border-border pt-4">
            <OrderItemsTable order={order} />
          </div>
        ) : (
          <p className="border-t border-border pt-4 text-sm text-muted">
            Để xem chi tiết sản phẩm, hãy mở liên kết tra cứu đơn hàng bằng mã đơn và số điện
            thoại đã dùng khi đặt.
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button variant="accent" asChild>
          <Link href="/products">Tiếp tục mua sắm</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/account/orders">Tra cứu đơn hàng</Link>
        </Button>
      </div>
    </div>
  );
}
