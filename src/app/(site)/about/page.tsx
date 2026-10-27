import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { StaticPage, StaticSection } from "@/components/layout/static-page";
import { Button } from "@/components/ui/button";
import { demoImage } from "@/lib/images";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description:
    "Second Shot là cửa hàng mua bán máy ảnh film, digital, compact, lens và phụ kiện nhiếp ảnh tại Hà Nội. Máy đã kiểm tra, bảo hành rõ ràng, giá minh bạch.",
  alternates: { canonical: "/about" },
};

const commitments = [
  "Máy được vệ sinh, kiểm tra và chụp thử trước khi bán.",
  "Mô tả tình trạng trung thực, có ảnh thật của từng máy.",
  "Giá niêm yết minh bạch, không phụ phí ẩn.",
  "Bảo hành theo từng sản phẩm, ghi rõ trên trang chi tiết.",
];

const inspectionSteps = [
  {
    title: "Kiểm tra ngoại hình",
    detail: "Ghi nhận vết xước, móp, mất lớp sơn và chụp ảnh cận cảnh từng góc.",
  },
  {
    title: "Kiểm tra hoạt động",
    detail: "Đo sáng, tốc độ màn trập, lấy nét, đồng hồ đo sáng và các chế độ chụp.",
  },
  {
    title: "Kiểm tra quang học",
    detail: "Soi lens tìm mốc, rễ tre, xước và kiểm tra khả năng lấy nét ở mọi tiêu cự.",
  },
  {
    title: "Vệ sinh & hoàn thiện",
    detail: "Vệ sinh thân máy, lens, buồng phim và thay gioăng sáng nếu cần.",
  },
];

export default function AboutPage() {
  return (
    <StaticPage
      eyebrow="Về chúng tôi"
      title="Chúng tôi trao lại đời sống thứ hai cho những chiếc máy ảnh"
      description={site.description}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden border border-border">
        <Image
          src={demoImage(
            "editorial flat lay of vintage film cameras, a 35mm SLR, scattered film rolls and a notebook on a warm cream paper background, soft window light, muted terracotta and brown palette, top-down photography",
            "landscape_16_9",
          )}
          alt="Máy ảnh film và cuộn phim được sắp đặt trên nền giấy kem"
          fill
          unoptimized
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
          priority
        />
      </div>

      <StaticSection title="Chúng tôi làm gì">
        <p>
          Second Shot là cửa hàng nhỏ chuyên mua bán máy ảnh film, máy ảnh digital, máy compact,
          lens và phụ kiện nhiếp ảnh. Mỗi chiếc máy đi qua cửa hàng đều được kiểm tra, vệ sinh và
          mô tả đúng tình trạng thực tế trước khi đến tay người dùng.
        </p>
        <p>
          Chúng tôi tin rằng một chiếc máy ảnh cũ vẫn xứng đáng được sử dụng nghiêm túc. Vì vậy
          thay vì bán &ldquo;cho xong&rdquo;, chúng tôi dành thời gian để hiểu rõ từng máy và tư vấn
          đúng nhu cầu của bạn.
        </p>
      </StaticSection>

      <StaticSection title="Cam kết của chúng tôi">
        <ul className="space-y-2">
          {commitments.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </StaticSection>

      <StaticSection id="kiem-tra-may" title="Quy trình kiểm tra máy">
        <ol className="space-y-4">
          {inspectionSteps.map((step, index) => (
            <li key={step.title} className="flex gap-3">
              <span className="mt-0.5 font-mono text-xs text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>
                <strong className="block">{step.title}</strong>
                <span>{step.detail}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="text-xs">
          Kết quả kiểm tra được tóm tắt trong mục &ldquo;Tình trạng máy&rdquo; trên từng trang sản
          phẩm, gồm ngoại hình, hoạt động và phụ kiện đi kèm.
        </p>
      </StaticSection>

      <StaticSection title="Ghé thăm cửa hàng">
        <p>
          Bạn có thể xem máy trực tiếp tại {site.address}. Giờ mở cửa: {site.workingHours}.
        </p>
        <p>
          Cần tư vấn trước khi đến? Gọi hotline {site.hotline} hoặc gửi email tới {site.email}.
        </p>
      </StaticSection>

      <div className="flex flex-wrap gap-3 border-t border-border pt-6">
        <Button variant="accent" asChild>
          <Link href="/products">Xem sản phẩm</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/contact">Liên hệ cửa hàng</Link>
        </Button>
      </div>
    </StaticPage>
  );
}
