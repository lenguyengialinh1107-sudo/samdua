"use client";

import * as React from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { useCart, type CartLine } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { clampQuantity } from "@/lib/cart";

export function AddToCart({ product }: { product: Omit<CartLine, "quantity"> }) {
  const { addLine } = useCart();
  const inStock = product.stockQuantity > 0;
  const [quantity, setQuantity] = React.useState(1);

  const update = (next: number) => setQuantity(clampQuantity(next, product.stockQuantity));

  function handleAdd() {
    addLine(product, quantity);
    toast.success("Đã thêm vào giỏ hàng", { description: product.name });
  }

  if (!inStock) {
    return (
      <div className="space-y-3">
        <Button variant="outline" size="lg" disabled className="w-full">
          Tạm hết hàng
        </Button>
        <p className="text-xs text-muted">
          Sản phẩm này đã bán. Liên hệ hotline để được thông báo khi có máy tương tự.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-stretch gap-3">
        <div className="flex items-center border border-border-strong bg-surface">
          <button
            type="button"
            onClick={() => update(quantity - 1)}
            disabled={quantity <= 1}
            aria-label="Giảm số lượng"
            className="flex size-11 items-center justify-center text-muted hover:text-foreground disabled:opacity-40"
          >
            <Minus className="size-4" />
          </button>
          <span aria-live="polite" className="w-10 text-center text-sm tabular-nums">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => update(quantity + 1)}
            disabled={quantity >= product.stockQuantity}
            aria-label="Tăng số lượng"
            className="flex size-11 items-center justify-center text-muted hover:text-foreground disabled:opacity-40"
          >
            <Plus className="size-4" />
          </button>
        </div>

        <Button variant="accent" size="lg" className="flex-1" onClick={handleAdd}>
          <ShoppingBag /> Thêm vào giỏ
        </Button>
      </div>
      <p className="text-xs text-muted">
        Còn {product.stockQuantity} sản phẩm · Mỗi sản phẩm cũ chỉ có duy nhất một chiếc.
      </p>
    </div>
  );
}
