import { OrderStatusBadge } from "@/components/order/order-status-badge";
import type { RecentOrderRow } from "@/lib/analytics/types";
import { formatDateTime, formatVnd } from "@/lib/format";

/** Bảng đơn hàng gần đây trên dashboard đo lường. */
export function RecentOrdersTable({ rows }: { rows: RecentOrderRow[] }) {
  return (
    <div className="overflow-x-auto border border-border">
      <table className="w-full min-w-[860px] text-sm">
        <thead className="bg-surface-muted/60 text-left">
          <tr>
            <th scope="col" className="px-4 py-2 font-medium">Mã đơn</th>
            <th scope="col" className="px-4 py-2 font-medium">Khách hàng</th>
            <th scope="col" className="px-4 py-2 text-right font-medium">Sản phẩm</th>
            <th scope="col" className="px-4 py-2 font-medium">Thanh toán</th>
            <th scope="col" className="px-4 py-2 font-medium">Trạng thái</th>
            <th scope="col" className="px-4 py-2 text-right font-medium">Giá trị</th>
            <th scope="col" className="px-4 py-2 font-medium">Ngày</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-surface">
          {rows.map((row) => (
            <tr key={row.orderNumber} className="transition-colors hover:bg-surface-muted/40">
              <td className="px-4 py-2.5 font-mono text-xs">{row.orderNumber}</td>
              <td className="px-4 py-2.5">{row.customerName}</td>
              <td className="px-4 py-2.5 text-right">{row.items}</td>
              <td className="px-4 py-2.5 text-muted">{row.paymentMethod}</td>
              <td className="px-4 py-2.5">
                <OrderStatusBadge status={row.status} />
              </td>
              <td className="px-4 py-2.5 text-right">{formatVnd(row.value)}</td>
              <td className="px-4 py-2.5 text-xs text-muted">{formatDateTime(row.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
