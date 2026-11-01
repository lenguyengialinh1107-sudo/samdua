import { Badge } from "@/components/ui/badge";
import type { ProductPerformanceRow } from "@/lib/analytics/types";
import { formatNumber, formatVnd } from "@/lib/format";

/** Ngưỡng "sắp hết hàng" — khớp với `findLowStockProducts(threshold = 2)` của app. */
const LOW_STOCK_THRESHOLD = 2;

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <Badge variant="danger">Hết hàng</Badge>;
  if (stock <= LOW_STOCK_THRESHOLD) return <Badge variant="warning">Còn {formatNumber(stock)}</Badge>;
  return <Badge variant="success">{formatNumber(stock)}</Badge>;
}

export type ProductMetric = "views" | "orders";

const METRIC_COLUMNS: Record<ProductMetric, [string, string]> = {
  views: ["Lượt xem", "Thêm vào giỏ"],
  orders: ["Đơn hàng", "Doanh thu"],
};

/**
 * Bảng hiệu suất sản phẩm.
 * `metric="views"` → sản phẩm xem nhiều; `metric="orders"` → sản phẩm bán chạy.
 */
export function ProductPerformanceTable({
  rows,
  metric,
}: {
  rows: ProductPerformanceRow[];
  metric: ProductMetric;
}) {
  const [firstLabel, secondLabel] = METRIC_COLUMNS[metric];

  return (
    <div className="overflow-x-auto border border-border">
      <table className="w-full min-w-[720px] text-sm">
        <thead className="bg-surface-muted/60 text-left">
          <tr>
            <th scope="col" className="px-4 py-2 font-medium">Sản phẩm</th>
            <th scope="col" className="px-4 py-2 font-medium">Danh mục</th>
            <th scope="col" className="px-4 py-2 text-right font-medium">{firstLabel}</th>
            <th scope="col" className="px-4 py-2 text-right font-medium">{secondLabel}</th>
            <th scope="col" className="px-4 py-2 text-right font-medium">Tồn kho</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-surface">
          {rows.map((row) => (
            <tr key={row.id} className="transition-colors hover:bg-surface-muted/40">
              <td className="px-4 py-2.5 font-medium">{row.name}</td>
              <td className="px-4 py-2.5 text-muted">{row.category}</td>
              {metric === "views" ? (
                <>
                  <td className="px-4 py-2.5 text-right">{formatNumber(row.views)}</td>
                  <td className="px-4 py-2.5 text-right">{formatNumber(row.addedToCart)}</td>
                </>
              ) : (
                <>
                  <td className="px-4 py-2.5 text-right">{formatNumber(row.orders)}</td>
                  <td className="px-4 py-2.5 text-right">{formatVnd(row.revenue)}</td>
                </>
              )}
              <td className="px-4 py-2.5 text-right">
                <StockBadge stock={row.stock} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
