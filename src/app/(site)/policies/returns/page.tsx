import type { Metadata } from "next";
import Link from "next/link";

import { StaticPage, StaticSection } from "@/components/layout/static-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Chính sách đổi trả",
  description:
    "Điều kiện đổi trả, thời hạn và quy trình xử lý khi sản phẩm không đúng mô tả tại Second Shot.",
  alternates: { canonical: "/policies/returns" },
};

export default function ReturnsPolicyPage() {
  return (
    <StaticPage
      eyebrow="Chính sách"
      title="Đổi trả & hoàn tiền"
      description="Mỗi sản phẩm đều được mô tả kỹ trước khi bán. Nếu máy không đúng như mô tả, chúng tôi chịu trách nhiệm đổi hoặc hoàn tiền."
    >
      <StaticSection title="Thời hạn đổi trả">
        <ul className="space-y-2">
          <li>
            Áp dụng trong vòng <strong>7 ngày</strong> kể từ ngày bạn nhận hàng.
          </li>
          <li>Sản phẩm phải còn nguyên trạng, không thay đổi linh kiện so với lúc giao.</li>
          <li>Kèm theo hoá đơn hoặc mã đơn hàng để đối chiếu.</li>
        </ul>
      </StaticSection>

      <StaticSection title="Các trường hợp được đổi trả">
        <ul className="space-y-2">
          <li>Sản phẩm không đúng chủng loại, số lượng hoặc mã sản phẩm đã đặt.</li>
          <li>Máy hoạt động không đúng như phần mô tả tình trạng trên trang sản phẩm.</li>
          <li>
            Phát sinh lỗi kỹ thuật không được nêu trong mục &ldquo;Tình trạng máy&rdquo; tại thời
            điểm bán.
          </li>
          <li>Sản phẩm bị hư hỏng trong quá trình vận chuyển (có bằng chứng hình ảnh/video).</li>
        </ul>
      </StaticSection>

      <StaticSection title="Trường hợp không áp dụng đổi trả">
        <ul className="space-y-2">
          <li>Sản phẩm đã bị tháo mở, sửa chữa hoặc thay đổi linh kiện bởi bên thứ ba.</li>
          <li>Hư hỏng do rơi vỡ, ngấm nước hoặc sử dụng sai cách sau khi nhận hàng.</li>
          <li>
            Các hao mòn tự nhiên đã được mô tả rõ trước khi mua (vết xước thân máy, mờ lớp sơn…).
          </li>
          <li>Phim đã bóc seal, hoá chất đã mở nắp hoặc phụ kiện tiêu hao đã qua sử dụng.</li>
        </ul>
      </StaticSection>

      <StaticSection title="Quy trình xử lý">
        <ol className="space-y-3">
          <li>
            <strong>Bước 1 — Liên hệ:</strong> Gọi hotline {site.hotline} hoặc email {site.email},
            cung cấp mã đơn hàng và mô tả vấn đề kèm ảnh/video.
          </li>
          <li>
            <strong>Bước 2 — Xác nhận:</strong> Trong vòng 1 ngày làm việc, cửa hàng phản hồi
            phương án xử lý cụ thể.
          </li>
          <li>
            <strong>Bước 3 — Gửi trả:</strong> Bạn gửi sản phẩm về cửa hàng theo hướng dẫn đóng
            gói. Với lỗi từ phía cửa hàng, chúng tôi chịu phí vận chuyển hai chiều.
          </li>
          <li>
            <strong>Bước 4 — Hoàn tất:</strong> Cửa hàng kiểm tra, sau đó đổi sản phẩm tương đương
            hoặc hoàn tiền trong 3–5 ngày làm việc.
          </li>
        </ol>
      </StaticSection>

      <StaticSection title="Hoàn tiền">
        <p>
          Tiền hoàn được chuyển khoản về tài khoản bạn cung cấp, hoặc hoàn tiền mặt tại cửa hàng.
          Thời gian nhận tiền tuỳ ngân hàng, thường từ 1–3 ngày làm việc sau khi cửa hàng xác nhận.
        </p>
        <p className="text-xs">
          Xem thêm{" "}
          <Link href="/policies/warranty" className="text-accent underline underline-offset-4">
            chính sách bảo hành
          </Link>{" "}
          và{" "}
          <Link href="/policies/shipping" className="text-accent underline underline-offset-4">
            chính sách vận chuyển
          </Link>
          .
        </p>
      </StaticSection>
    </StaticPage>
  );
}
