/**
 * Dữ liệu mẫu cho dashboard đo lường hiệu quả.
 *
 * Nguyên tắc:
 * - SỐ LIỆU (lượt xem, đơn hàng, doanh thu, truy cập...) là dữ liệu mẫu.
 * - TÊN sản phẩm & danh mục được lấy đúng theo catalog thật của website
 *   (xem `prisma/seed.ts`); tiêu đề bài viết lấy trực tiếp từ module blog thật
 *   (`@/lib/blog/mock-posts`) nên không bị lệch tên.
 *
 * Đây là nguồn dữ liệu DUY NHẤT của dashboard. Khi cần số liệu thật, tạo một
 * `AnalyticsProvider` mới (GA4 / Meta Pixel / Search Console / Firebase /
 * Supabase) trả về cùng kiểu `AnalyticsSnapshot` rồi thay `analyticsProvider`.
 */

import type {
  AnalyticsProvider,
  AnalyticsSnapshot,
  AnalyticsStatGroup,
  BlogInsights,
  CategoryViewsPoint,
  CustomerInsights,
  InventoryInsights,
  MonthlyRevenuePoint,
  ProductPerformanceRow,
  RecentOrderRow,
  TimeSeriesPoint,
  TrafficSourcePoint,
} from "@/lib/analytics/types";
import { mockBlogPosts } from "@/lib/blog/mock-posts";

/** Ngưỡng "sắp hết hàng" — khớp với `findLowStockProducts(threshold = 2)` của app. */
const LOW_STOCK_THRESHOLD = 2;

/** Tên danh mục lấy đúng theo catalog thật. */
const CATEGORY = {
  film: "Máy film",
  digital: "Digital & Compact",
  lens: "Lens",
  accessory: "Phụ kiện",
} as const;

/** Một mặt hàng trong catalog thật (tên/giá/tồn kho theo `prisma/seed.ts`). */
interface CatalogEntry {
  slug: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

/** Số liệu mẫu gắn cho từng mặt hàng. */
interface ProductMetric {
  views: number;
  addedToCart: number;
  orders: number;
}

const CATALOG: CatalogEntry[] = [
  {
    slug: "canon-ae-1-program-50mm-f18-demo",
    name: "Canon AE-1 Program + FD 50mm f/1.8",
    category: CATEGORY.film,
    price: 4_200_000,
    stock: 2,
  },
  {
    slug: "nikon-fm2-nikkor-50mm-f14-demo",
    name: "Nikon FM2 + Nikkor 50mm f/1.4",
    category: CATEGORY.film,
    price: 6_500_000,
    stock: 1,
  },
  {
    slug: "olympus-om-1-zuiko-50mm-f18-demo",
    name: "Olympus OM-1 + Zuiko 50mm f/1.8",
    category: CATEGORY.film,
    price: 3_800_000,
    stock: 3,
  },
  {
    slug: "pentax-k1000-smc-50mm-f2-demo",
    name: "Pentax K1000 + SMC 50mm f/2",
    category: CATEGORY.film,
    price: 3_200_000,
    stock: 2,
  },
  {
    slug: "yashica-mat-124g-tlr-demo",
    name: "Yashica Mat-124G (TLR medium format)",
    category: CATEGORY.film,
    price: 7_900_000,
    stock: 1,
  },
  {
    slug: "contax-t2-compact-demo",
    name: "Contax T2 (compact film cao cấp)",
    category: CATEGORY.digital,
    price: 18_500_000,
    stock: 1,
  },
  {
    slug: "fujifilm-x100v-demo",
    name: "Fujifilm X100V (silver)",
    category: CATEGORY.digital,
    price: 26_900_000,
    stock: 2,
  },
  {
    slug: "sony-a7-iii-body-demo",
    name: "Sony A7 III (body)",
    category: CATEGORY.digital,
    price: 27_500_000,
    stock: 1,
  },
  {
    slug: "canon-eos-r50-kit-demo",
    name: "Canon EOS R50 + RF-S 18-45mm (new)",
    category: CATEGORY.digital,
    price: 17_990_000,
    stock: 4,
  },
  {
    slug: "nikkor-50mm-f18g-demo",
    name: "Nikon AF-S Nikkor 50mm f/1.8G",
    category: CATEGORY.lens,
    price: 2_300_000,
    stock: 3,
  },
  {
    slug: "canon-fd-28mm-f28-demo",
    name: "Canon FD 28mm f/2.8",
    category: CATEGORY.lens,
    price: 1_750_000,
    stock: 2,
  },
  {
    slug: "peak-design-cuff-strap-demo",
    name: "Dây đeo tay Peak Design Cuff",
    category: CATEGORY.accessory,
    price: 950_000,
    stock: 8,
  },
  {
    slug: "kodak-portra-400-box-5-demo",
    name: "Film Kodak Portra 400 (hộp 5 cuộn)",
    category: CATEGORY.accessory,
    price: 1_250_000,
    stock: 10,
  },
  {
    slug: "leica-m6-classic-demo",
    name: "Leica M6 Classic + Summicron 35mm",
    category: CATEGORY.film,
    price: 89_000_000,
    stock: 1,
  },
];

const PRODUCT_METRICS: Record<string, ProductMetric> = {
  "canon-ae-1-program-50mm-f18-demo": { views: 24_860, addedToCart: 412, orders: 96 },
  "nikon-fm2-nikkor-50mm-f14-demo": { views: 21_340, addedToCart: 318, orders: 74 },
  "olympus-om-1-zuiko-50mm-f18-demo": { views: 18_920, addedToCart: 366, orders: 88 },
  "pentax-k1000-smc-50mm-f2-demo": { views: 26_140, addedToCart: 502, orders: 132 },
  "yashica-mat-124g-tlr-demo": { views: 12_480, addedToCart: 178, orders: 41 },
  "contax-t2-compact-demo": { views: 19_760, addedToCart: 241, orders: 58 },
  "fujifilm-x100v-demo": { views: 32_510, addedToCart: 588, orders: 143 },
  "sony-a7-iii-body-demo": { views: 28_270, addedToCart: 421, orders: 102 },
  "canon-eos-r50-kit-demo": { views: 22_930, addedToCart: 690, orders: 176 },
  "nikkor-50mm-f18g-demo": { views: 14_360, addedToCart: 505, orders: 121 },
  "canon-fd-28mm-f28-demo": { views: 9_845, addedToCart: 349, orders: 87 },
  "peak-design-cuff-strap-demo": { views: 8_120, addedToCart: 812, orders: 214 },
  "kodak-portra-400-box-5-demo": { views: 17_540, addedToCart: 1_264, orders: 386 },
  "leica-m6-classic-demo": { views: 30_180, addedToCart: 62, orders: 12 },
};

/** Lượt xem mẫu cho từng bài viết, key theo slug thật. */
const BLOG_VIEWS: Record<string, number> = {
  "huong-dan-chon-may-anh-film-cho-nguoi-moi": 12_840,
  "kodak-gold-200-hay-fujifilm-400": 10_260,
  "review-olympus-superzoom-70": 6_140,
  "5-loi-nguoi-moi-choi-film-thuong-mac": 7_430,
  "cach-bao-quan-may-anh-film": 6_120,
  "nhung-dia-diem-chup-anh-film-dep": 5_680,
  "cach-chon-cuon-film-theo-dieu-kien-anh-sang": 4_320,
};

/** Lượt truy cập 30 ngày gần nhất (mỗi phần tử là một ngày). */
const VISITOR_TREND = [
  1120, 1180, 1265, 1095, 1340, 1415, 980, 1310, 1450, 1520, 1265, 1190, 1385,
  1470, 1320, 1245, 1560, 1615, 1130, 1395, 1485, 1540, 1290, 1215, 1425, 1580,
  1640, 1370, 1274, 1305,
];

/** Doanh thu theo tháng (đơn vị: VND). */
const MONTHLY_REVENUE: MonthlyRevenuePoint[] = [
  { month: "T1", revenue: 1_050_000_000 },
  { month: "T2", revenue: 980_000_000 },
  { month: "T3", revenue: 1_120_000_000 },
  { month: "T4", revenue: 1_185_000_000 },
  { month: "T5", revenue: 1_240_000_000 },
  { month: "T6", revenue: 1_315_000_000 },
  { month: "T7", revenue: 1_265_000_000 },
  { month: "T8", revenue: 1_390_000_000 },
  { month: "T9", revenue: 1_445_000_000 },
  { month: "T10", revenue: 1_370_000_000 },
  { month: "T11", revenue: 1_420_000_000 },
  { month: "T12", revenue: 1_209_000_000 },
];

const TRAFFIC_SOURCES: TrafficSourcePoint[] = [
  { source: "Google", visitors: 68_450 },
  { source: "Facebook", visitors: 42_180 },
  { source: "Instagram", visitors: 31_260 },
  { source: "TikTok", visitors: 22_740 },
  { source: "Direct", visitors: 14_390 },
  { source: "Email", visitors: 5_300 },
];

const RECENT_ORDERS: RecentOrderRow[] = [
  {
    orderNumber: "SS20261031-0142",
    customerName: "Nguyễn Hoàng Nam",
    items: 2,
    paymentMethod: "Chuyển khoản",
    status: "PENDING",
    value: 4_200_000,
    createdAt: "2026-10-31T08:42:00+07:00",
  },
  {
    orderNumber: "SS20261031-0141",
    customerName: "Trần Minh Thư",
    items: 5,
    paymentMethod: "COD",
    status: "CONFIRMED",
    value: 6_250_000,
    createdAt: "2026-10-31T07:15:00+07:00",
  },
  {
    orderNumber: "SS20261030-0138",
    customerName: "Lê Anh Đức",
    items: 1,
    paymentMethod: "Chuyển khoản",
    status: "SHIPPING",
    value: 26_900_000,
    createdAt: "2026-10-30T18:20:00+07:00",
  },
  {
    orderNumber: "SS20261030-0135",
    customerName: "Phạm Thu Hà",
    items: 3,
    paymentMethod: "COD",
    status: "COMPLETED",
    value: 2_300_000,
    createdAt: "2026-10-30T14:05:00+07:00",
  },
  {
    orderNumber: "SS20261030-0131",
    customerName: "Đỗ Quang Huy",
    items: 1,
    paymentMethod: "Chuyển khoản",
    status: "CANCELLED",
    value: 6_500_000,
    createdAt: "2026-10-30T10:48:00+07:00",
  },
  {
    orderNumber: "SS20261029-0127",
    customerName: "Vũ Ngọc Mai",
    items: 4,
    paymentMethod: "COD",
    status: "COMPLETED",
    value: 1_250_000,
    createdAt: "2026-10-29T16:32:00+07:00",
  },
];

/** Xây nhãn ngày dạng "dd/mm" cho chuỗi 30 ngày, kết thúc ở ngày cố định. */
function buildVisitorSeries(values: number[]): TimeSeriesPoint[] {
  const endDate = Date.UTC(2026, 9, 31); // 31/10/2026
  const dayMs = 24 * 60 * 60 * 1000;

  return values.map((value, index) => {
    const date = new Date(endDate - (values.length - 1 - index) * dayMs);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    return { label: `${day}/${month}`, value };
  });
}

/** Ghép catalog thật với số liệu mẫu để tạo dòng hiệu suất sản phẩm. */
function buildProductRows(): ProductPerformanceRow[] {
  return CATALOG.map((entry) => {
    const metric = PRODUCT_METRICS[entry.slug] ?? { views: 0, addedToCart: 0, orders: 0 };
    return {
      id: entry.slug,
      name: entry.name,
      category: entry.category,
      views: metric.views,
      addedToCart: metric.addedToCart,
      orders: metric.orders,
      revenue: metric.orders * entry.price,
      stock: entry.stock,
    };
  });
}

/** Lượt xem sản phẩm theo danh mục — tính từ dữ liệu sản phẩm ở trên. */
function buildCategoryViews(rows: ProductPerformanceRow[]): CategoryViewsPoint[] {
  const order = [CATEGORY.film, CATEGORY.digital, CATEGORY.lens, CATEGORY.accessory];
  const totals = new Map<string, number>();
  for (const row of rows) {
    totals.set(row.category, (totals.get(row.category) ?? 0) + row.views);
  }
  return order.map((category) => ({ category, views: totals.get(category) ?? 0 }));
}

/** Số liệu blog — tiêu đề lấy từ module blog thật. */
function buildBlogInsights(): BlogInsights {
  const articles = mockBlogPosts.map((post) => ({
    title: post.title,
    slug: post.slug,
    views: BLOG_VIEWS[post.slug] ?? 0,
    readingMinutes: post.readingMinutes,
  }));

  const totalViews = articles.reduce((sum, article) => sum + article.views, 0);
  const totalMinutes = articles.reduce((sum, article) => sum + article.readingMinutes, 0);

  return {
    totalViews,
    averageReadingMinutes: articles.length > 0 ? totalMinutes / articles.length : 0,
    mostRead: [...articles].sort((a, b) => b.views - a.views).slice(0, 5),
  };
}

function buildInventoryInsights(rows: ProductPerformanceRow[]): InventoryInsights {
  return {
    totalProducts: rows.length,
    lowStock: rows.filter((row) => row.stock > 0 && row.stock <= LOW_STOCK_THRESHOLD).length,
    outOfStock: rows.filter((row) => row.stock === 0).length,
    lowStockThreshold: LOW_STOCK_THRESHOLD,
  };
}

function buildCustomerInsights(): CustomerInsights {
  const totalCustomers = 3_142;
  const returningCustomers = 1_264;
  return {
    totalCustomers,
    returningCustomers,
    retentionRate: (returningCustomers / totalCustomers) * 100,
    topCustomers: [
      { name: "Canon Studio Hà Nội", orders: 42, spent: 386_400_000 },
      { name: "Trần Minh Thư", orders: 28, spent: 142_800_000 },
      { name: "Lê Anh Đức", orders: 24, spent: 128_650_000 },
      { name: "Phạm Thu Hà", orders: 19, spent: 96_320_000 },
      { name: "Nguyễn Hoàng Nam", orders: 16, spent: 78_940_000 },
    ],
  };
}

function buildSnapshot(): AnalyticsSnapshot {
  const productRows = buildProductRows();
  const visitors = buildVisitorSeries(VISITOR_TREND);
  const visitorsToday = visitors[visitors.length - 1]?.value ?? 0;
  const visitorsThisWeek = visitors.slice(-7).reduce((sum, point) => sum + point.value, 0);
  const visitorsThisMonth = visitors.reduce((sum, point) => sum + point.value, 0);

  const productViews = productRows.reduce((sum, row) => sum + row.views, 0);
  const addedToCart = productRows.reduce((sum, row) => sum + row.addedToCart, 0);

  const totalOrders = 4_268;
  const pendingOrders = 140;
  const completedOrders = 3_914;
  const cancelledOrders = 214;
  const revenue = MONTHLY_REVENUE.reduce((sum, point) => sum + point.revenue, 0);

  const statGroups: AnalyticsStatGroup[] = [
    {
      key: "website",
      title: "Hiệu suất website",
      description: "Lưu lượng truy cập theo ngày, tuần và tháng.",
      stats: [
        { key: "totalVisitors", label: "Tổng lượt truy cập", value: 184_320, format: "count", trend: 12.4 },
        { key: "visitorsToday", label: "Truy cập hôm nay", value: visitorsToday, format: "count", trend: 2.4 },
        { key: "visitorsThisWeek", label: "Truy cập tuần này", value: visitorsThisWeek, format: "count", trend: 5.1 },
        { key: "visitorsThisMonth", label: "Truy cập tháng này", value: visitorsThisMonth, format: "count", trend: 8.7 },
      ],
    },
    {
      key: "products",
      title: "Hiệu suất sản phẩm",
      description: "Mức độ quan tâm tới các sản phẩm trong catalog.",
      stats: [
        { key: "productViews", label: "Lượt xem sản phẩm", value: productViews, format: "count", trend: 9.3 },
        { key: "addedToCart", label: "Thêm vào giỏ hàng", value: addedToCart, format: "count", trend: -2.3 },
      ],
    },
    {
      key: "orders",
      title: "Đơn hàng",
      description: "Tình hình đơn hàng và doanh thu 12 tháng.",
      stats: [
        { key: "totalOrders", label: "Tổng đơn hàng", value: totalOrders, format: "count", trend: 9.2 },
        { key: "pendingOrders", label: "Đơn chờ xác nhận", value: pendingOrders, format: "count", trend: -4.6 },
        { key: "completedOrders", label: "Đơn hoàn tất", value: completedOrders, format: "count", trend: 7.4 },
        { key: "cancelledOrders", label: "Đơn đã huỷ", value: cancelledOrders, format: "count", trend: -1.8 },
        { key: "revenue", label: "Doanh thu", value: revenue, format: "currency", trend: 11.5 },
        {
          key: "averageOrderValue",
          label: "Giá trị đơn trung bình",
          value: Math.round(revenue / totalOrders),
          format: "currency",
          trend: 2.1,
        },
      ],
    },
  ];

  return {
    statGroups,
    visitors30Days: visitors,
    productViewsByCategory: buildCategoryViews(productRows),
    trafficSources: TRAFFIC_SOURCES,
    monthlyRevenue: MONTHLY_REVENUE,
    mostViewedProducts: [...productRows].sort((a, b) => b.views - a.views).slice(0, 6),
    bestSellingProducts: [...productRows].sort((a, b) => b.orders - a.orders).slice(0, 6),
    recentOrders: RECENT_ORDERS,
    customers: buildCustomerInsights(),
    blog: buildBlogInsights(),
    inventory: buildInventoryInsights(productRows),
    source: "mock",
    generatedAt: new Date("2026-10-31T09:00:00+07:00").toISOString(),
  };
}

export const mockAnalyticsSnapshot: AnalyticsSnapshot = buildSnapshot();

/**
 * Provider mặc định — trả dữ liệu mẫu.
 *
 * Để chuyển sang dữ liệu thật, tạo provider mới, ví dụ:
 *   export const ga4Provider: AnalyticsProvider = {
 *     id: "ga4",
 *     label: "Google Analytics 4",
 *     async getSnapshot() { ...gọi GA4 Data API... },
 *   };
 * rồi đổi `analyticsProvider` bên dưới.
 */
export const mockAnalyticsProvider: AnalyticsProvider = {
  id: "mock",
  label: "Dữ liệu mẫu",
  async getSnapshot() {
    return mockAnalyticsSnapshot;
  },
};

/** Provider đang được dashboard sử dụng. */
export const analyticsProvider: AnalyticsProvider = mockAnalyticsProvider;

/** Lấy toàn bộ số liệu cho dashboard đo lường. */
export async function getAnalyticsSnapshot(): Promise<AnalyticsSnapshot> {
  return analyticsProvider.getSnapshot();
}
