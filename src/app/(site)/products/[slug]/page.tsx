import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AddToCart } from "@/components/product/add-to-cart";
import { ProductCard } from "@/components/product/product-card";
import { ProductGallery } from "@/components/product/product-gallery";
import { Badge } from "@/components/ui/badge";
import { formatVnd } from "@/lib/format";
import { primaryImageUrl } from "@/lib/images";
import {
  productConditionLabels,
  productTypeLabels,
  site,
} from "@/lib/site";
import { getProductDetail } from "@/server/services/catalog.service";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getProductDetail(slug);
  if (!detail) return { title: "Không tìm thấy sản phẩm" };

  const { product } = detail;
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: [{ url: primaryImageUrl(product.images) }],
    },
  };
}

function readSpecs(value: unknown): [string, string][] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  return Object.entries(value as Record<string, unknown>).map(([key, item]) => [
    key,
    item === null || item === undefined ? "" : String(item),
  ]);
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const detail = await getProductDetail(slug);
  if (!detail) notFound();

  const { product, related } = detail;
  const specs = readSpecs(product.cameraSpecs);
  const inStock = product.stockQuantity > 0;
  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    brand: product.brand ? { "@type": "Brand", name: product.brand.name } : undefined,
    image: product.images.map((image) => image.url),
    offers: {
      "@type": "Offer",
      priceCurrency: "VND",
      price: product.price,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${site.url}/products/${product.slug}`,
    },
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="text-xs text-muted">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/" className="hover:text-accent">
              Trang chủ
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href={`/products?category=${product.category.slug}`} className="hover:text-accent">
              {product.category.name}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-foreground">{product.name}</li>
        </ol>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default">{productTypeLabels[product.productType]}</Badge>
              <Badge variant="film">{productConditionLabels[product.condition]}</Badge>
              {inStock ? (
                <Badge variant="success">Còn hàng</Badge>
              ) : (
                <Badge variant="danger">Hết hàng</Badge>
              )}
            </div>
            <h1 className="font-serif text-3xl leading-tight sm:text-4xl">{product.name}</h1>
            {product.brand ? (
              <p className="text-sm text-muted">Thương hiệu {product.brand.name}</p>
            ) : null}
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-serif text-3xl text-foreground">{formatVnd(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price ? (
              <>
                <span className="text-sm text-muted line-through">
                  {formatVnd(product.compareAtPrice)}
                </span>
                <Badge variant="accent">-{discountPercent}%</Badge>
              </>
            ) : null}
          </div>

          <p className="text-sm leading-relaxed text-foreground/90">{product.description}</p>

          <AddToCart
            product={{
              productId: product.id,
              slug: product.slug,
              name: product.name,
              sku: product.sku,
              imageUrl: primaryImageUrl(product.images),
              unitPrice: product.price,
              stockQuantity: product.stockQuantity,
            }}
          />

          <dl className="divide-y divide-border border-y border-border text-sm">
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-muted">Mã sản phẩm</dt>
              <dd className="font-mono text-xs">{product.sku}</dd>
            </div>
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-muted">Bảo hành</dt>
              <dd className="max-w-[60%] text-right">
                {product.warrantyText ?? "Theo chính sách bảo hành của cửa hàng"}
              </dd>
            </div>
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-muted">Tình trạng kho</dt>
              <dd>{inStock ? `Còn ${product.stockQuantity} sản phẩm` : "Đã bán"}</dd>
            </div>
          </dl>

          <div className="border border-border bg-surface p-4 text-xs text-muted">
            <p className="text-foreground">
              Cần tư vấn thêm? Gọi <strong>{site.hotline}</strong> hoặc{" "}
              <Link href="/contact" className="text-accent underline underline-offset-4">
                gửi yêu cầu
              </Link>
              . Ảnh và thông số có thể là dữ liệu demo — vui lòng xác nhận trước khi mua.
            </p>
          </div>
        </div>
      </div>

      {/* Chi tiết */}
      <div className="mt-16 grid gap-10 lg:grid-cols-3">
        <section className="space-y-3 lg:col-span-1">
          <h2 className="font-serif text-xl">Tình trạng máy</h2>
          <dl className="space-y-3 text-sm">
            {product.cosmeticCondition ? (
              <div>
                <dt className="ah-label">Ngoại hình</dt>
                <dd className="mt-1 text-foreground/90">{product.cosmeticCondition}</dd>
              </div>
            ) : null}
            {product.functionalCondition ? (
              <div>
                <dt className="ah-label">Hoạt động</dt>
                <dd className="mt-1 text-foreground/90">{product.functionalCondition}</dd>
              </div>
            ) : null}
            {product.includedAccessories ? (
              <div>
                <dt className="ah-label">Phụ kiện đi kèm</dt>
                <dd className="mt-1 text-foreground/90">{product.includedAccessories}</dd>
              </div>
            ) : null}
          </dl>
        </section>

        <section className="space-y-3 lg:col-span-2">
          <h2 className="font-serif text-xl">Thông số kỹ thuật</h2>
          {specs.length > 0 ? (
            <table className="w-full border border-border text-sm">
              <tbody>
                {specs.map(([key, value]) => (
                  <tr key={key} className="border-b border-border last:border-b-0">
                    <th scope="row" className="w-1/3 bg-surface-muted/60 px-4 py-3 text-left font-medium text-muted">
                      {key}
                    </th>
                    <td className="px-4 py-3">{value || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-muted">Sản phẩm chưa có thông số chi tiết.</p>
          )}
        </section>
      </div>

      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="font-serif text-2xl">Sản phẩm tương tự</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
