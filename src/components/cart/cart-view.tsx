"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { EmptyState, Skeleton } from "@/components/ui/empty-state";
import { summarizeCart, type ShippingConfig } from "@/lib/cart";
import { formatVnd } from "@/lib/format";
import { productImageUrl } from "@/lib/images";

export function CartView({ config }: { config: ShippingConfig }) {
  const { lines, isReady, setQuantity, removeLine, itemCount } = useCart();
  const summary = summarizeCart(lines, config);

  if (!isReady) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <EmptyState
        title="Giỏ hàng đang trống"
        description="Hãy chọn một chiếc máy ảnh bạn thích — mỗi máy cũ chỉ có một chiếc duy nhất."
        action={
          <Button variant="accent" asChild>
            <Link href="/products">
              Xem sản phẩm <ArrowRight />
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <ul className="divide-y divide-border border border-border bg-surface">
        {lines.map((line) => (
          <li key={line.productId} className="flex flex-wrap gap-4 p-4 sm:flex-nowrap">
            <Link
              href={`/products/${line.slug}`}
              className="relative size-24 shrink-0 overflow-hidden border border-border bg-surface-muted"
            >
              <Image
                src={productImageUrl(line.imageUrl)}
                alt={line.name}
                fill
                sizes="96px"
                className="object-contain"
              />
            </Link>

            <div className="min-w-0 flex-1 space-y-1">
              <Link
                href={`/products/${line.slug}`}
                className="block font-serif text-base hover:text-accent"
              >
                {line.name}
              </Link>
              <p className="font-mono text-xs text-muted">{line.sku}</p>
              <p className="text-sm">{formatVnd(line.unitPrice)}</p>
              {line.quantity > line.stockQuantity ? (
                <p className="text-xs text-danger">
                  Kho chỉ còn {line.stockQuantity} sản phẩm, vui lòng giảm số lượng.
                </p>
              ) : null}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-border-strong">
                <button
                  type="button"
                  onClick={() => setQuantity(line.productId, line.quantity - 1)}
                  aria-label={`Giảm số lượng ${line.name}`}
                  className="flex size-9 items-center justify-center text-muted hover:text-foreground"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="w-9 text-center text-sm tabular-nums">{line.quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(line.productId, line.quantity + 1)}
                  disabled={line.quantity >= line.stockQuantity}
                  aria-label={`Tăng số lượng ${line.name}`}
                  className="flex size-9 items-center justify-center text-muted hover:text-foreground disabled:opacity-40"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>

              <p className="w-28 text-right text-sm font-medium">
                {formatVnd(line.unitPrice * line.quantity)}
              </p>

              <button
                type="button"
                onClick={() => removeLine(line.productId)}
                aria-label={`Xoá ${line.name} khỏi giỏ`}
                className="text-muted hover:text-danger"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <aside className="h-fit space-y-4 border border-border bg-surface p-5 lg:sticky lg:top-24">
        <p className="ah-label">Tóm tắt đơn hàng</p>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Số sản phẩm</dt>
            <dd>{itemCount}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Tạm tính</dt>
            <dd>{formatVnd(summary.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Phí vận chuyển</dt>
            <dd>{summary.shippingFee === 0 ? "Miễn phí" : formatVnd(summary.shippingFee)}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-2 text-base">
            <dt className="font-medium">Tổng cộng</dt>
            <dd className="font-serif text-lg">{formatVnd(summary.grandTotal)}</dd>
          </div>
        </dl>

        {summary.freeShippingRemaining > 0 ? (
          <p className="border border-dashed border-accent/50 bg-accent-soft/50 p-3 text-xs text-foreground">
            Mua thêm {formatVnd(summary.freeShippingRemaining)} để được miễn phí vận chuyển.
          </p>
        ) : null}

        <Button variant="accent" size="lg" className="w-full" asChild>
          <Link href="/checkout">
            Tiến hành đặt hàng <ArrowRight />
          </Link>
        </Button>
        <Button variant="ghost" className="w-full" asChild>
          <Link href="/products">Tiếp tục chọn máy</Link>
        </Button>
        <p className="text-xs text-muted">
          Tổng tiền hiển thị chỉ mang tính tham khảo. Hệ thống sẽ tính lại khi bạn xác nhận
          đơn hàng.
        </p>
      </aside>
    </div>
  );
}
