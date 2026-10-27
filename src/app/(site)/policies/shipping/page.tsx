import type { Metadata } from "next";
import Link from "next/link";

import { StaticPage, StaticSection } from "@/components/layout/static-page";
import { formatVnd } from "@/lib/format";
import { site } from "@/lib/site";
import { getShippingConfig } from "@/server/services/settings.service";

export const metadata: Metadata = {
  title: "Chính sách vận chuyển",
  description:
    "Phí vận chuyển, thời gian giao hàng và quy trình đóng gói máy ảnh tại Second Shot.",
  alternates: { canonical: "/policies/shipping" },
};

export default async function ShippingPolicyPage() {
  const config = await getShippingConfig();

  return (
    <StaticPage
      eyebrow="Chính sách"
      title="Vận chuyển & giao nhận"
      description="Chúng tôi đóng gói kỹ từng thiết bị trước khi gửi đi và thông báo mã vận đơn ngay khi đơn rời cửa hàng."
    >
      <StaticSection title="Phí vận chuyển">
        <ul className="space-y-2">
          <li>
            Phí vận chuyển tiêu chuẩn: <strong>{formatVnd(config.flatFee)}</strong> cho mỗi đơn
            hàng.
          </li>
          <li>
            Miễn phí vận chuyển cho đơn từ{" "}
            <strong>{formatVnd(config.freeThreshold)}</strong> trở lên.
          </li>
          <li>
            Phí vận chuyển được tính tự động ở bước thanh toán và hiển thị rõ trước khi bạn xác
            nhận đơn.
          </li>
        </ul>
      </StaticSection>

      <StaticSection title="Thời gian giao hàng">
        <ul className="space-y-2">
          <li>Nội thành Hà Nội: trong vòng 1–2 ngày làm việc.</li>
          <li>Các tỉnh thành khác: 2–5 ngày làm việc tuỳ đơn vị vận chuyển.</li>
          <li>
            Đơn đặt sau 17:00 hoặc vào ngày nghỉ sẽ được xử lý vào ngày làm việc kế tiếp.
          </li>
        </ul>
      </StaticSection>

      <StaticSection title="Đóng gói & bảo đảm">
        <ul className="space-y-2">
          <li>Máy ảnh được bọc chống sốc nhiều lớp, chèn kín hộp để tránh va đập.</li>
          <li>Lens được cố định riêng và đậy cả hai nắp trước/sau.</li>
          <li>Đơn hàng được ghi nhận giá trị để hỗ trợ xử lý khi có sự cố phát sinh.</li>
        </ul>
      </StaticSection>

      <StaticSection title="Kiểm tra hàng khi nhận">
        <p>
          Bạn được quyền mở kiểm tra ngoại hình và số lượng sản phẩm ngay khi nhận hàng (đối với
          đơn thanh toán COD). Nếu kiện hàng có dấu hiệu móp, rách hoặc thiếu sản phẩm, vui lòng
          quay video/chụp ảnh và liên hệ ngay hotline {site.hotline} để được hỗ trợ.
        </p>
      </StaticSection>

      <StaticSection title="Trường hợp giao hàng không thành công">
        <p>
          Nếu không liên hệ được người nhận sau 3 lần giao, đơn hàng sẽ được hoàn về cửa hàng.
          Chúng tôi sẽ chủ động liên hệ để sắp xếp giao lại hoặc xử lý theo{" "}
          <Link href="/policies/returns" className="text-accent underline underline-offset-4">
            chính sách đổi trả
          </Link>
          .
        </p>
      </StaticSection>
    </StaticPage>
  );
}
