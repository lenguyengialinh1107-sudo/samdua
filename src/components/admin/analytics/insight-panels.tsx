import {
  AlertTriangle,
  BookOpen,
  Clock,
  Eye,
  Package,
  PackageX,
  Repeat,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

import { AnalyticsPanel, MiniStat } from "@/components/admin/analytics/analytics-panel";
import type { BlogInsights, CustomerInsights, InventoryInsights } from "@/lib/analytics/types";
import { formatNumber, formatVnd } from "@/lib/format";

/** Khối khách hàng: tổng khách, khách quay lại, tỉ lệ giữ chân, top khách. */
export function CustomersPanel({ data }: { data: CustomerInsights }) {
  return (
    <AnalyticsPanel title="Khách hàng" description="Tệp khách hàng và mức độ trung thành.">
      <div className="grid gap-3 sm:grid-cols-3">
        <MiniStat label="Tổng khách hàng" value={formatNumber(data.totalCustomers)} icon={Users} />
        <MiniStat label="Khách quay lại" value={formatNumber(data.returningCustomers)} icon={Repeat} />
        <MiniStat
          label="Tỉ lệ khách quay lại"
          value={`${data.retentionRate.toFixed(1)}%`}
          icon={TrendingUp}
        />
      </div>

      <div className="mt-5">
        <p className="ah-label">Khách hàng chi tiêu nhiều nhất</p>
        <ul className="mt-3 divide-y divide-border border border-border">
          {data.topCustomers.map((customer, index) => (
            <li
              key={customer.name}
              className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-surface-muted/40"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-xs bg-accent-soft font-mono text-xs text-accent">
                  {index + 1}
                </span>
                <span className="truncate font-medium">{customer.name}</span>
              </span>
              <span className="flex shrink-0 items-center gap-4 text-xs text-muted">
                <span className="inline-flex items-center gap-1">
                  <Star className="size-3.5" aria-hidden />
                  {formatNumber(customer.orders)} đơn
                </span>
                <span className="text-foreground">{formatVnd(customer.spent)}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </AnalyticsPanel>
  );
}

/** Khối đo lường nội dung blog. */
export function BlogAnalyticsPanel({ data }: { data: BlogInsights }) {
  return (
    <AnalyticsPanel title="Blog" description="Hiệu quả nội dung và mức độ quan tâm của độc giả.">
      <div className="grid gap-3 sm:grid-cols-2">
        <MiniStat label="Tổng lượt xem blog" value={formatNumber(data.totalViews)} icon={BookOpen} />
        <MiniStat
          label="Thời gian đọc trung bình"
          value={`${data.averageReadingMinutes.toFixed(1)} phút`}
          icon={Clock}
        />
      </div>

      <div className="mt-5">
        <p className="ah-label">Bài viết xem nhiều nhất</p>
        <ul className="mt-3 divide-y divide-border border border-border">
          {data.mostRead.map((article) => (
            <li
              key={article.slug}
              className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-surface-muted/40"
            >
              <span className="min-w-0 truncate">{article.title}</span>
              <span className="flex shrink-0 items-center gap-3 text-xs text-muted">
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3.5" aria-hidden />
                  {article.readingMinutes} phút
                </span>
                <span className="inline-flex items-center gap-1 text-foreground">
                  <Eye className="size-3.5" aria-hidden />
                  {formatNumber(article.views)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </AnalyticsPanel>
  );
}

/** Khối tình trạng kho hàng. */
export function InventoryPanel({ data }: { data: InventoryInsights }) {
  return (
    <AnalyticsPanel title="Kho hàng" description="Tổng quan tồn kho hiện tại.">
      <div className="grid gap-3">
        <MiniStat label="Tổng sản phẩm" value={formatNumber(data.totalProducts)} icon={Package} />
        <MiniStat
          label="Sắp hết hàng"
          value={formatNumber(data.lowStock)}
          icon={AlertTriangle}
          hint={`Tồn kho ≤ ${data.lowStockThreshold} sản phẩm`}
        />
        <MiniStat label="Hết hàng" value={formatNumber(data.outOfStock)} icon={PackageX} />
      </div>
    </AnalyticsPanel>
  );
}
