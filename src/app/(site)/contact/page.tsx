import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { StaticPage, StaticSection } from "@/components/layout/static-page";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Liên hệ",
  description:
    "Địa chỉ, hotline, email và giờ làm việc của cửa hàng Second Shot tại Hà Nội.",
  alternates: { canonical: "/contact" },
};

const channels = [
  { icon: Phone, label: "Hotline", value: site.hotline, href: `tel:${site.hotline.replace(/\s/g, "")}` },
  { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
  { icon: MapPin, label: "Địa chỉ", value: site.address },
  { icon: Clock, label: "Giờ làm việc", value: site.workingHours },
];

export default function ContactPage() {
  return (
    <StaticPage
      eyebrow="Liên hệ"
      title="Ghé cửa hàng hoặc gọi cho chúng tôi"
      description="Chúng tôi sẵn sàng tư vấn chọn máy, kiểm tra máy cũ và hỗ trợ xử lý đơn hàng."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {channels.map((channel) => (
          <div key={channel.label} className="border border-border bg-surface p-4">
            <div className="flex items-center gap-2">
              <channel.icon className="size-4 text-accent" aria-hidden />
              <p className="ah-label">{channel.label}</p>
            </div>
            {channel.href ? (
              <a
                href={channel.href}
                className="mt-2 block text-sm text-foreground hover:text-accent"
              >
                {channel.value}
              </a>
            ) : (
              <p className="mt-2 text-sm">{channel.value}</p>
            )}
          </div>
        ))}
      </div>

      <StaticSection title="Trước khi đến cửa hàng">
        <p>
          Bạn nên gọi trước để cửa hàng chuẩn bị máy bạn muốn xem, đặc biệt với các dòng máy film
          hoặc lens ít có sẵn. Chúng tôi có thể giữ máy trong vòng 24 giờ theo yêu cầu.
        </p>
      </StaticSection>

      <StaticSection title="Tra cứu đơn hàng">
        <p>
          Nếu bạn đã đặt hàng và muốn kiểm tra tình trạng đơn, hãy vào mục{" "}
          <Link href="/account/orders" className="text-accent underline underline-offset-4">
            tra cứu đơn hàng
          </Link>{" "}
          bằng mã đơn và số điện thoại đã dùng khi đặt.
        </p>
      </StaticSection>

      <StaticSection title="Hợp tác & ký gửi">
        <p>
          Second Shot nhận ký gửi và thu mua máy ảnh, lens cũ. Vui lòng gửi ảnh chụp sản phẩm kèm
          mô tả tình trạng qua email {site.email} để được báo giá sơ bộ.
        </p>
      </StaticSection>

      <div className="flex flex-wrap gap-3 border-t border-border pt-6">
        <Button variant="accent" asChild>
          <a href={`tel:${site.hotline.replace(/\s/g, "")}`}>Gọi {site.hotline}</a>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/products">Xem sản phẩm đang bán</Link>
        </Button>
      </div>
    </StaticPage>
  );
}
