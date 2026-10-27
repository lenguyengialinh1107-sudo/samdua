import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Ảnh sản phẩm cần độ nét cao nên mở thêm mức chất lượng 90.
    qualities: [75, 90],
    remotePatterns: [
      // Ảnh placeholder cho dữ liệu demo
      { protocol: "https", hostname: "coresg-normal.trae.ai" },
      // Ảnh sản phẩm thật khi đã cấu hình Cloudinary
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
