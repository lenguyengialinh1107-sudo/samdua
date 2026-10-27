import type { Metadata } from "next";
import Link from "next/link";

import { OrderStatusBadge, PaymentStatusBadge } from "@/components/order/order-status-badge";
import { Pagination } from "@/components/product/pagination";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input, Select } from "@/components/ui/input";
import { formatDateTime, formatVnd } from "@/lib/format";
import { ORDER_STATUSES, type OrderStatusValue } from "@/lib/order-status";
import { toQueryString, type SearchParamsRecord } from "@/lib/search-params";
import { orderStatusLabels } from "@/lib/site";
import { findOrdersForAdmin } from "@/server/repositories/order.repository";

export const metadata: Metadata = { title: "Đơn hàng" };

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseStatus(value: string | undefined): OrderStatusValue | "ALL" {
  return ORDER_STATUSES.includes(value as OrderStatusValue)
    ? (value as OrderStatusValue)
    : "ALL";
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsRecord>;
}) {
  const params = await searchParams;
  const q = first(params.q) ?? "";
  const status = parseStatus(first(params.status));
  const page = Number.parseInt(first(params.page) ?? "1", 10) || 1;

  const { items, total, totalPages } = await findOrdersForAdmin({ q, status, page });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-2xl">Đơn hàng</h1>
        <p className="text-sm text-muted">{total} đơn hàng</p>
      </header>

      <form action="/admin/orders" method="get" className="flex flex-wrap gap-3">
        <Input
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Mã đơn, tên khách hoặc số điện thoại…"
          className="max-w-xs"
        />
        <Select name="status" defaultValue={status} className="max-w-[200px]">
          <option value="ALL">Tất cả trạng thái</option>
          {ORDER_STATUSES.map((value) => (
            <option key={value} value={value}>
              {orderStatusLabels[value]}
            </option>
          ))}
        </Select>
        <Button type="submit" variant="outline">
          Lọc
        </Button>
      </form>

      {items.length === 0 ? (
        <EmptyState title="Không có đơn hàng nào" description="Thử đổi bộ lọc tìm kiếm." />
      ) : (
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-surface-muted/60 text-left">
              <tr>
                <th scope="col" className="px-4 py-2 font-medium">
                  Mã đơn
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  Khách hàng
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  Ngày đặt
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  Trạng thái
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  Thanh toán
                </th>
                <th scope="col" className="px-4 py-2 text-right font-medium">
                  Tổng tiền
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {items.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-mono text-xs hover:text-accent"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className="block">{order.customerName}</span>
                    <span className="text-xs text-muted">{order.customerPhone}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {formatDateTime(order.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={order.orderStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatVnd(order.grandTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        buildHref={(target) => `/admin/orders${toQueryString(params, { page: String(target) })}`}
      />
    </div>
  );
}
