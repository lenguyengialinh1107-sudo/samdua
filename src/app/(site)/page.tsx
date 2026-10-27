import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, PackageCheck, ShieldCheck, Truck } from "lucide-react";

import { ProductCard } from "@/components/product/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { demoImage } from "@/lib/images";
import { formatNumber } from "@/lib/format";
import { site } from "@/lib/site";
import { getHomeSections } from "@/server/services/catalog.service";

/** Ảnh minh hoạ cho từng danh mục trên trang chủ (demo). */
const categoryArtwork: Record<string, string> = {
  "may-film":
    "vintage 35mm film SLR camera collection arranged on a warm cream linen surface, soft editorial daylight",
  "digital-compact":
    "modern compact digital camera and mirrorless body on cream paper background, minimal editorial product photography",
  lens: "several prime camera lenses standing on a cream studio surface, soft warm light, editorial catalog style",
  "phu-kien":
    "camera accessories flat lay with leather strap, film rolls and filter on a cream textured background",
};

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Máy đã kiểm tra",
    description: "Từng máy được vệ sinh, cân chỉnh và chụp thử trước khi bán.",
  },
  {
    icon: BadgeCheck,
    title: "Mô tả trung thực",
    description: "Ghi rõ ngoại hình và tình trạng hoạt động, ảnh thật từng máy.",
  },
  {
    icon: Truck,
    title: "Giao hàng toàn quốc",
    description: "Đóng gói kỹ, bảo hiểm kiện hàng, miễn phí ship cho đơn lớn.",
  },
  {
    icon: PackageCheck,
    title: "Bảo hành rõ ràng",
    description: "Bảo hành 3 tháng cho máy cũ, 12 tháng cho máy mới nguyên hộp.",
  },
];

export default async function HomePage() {
  const { featured, newArrivals, categories } = await getHomeSections();

  return (
    <>
      {/* Hero */}
      <section className="ah-paper border-b border-border">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24 lg:px-8">
          <div className="space-y-6">
            <p className="ah-label">{site.tagline}</p>
            <h1 className="font-serif text-4xl leading-[1.1] text-foreground sm:text-5xl lg:text-6xl">
              Máy ảnh cũ,
              <br />
              cảm hứng mới.
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-muted">
              {site.description}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="accent" size="lg" asChild>
                <Link href="/products">
                  Xem tất cả sản phẩm <ArrowRight />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/about">Quy trình kiểm tra máy</Link>
              </Button>
            </div>
            <dl className="flex flex-wrap gap-x-10 gap-y-4 pt-4">
              <div>
                <dt className="ah-label">Sản phẩm đang bán</dt>
                <dd className="font-serif text-2xl">{formatNumber(newArrivals.length + featured.length)}+</dd>
              </div>
              <div>
                <dt className="ah-label">Danh mục</dt>
                <dd className="font-serif text-2xl">{formatNumber(categories.length)}</dd>
              </div>
              <div>
                <dt className="ah-label">Hỗ trợ</dt>
                <dd className="font-serif text-2xl">{site.hotline}</dd>
              </div>
            </dl>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden border border-border bg-surface-muted">
            <Image
              src={demoImage(
                "editorial still life of a vintage film camera with printed photographs, film rolls and a notebook on a warm cream wooden desk, soft natural window light, analog photography aesthetic",
                "landscape_4_3",
              )}
              alt="Máy ảnh film và ảnh in trên bàn gỗ"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Danh mục */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="ah-label">Danh mục</p>
            <h2 className="mt-2 font-serif text-3xl">Bạn đang tìm gì?</h2>
          </div>
          <Link href="/products" className="text-sm text-accent hover:underline">
            Xem toàn bộ kho hàng
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden border border-border"
            >
              <Image
                src={demoImage(
                  categoryArtwork[category.slug] ??
                    `editorial photo representing ${category.name} camera equipment on a cream background`,
                )}
                alt={category.name}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-charcoal/45 transition-colors group-hover:bg-charcoal/35" />
              <span className="relative space-y-1 p-5 text-accent-foreground">
                <span className="block font-serif text-xl">{category.name}</span>
                <span className="block text-xs uppercase tracking-widest opacity-80">
                  {formatNumber(category._count.products)} sản phẩm
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Sản phẩm nổi bật */}
      {featured.length > 0 ? (
        <section className="border-y border-border bg-surface">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="ah-label">Tuyển chọn</p>
                <h2 className="mt-2 font-serif text-3xl">Sản phẩm nổi bật</h2>
              </div>
              <Link href="/products?sort=newest" className="text-sm text-accent hover:underline">
                Xem thêm
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Hàng mới về */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="ah-label">Vừa lên kệ</p>
            <h2 className="mt-2 font-serif text-3xl">Hàng mới về</h2>
          </div>
          <Link href="/products" className="text-sm text-accent hover:underline">
            Xem tất cả
          </Link>
        </div>

        {newArrivals.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="mt-8 border border-dashed border-border-strong bg-surface/60 px-6 py-12 text-center text-sm text-muted">
            Chưa có sản phẩm nào được đăng bán. Hãy chạy <code>npm run db:seed</code> để tạo
            dữ liệu demo.
          </p>
        )}
      </section>

      {/* Cam kết */}
      <section className="border-t border-border bg-charcoal text-accent-foreground">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {trustItems.map((item) => (
            <div key={item.title} className="space-y-3">
              <item.icon className="size-6 text-accent-soft" aria-hidden />
              <p className="font-serif text-lg">{item.title}</p>
              <p className="text-sm leading-relaxed text-accent-foreground/75">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="ah-paper">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="space-y-3">
            <Badge variant="accent">Cần tư vấn chọn máy?</Badge>
            <h2 className="font-serif text-3xl">Gọi {site.hotline} hoặc ghé cửa hàng</h2>
            <p className="max-w-xl text-sm text-muted">
              {site.address} — {site.workingHours}
            </p>
          </div>
          <Button variant="default" size="lg" asChild>
            <Link href="/contact">
              Liên hệ với chúng tôi <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
