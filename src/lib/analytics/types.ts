/**
 * Kiểu dữ liệu cho dashboard đo lường hiệu quả (Analytics) của Second Shot.
 *
 * Số liệu hiện lấy từ mock data (xem `mock-analytics.ts`) nhưng TÊN sản phẩm,
 * danh mục và bài viết được lấy đúng theo catalog thật của website.
 * Các kiểu ở đây độc lập với nguồn dữ liệu để sau này có thể thay bằng
 * Google Analytics 4, Meta Pixel, Search Console, Firebase hoặc Supabase
 * mà không phải sửa component giao diện.
 */

import type { OrderStatusValue } from "@/lib/order-status";

/** Cách hiển thị giá trị của một thẻ thống kê. */
export type StatFormat = "count" | "currency" | "percent";

/** Khoá định danh các thẻ thống kê ở đầu dashboard. */
export type AnalyticsStatKey =
  | "totalVisitors"
  | "visitorsToday"
  | "visitorsThisWeek"
  | "visitorsThisMonth"
  | "productViews"
  | "addedToCart"
  | "totalOrders"
  | "pendingOrders"
  | "completedOrders"
  | "cancelledOrders"
  | "revenue"
  | "averageOrderValue";

export interface AnalyticsStat {
  key: AnalyticsStatKey;
  label: string;
  value: number;
  format: StatFormat;
  /** Xu hướng so với kỳ trước, theo phần trăm (12.4 nghĩa là +12,4%). */
  trend?: number;
  hint?: string;
}

/** Nhóm thẻ thống kê, dùng để chia khối trên dashboard. */
export interface AnalyticsStatGroup {
  key: "website" | "products" | "orders";
  title: string;
  description?: string;
  stats: AnalyticsStat[];
}

export interface TimeSeriesPoint {
  label: string;
  value: number;
}

export interface CategoryViewsPoint {
  category: string;
  views: number;
}

export interface TrafficSourcePoint {
  source: string;
  visitors: number;
}

export interface MonthlyRevenuePoint {
  month: string;
  revenue: number;
}

/** Một dòng hiệu suất sản phẩm — tên/danh mục lấy từ catalog thật. */
export interface ProductPerformanceRow {
  id: string;
  name: string;
  category: string;
  views: number;
  addedToCart: number;
  orders: number;
  revenue: number;
  stock: number;
}

export interface RecentOrderRow {
  orderNumber: string;
  customerName: string;
  items: number;
  paymentMethod: string;
  status: OrderStatusValue;
  value: number;
  createdAt: string;
}

export interface TopCustomerRow {
  name: string;
  orders: number;
  spent: number;
}

export interface CustomerInsights {
  totalCustomers: number;
  returningCustomers: number;
  /** Tỉ lệ khách quay lại, theo phần trăm (0–100). */
  retentionRate: number;
  topCustomers: TopCustomerRow[];
}

/** Một bài viết — tiêu đề lấy từ module blog thật của website. */
export interface BlogArticleStat {
  title: string;
  slug: string;
  views: number;
  readingMinutes: number;
}

export interface BlogInsights {
  totalViews: number;
  averageReadingMinutes: number;
  mostRead: BlogArticleStat[];
}

export interface InventoryInsights {
  totalProducts: number;
  lowStock: number;
  outOfStock: number;
  /** Ngưỡng được coi là "sắp hết hàng". */
  lowStockThreshold: number;
}

/** Toàn bộ dữ liệu một lần tải của dashboard đo lường. */
export interface AnalyticsSnapshot {
  statGroups: AnalyticsStatGroup[];
  visitors30Days: TimeSeriesPoint[];
  productViewsByCategory: CategoryViewsPoint[];
  trafficSources: TrafficSourcePoint[];
  monthlyRevenue: MonthlyRevenuePoint[];
  mostViewedProducts: ProductPerformanceRow[];
  bestSellingProducts: ProductPerformanceRow[];
  recentOrders: RecentOrderRow[];
  customers: CustomerInsights;
  blog: BlogInsights;
  inventory: InventoryInsights;
  /** Nguồn dữ liệu đang dùng, ví dụ "mock". */
  source: string;
  generatedAt: string;
}

/**
 * Cổng lấy dữ liệu đo lường. Khi tích hợp dịch vụ thật, chỉ cần tạo một
 * implementation khác (GA4 / Meta Pixel / Search Console / Firebase / Supabase)
 * và trả về cùng `AnalyticsSnapshot`.
 */
export interface AnalyticsProvider {
  id: string;
  label: string;
  getSnapshot(): Promise<AnalyticsSnapshot>;
}
