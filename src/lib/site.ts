/**
 * Cấu hình thương hiệu + nội dung tĩnh.
 * Đổi tên thương hiệu, hotline, địa chỉ... chỉ cần sửa ở đây.
 */

export const site = {
  name: "Second Shot",
  shortName: "SS",
  tagline: "Cửa hàng máy ảnh film & digital tuyển chọn",
  description:
    "Second Shot mua bán máy ảnh film, máy ảnh digital, compact, lens và phụ kiện nhiếp ảnh. Máy đã kiểm tra, bảo hành rõ ràng, giá minh bạch.",
  locale: "vi_VN",
  currency: "VND",
  /** Dùng cho metadataBase, sitemap, canonical. Đổi khi deploy. */
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000",
  hotline: "0375165319",
  email: "hello@secondshot.vn",
  address: "Vạn Phúc Building, Đường Tố Hữu, Hà Đông, HN",
  workingHours: "09:00 – 19:00 (Thứ 2 – Thứ 7)",
  social: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
  },
  /** Thông tin chuyển khoản thủ công — dữ liệu demo, sửa lại trước khi dùng thật. */
  bank: {
    bankName: "Vietcombank — CN Hà Nội",
    accountNumber: "0123 456 789 0123",
    accountHolder: "CONG TY TNHH SECOND SHOT",
    note: "Ghi rõ mã đơn hàng trong nội dung chuyển khoản.",
  },
} as const;

export const mainNav = [
  { label: "Máy film", href: "/products?category=may-film" },
  { label: "Digital & Compact", href: "/products?category=digital-compact" },
  { label: "Lens", href: "/products?category=lens" },
  { label: "Phụ kiện", href: "/products?category=phu-kien" },
  { label: "Giới thiệu", href: "/about" },
] as const;

export const footerNav = [
  {
    title: "Mua sắm",
    links: [
      { label: "Tất cả sản phẩm", href: "/products" },
      { label: "Hàng mới về", href: "/products?sort=newest" },
      { label: "Giỏ hàng", href: "/cart" },
      { label: "Tra cứu đơn hàng", href: "/account/orders" },
    ],
  },
  {
    title: "Chính sách",
    links: [
      { label: "Vận chuyển", href: "/policies/shipping" },
      { label: "Đổi trả", href: "/policies/returns" },
      { label: "Bảo hành", href: "/policies/warranty" },
      { label: "Liên hệ", href: "/contact" },
    ],
  },
  {
    title: "Về chúng tôi",
    links: [
      { label: "Giới thiệu", href: "/about" },
      { label: "Quy trình kiểm tra máy", href: "/about#kiem-tra-may" },
      { label: "Tài khoản", href: "/account" },
    ],
  },
] as const;

/** Nhãn hiển thị cho các enum trong database. */
export const productConditionLabels: Record<string, string> = {
  NEW: "Mới nguyên hộp",
  LIKE_NEW: "Như mới (99%)",
  EXCELLENT: "Đẹp (95–98%)",
  GOOD: "Tốt (90–94%)",
  FAIR: "Đã qua sử dụng",
};

export const productTypeLabels: Record<string, string> = {
  FILM_CAMERA: "Máy ảnh film",
  DIGITAL_CAMERA: "Máy ảnh digital",
  COMPACT_CAMERA: "Máy compact",
  LENS: "Lens",
  ACCESSORY: "Phụ kiện",
  FILM_ROLL: "Film",
};

export const orderStatusLabels: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Đã huỷ",
};

export const paymentMethodLabels: Record<string, string> = {
  COD: "Thanh toán khi nhận hàng (COD)",
  BANK_TRANSFER: "Chuyển khoản / thanh toán thủ công",
};

export const paymentStatusLabels: Record<string, string> = {
  UNPAID: "Chưa thanh toán",
  PAID: "Đã thanh toán",
  REFUNDED: "Đã hoàn tiền",
  FAILED: "Thanh toán lỗi",
};
