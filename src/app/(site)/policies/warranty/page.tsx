import type { Metadata } from "next";
import Link from "next/link";

import { StaticPage, StaticSection } from "@/components/layout/static-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Chính sách bảo hành",
  description:
    "Thời hạn bảo hành, phạm vi bảo hành và quy trình tiếp nhận bảo hành máy ảnh tại Second Shot.",
  alternates: { canonical: "/policies/warranty" },
};

export default function WarrantyPolicyPage() {
  return (
    <StaticPage
      eyebrow="Chính sách"
      title="Bảo hành"
      description="Thời hạn và phạm vi bảo hành được ghi rõ trong mục “Bảo hành” trên từng trang sản phẩm."
    >
      <StaticSection title="Thời hạn bảo hành">
        <ul className="space-y-2">
          <li>
            Máy ảnh film và máy ảnh digital đã qua sử dụng: <strong>30 ngày</strong> kể từ ngày
            nhận hàng.
          </li>
          <li>
            Sản phẩm mới nguyên hộp: bảo hành theo tiêu chuẩn của nhà sản xuất hoặc{" "}
            <strong>12 tháng</strong>, tuỳ sản phẩm.
          </li>
          <li>Lens và phụ kiện: <strong>30 ngày</strong> cho các lỗi kỹ thuật.</li>
          <li>
            Thời hạn cụ thể của từng sản phẩm được ghi tại mục &ldquo;Bảo hành&rdquo; trên trang
            chi tiết sản phẩm.
          </li>
        </ul>
      </StaticSection>

      <StaticSection title="Phạm vi bảo hành">
        <ul className="space-y-2">
          <li>Lỗi phát sinh từ hoạt động của máy: màn trập, đo sáng, lấy nét, mạch điều khiển.</li>
          <li>Lỗi quang học của lens: kẹt khẩu, kẹt lấy nét, hư motor lấy nét.</li>
          <li>Các lỗi kỹ thuật không được nêu trong phần mô tả tình trạng khi bán.</li>
        </ul>
      </StaticSection>

      <StaticSection title="Không thuộc phạm vi bảo hành">
        <ul className="space-y-2">
          <li>Hư hỏng do rơi vỡ, va đập, ngấm nước hoặc cháy nổ.</li>
          <li>Sản phẩm đã bị tháo mở hoặc sửa chữa bên ngoài cửa hàng.</li>
          <li>Hao mòn tự nhiên: vết xước thân máy, mờ cao su, hao mòn lớp da bọc.</li>
          <li>Pin và các vật tư tiêu hao (gioăng sáng, nắp lens, film, hoá chất).</li>
        </ul>
      </StaticSection>

      <StaticSection title="Quy trình bảo hành">
        <ol className="space-y-3">
          <li>
            <strong>Tiếp nhận:</strong> Liên hệ hotline {site.hotline} hoặc email {site.email} kèm
            mã đơn hàng và mô tả lỗi.
          </li>
          <li>
            <strong>Kiểm tra:</strong> Cửa hàng kiểm tra trong 1–3 ngày làm việc để xác định
            nguyên nhân và phạm vi xử lý.
          </li>
          <li>
            <strong>Xử lý:</strong> Sửa chữa và vệ sinh miễn phí nếu thuộc phạm vi bảo hành. Nếu
            không sửa được, cửa hàng đổi sản phẩm tương đương hoặc hoàn tiền theo{" "}
            <Link href="/policies/returns" className="text-accent underline underline-offset-4">
              chính sách đổi trả
            </Link>
            .
          </li>
          <li>
            <strong>Hoàn tất:</strong> Bàn giao lại máy kèm phiếu ghi nhận nội dung đã xử lý.
          </li>
        </ol>
        <p className="text-xs">
          Chi phí vận chuyển bảo hành: cửa hàng chịu phí nếu lỗi thuộc phạm vi bảo hành; bạn chịu
          phí nếu lỗi nằm ngoài phạm vi.
        </p>
      </StaticSection>

      <StaticSection title="Lưu ý khi gửi bảo hành">
        <p>
          Vui lòng tháo pin, thẻ nhớ và các phụ kiện cá nhân trước khi gửi máy. Đóng gói cẩn thận
          như khi nhận hàng và ghi rõ mã đơn hàng bên trong kiện.
        </p>
      </StaticSection>
    </StaticPage>
  );
}
