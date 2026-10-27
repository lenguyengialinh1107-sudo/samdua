import Link from "next/link";
import { AlertTriangle, Clock, ShoppingCart, Wallet } from "lucide-react";

import { OrderStatusBadge } from "@/components/order/order-status-badge";
import { Badge } from "@/components/ui/badge";
import { formatDateTime, formatNumber, formatVnd } from "@/lib/format";
import { ORDER_STATUSES } from "@/lib/order-status";
import { orderStatusLabels } from "@/lib/site";
import { getDashboardData } from "@/server/services/admin.service";

export default async function AdminDashboardPage() {
  const { totalOrders, pendingCount, revenue, statusCounts, recentOrders, lowStock } =
    await getDashboardData();

  const cards = [
    { label: "Tổng đơn hàng", value: formatNumber(totalOrders), icon: ShoppingCart },
    { label: "Đơn chờ xác nhận", value: formatNumber(pendingCount), icon: Clock },
    { label: "Doanh thu (không gồm đơn huỷ)", value: formatVnd(revenue), icon: Wallet },
    { label: "Sản phẩm sắp hết", value: formatNumber(lowStock.length), icon: AlertTriangle },
  ];

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="font-serif text-2xl">Tổng quan</h1>
        <p className="text-sm text-muted">
          Số liệu được tính trực tiếp từ dữ liệu đơn hàng và tồn kho hiện tại.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <p className="ah-label">{card.label}</p>
              <card.icon className="size-4 text-accent" aria-hidden />
            </div>
            <p className="mt-3 font-serif text-2xl">{card.value}</p>
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <h2 className="font-serif text-lg">Đơn theo trạng thái</h2>
        <div className="flex flex-wrap gap-3">
          {ORDER_STATUSES.map((status) => (
            <Link
              key={status}
              href={`/admin/orders?status=${status}`}
              className="flex items-center gap-3 border border-border bg-surface px-4 py-3 text-sm hover:border-border-strong"
            >
              <OrderStatusBadge status={status} />
              <span className="font-medium">{formatNumber(statusCounts[status] ?? 0)}</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg">Đơn hàng gần đây</h2>
            <Link href="/admin/orders" className="text-sm text-accent hover:underline">
              Xem tất cả
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto border border-border">
              <table className="w-full min-w-[520px] text-sm">
                <thead className="bg-surface-muted/60 text-left">
                  <tr>
                    <th scope="col" className="px-4 py-2 font-medium">
                      Mã đơn
                    </th>
                    <th scope="col" className="px-4 py-2 font-medium">
                      Khách
                    </th>
                    <th scope="col" className="px-4 py-2 font-medium">
                      Ngày
                    </th>
                    <th scope="col" className="px-4 py-2 font-medium">
                      Trạng thái
                    </th>
                    <th scope="col" className="px-4 py-2 text-right font-medium">
                      Tổng
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-surface">
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-4 py-2">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-mono text-xs hover:text-accent"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-4 py-2">{order.customerName}</td>
                      <td className="px-4 py-2 text-xs text-muted">
                        {formatDateTime(order.createdAt)}
                      </td>
                      <td className="px-4 py-2">
                        <OrderStatusBadge status={order.orderStatus} />
                      </td>
                      <td className="px-4 py-2 text-right">{formatVnd(order.grandTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="border border-dashed border-border-strong bg-surface/60 px-4 py-8 text-center text-sm text-muted">
              Chưa có đơn hàng nào.
            </p>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg">Tồn kho thấp</h2>
          {lowStock.length > 0 ? (
            <ul className="divide-y divide-border border border-border bg-surface">
              {lowStock.map((product) => (
                <li key={product.id} className="flex items-center justify-between gap-3 p-3">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="min-w-0 text-sm hover:text-accent"
                  >
                    <span className="block truncate">{product.name}</span>
                    <span className="font-mono text-xs text-muted">{product.sku}</span>
                  </Link>
                  <Badge variant={product.stockQuantity === 0 ? "danger" : "warning"}>
                    {product.stockQuantity === 0 ? "Hết hàng" : `Còn ${product.stockQuantity}`}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="border border-dashed border-border-strong bg-surface/60 px-4 py-8 text-center text-sm text-muted">
              Không có sản phẩm nào sắp hết hàng.
            </p>
          )}
        </section>
      </div>

      <p className="border border-border bg-surface-muted/40 p-4 text-xs text-muted">
        Trạng thái đơn hợp lệ: {ORDER_STATUSES.map((status) => orderStatusLabels[status]).join(" → ")}
        . Đơn đã huỷ sẽ được hoàn lại tồn kho tự động.
      </p>
    </div>
  );
}
