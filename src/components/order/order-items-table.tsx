import { formatVnd } from "@/lib/format";
import { paymentMethodLabels } from "@/lib/site";
import type { Prisma } from "@prisma/client";

type OrderWithItems = Prisma.OrderGetPayload<{
  include: { items: true };
}>;

/** Bảng sản phẩm + tổng tiền của một đơn hàng. Dùng chung cho khách và admin. */
export function OrderItemsTable({ order }: { order: OrderWithItems }) {
  return (
    <div className="space-y-4">
      <ul className="divide-y divide-border border border-border">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-center gap-4 p-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-foreground">{item.productName}</p>
              <p className="font-mono text-xs text-muted">{item.productSku}</p>
              <p className="text-xs text-muted">
                {formatVnd(item.unitPrice)} × {item.quantity}
              </p>
            </div>
            <p className="text-sm font-medium">{formatVnd(item.lineTotal)}</p>
          </li>
        ))}
      </ul>

      <dl className="ml-auto w-full max-w-sm space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Tạm tính</dt>
          <dd>{formatVnd(order.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Phí vận chuyển</dt>
          <dd>{order.shippingFee === 0 ? "Miễn phí" : formatVnd(order.shippingFee)}</dd>
        </div>
        {order.discountTotal > 0 ? (
          <div className="flex justify-between">
            <dt className="text-muted">Giảm giá</dt>
            <dd>-{formatVnd(order.discountTotal)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between border-t border-border pt-2 text-base">
          <dt className="font-medium">Tổng cộng</dt>
          <dd className="font-serif text-lg">{formatVnd(order.grandTotal)}</dd>
        </div>
        <div className="flex justify-between pt-1 text-xs">
          <dt className="text-muted">Phương thức</dt>
          <dd>{paymentMethodLabels[order.paymentMethod]}</dd>
        </div>
      </dl>
    </div>
  );
}
