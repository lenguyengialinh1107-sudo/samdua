import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { formatVnd } from "@/lib/format";
import { primaryImageUrl } from "@/lib/images";
import { productConditionLabels, productTypeLabels } from "@/lib/site";
import type { ProductListItem } from "@/server/repositories/product.repository";

export function ProductCard({ product }: { product: ProductListItem }) {
  const inStock = product.stockQuantity > 0;
  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : null;

  return (
    <article className="group flex flex-col border border-border bg-surface transition-colors hover:border-border-strong">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-surface-muted"
      >
        <Image
          src={primaryImageUrl(product.images)}
          alt={product.images[0]?.alt ?? product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
          className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3 flex flex-col items-start gap-1">
          {discountPercent ? <Badge variant="accent">-{discountPercent}%</Badge> : null}
          {product.condition === "NEW" ? <Badge variant="film">Mới</Badge> : null}
        </span>
        {!inStock ? (
          <span className="absolute right-3 top-3">
            <Badge variant="solid">Hết hàng</Badge>
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-[11px] uppercase tracking-wider text-muted">
          {product.brand?.name ? `${product.brand.name} · ` : ""}
          {productConditionLabels[product.condition]}
        </p>
        <h3 className="font-serif text-base leading-snug">
          <Link href={`/products/${product.slug}`} className="hover:text-accent">
            {product.name}
          </Link>
        </h3>
        <p className="text-xs text-muted">{productTypeLabels[product.productType]}</p>
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="text-sm font-semibold text-foreground">{formatVnd(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price ? (
            <span className="text-xs text-muted line-through">
              {formatVnd(product.compareAtPrice)}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
