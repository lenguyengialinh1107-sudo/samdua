import type { Metadata } from "next";
import type { ComponentType } from "react";
import {
  CalendarCheck,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  ClipboardList,
  Clock,
  Eye,
  ShoppingCart,
  TrendingUp,
  Users,
  Wallet,
  XCircle,
} from "lucide-react";

import { AnalyticsPanel } from "@/components/admin/analytics/analytics-panel";
import {
  ProductViewsBarChart,
  RevenueAreaChart,
  TrafficSourcesPieChart,
  VisitorsLineChart,
} from "@/components/admin/analytics/analytics-charts";
import {
  BlogAnalyticsPanel,
  CustomersPanel,
  InventoryPanel,
} from "@/components/admin/analytics/insight-panels";
import { ProductPerformanceTable } from "@/components/admin/analytics/product-performance-table";
import { RecentOrdersTable } from "@/components/admin/analytics/recent-orders-table";
import { StatCard } from "@/components/admin/analytics/stat-card";
import { getAnalyticsSnapshot } from "@/lib/analytics/mock-analytics";
import type { AnalyticsStatKey } from "@/lib/analytics/types";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = {
  title: "Đo lường hiệu quả",
};

const STAT_ICONS: Record<AnalyticsStatKey, ComponentType<{ className?: string }>> = {
  totalVisitors: Users,
  visitorsToday: CalendarDays,
  visitorsThisWeek: CalendarRange,
  visitorsThisMonth: CalendarCheck,
  productViews: Eye,
  addedToCart: ShoppingCart,
  totalOrders: ClipboardList,
  pendingOrders: Clock,
  completedOrders: CheckCircle2,
  cancelledOrders: XCircle,
  revenue: Wallet,
  averageOrderValue: TrendingUp,
};

export default async function AdminAnalyticsPage() {
  const snapshot = await getAnalyticsSnapshot();

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="font-serif text-2xl">Đo lường hiệu quả</h1>
        <p className="text-sm text-muted">
          Số liệu tổng hợp về truy cập, sản phẩm, đơn hàng, nội dung và kho hàng.
          Số liệu là dữ liệu minh hoạ (nguồn: {snapshot.source}) — cập nhật{" "}
          {formatDateTime(snapshot.generatedAt)}.
        </p>
      </header>

      {/* Thẻ thống kê theo nhóm */}
      {snapshot.statGroups.map((group) => (
        <section key={group.key} aria-label={group.title} className="space-y-4">
          <div>
            <h2 className="font-serif text-lg">{group.title}</h2>
            {group.description ? (
              <p className="mt-0.5 text-sm text-muted">{group.description}</p>
            ) : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {group.stats.map((stat) => (
              <StatCard key={stat.key} stat={stat} icon={STAT_ICONS[stat.key]} />
            ))}
          </div>
        </section>
      ))}

      {/* Biểu đồ: lượt truy cập 30 ngày */}
      <AnalyticsPanel
        title="Lượt truy cập 30 ngày gần nhất"
        description="Số lượt truy cập theo từng ngày."
      >
        <VisitorsLineChart data={snapshot.visitors30Days} />
      </AnalyticsPanel>

      {/* Biểu đồ: lượt xem theo danh mục + nguồn truy cập */}
      <div className="grid gap-6 xl:grid-cols-2">
        <AnalyticsPanel
          title="Lượt xem sản phẩm theo danh mục"
          description="Tính theo danh mục thật của cửa hàng."
        >
          <ProductViewsBarChart data={snapshot.productViewsByCategory} />
        </AnalyticsPanel>

        <AnalyticsPanel
          title="Nguồn truy cập"
          description="Tỉ trọng khách đến từ từng kênh."
        >
          <TrafficSourcesPieChart data={snapshot.trafficSources} />
        </AnalyticsPanel>
      </div>

      {/* Biểu đồ: doanh thu theo tháng */}
      <AnalyticsPanel title="Doanh thu theo tháng" description="Doanh thu 12 tháng gần nhất.">
        <RevenueAreaChart data={snapshot.monthlyRevenue} />
      </AnalyticsPanel>

      {/* Sản phẩm xem nhiều */}
      <AnalyticsPanel
        title="Sản phẩm xem nhiều nhất"
        description="Xếp theo lượt xem trên cửa hàng."
      >
        <ProductPerformanceTable rows={snapshot.mostViewedProducts} metric="views" />
      </AnalyticsPanel>

      {/* Sản phẩm bán chạy */}
      <AnalyticsPanel
        title="Sản phẩm bán chạy"
        description="Xếp theo số đơn hàng và doanh thu."
      >
        <ProductPerformanceTable rows={snapshot.bestSellingProducts} metric="orders" />
      </AnalyticsPanel>

      {/* Đơn hàng gần đây */}
      <AnalyticsPanel
        title="Đơn hàng gần đây"
        description="Các đơn hàng mới nhất trên cửa hàng."
      >
        <RecentOrdersTable rows={snapshot.recentOrders} />
      </AnalyticsPanel>

      {/* Khách hàng / Kho hàng */}
      <div className="grid gap-6 xl:grid-cols-2">
        <CustomersPanel data={snapshot.customers} />
        <InventoryPanel data={snapshot.inventory} />
      </div>

      {/* Blog */}
      <BlogAnalyticsPanel data={snapshot.blog} />

      <p className="border border-border bg-surface-muted/40 p-4 text-xs text-muted">
        Toàn bộ số liệu hiện là dữ liệu mẫu phục vụ minh hoạ, không gửi hay lưu dữ liệu
        người dùng. Tên sản phẩm, danh mục và bài viết lấy đúng theo catalog thật của
        website. Dashboard được tách lớp qua <code>AnalyticsProvider</code> để sẵn sàng kết
        nối Google Analytics 4, Meta Pixel, Google Search Console, Firebase hoặc Supabase
        sau này.
      </p>
    </div>
  );
}
