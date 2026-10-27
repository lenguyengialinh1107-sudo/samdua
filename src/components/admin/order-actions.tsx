"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { isOrderLocked, nextOrderStatuses, type OrderStatusValue } from "@/lib/order-status";
import { orderStatusLabels, paymentStatusLabels } from "@/lib/site";
import { changeOrderStatusAction, setPaymentStatusAction } from "@/server/actions/admin-order.actions";

const PAYMENT_STATUSES = ["UNPAID", "PAID", "REFUNDED", "FAILED"] as const;

export function OrderStatusActions({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatusValue;
}) {
  const router = useRouter();
  const [pending, setPending] = React.useState<string | null>(null);
  const nextStatuses = nextOrderStatuses(status);

  async function handleChange(next: OrderStatusValue) {
    if (next === "CANCELLED") {
      const confirmed = window.confirm(
        "Huỷ đơn hàng này? Tồn kho của các sản phẩm trong đơn sẽ được hoàn lại.",
      );
      if (!confirmed) return;
    }

    setPending(next);
    const result = await changeOrderStatusAction({ orderId, status: next });
    setPending(null);

    if (!result.ok) {
      toast.error("Không thể cập nhật trạng thái", { description: result.message });
      return;
    }
    toast.success("Đã cập nhật trạng thái đơn hàng");
    router.refresh();
  }

  if (isOrderLocked(status)) {
    return (
      <p className="text-sm text-muted">
        Đơn hàng ở trạng thái “{orderStatusLabels[status]}” nên không thể thay đổi nữa.
      </p>
    );
  }

  if (nextStatuses.length === 0) {
    return <p className="text-sm text-muted">Không có trạng thái tiếp theo.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {nextStatuses.map((next) => (
        <Button
          key={next}
          variant={next === "CANCELLED" ? "danger" : "accent"}
          size="sm"
          onClick={() => handleChange(next)}
          disabled={pending !== null}
        >
          {pending === next ? "Đang xử lý…" : `Chuyển sang: ${orderStatusLabels[next]}`}
        </Button>
      ))}
    </div>
  );
}

export function PaymentStatusControl({
  orderId,
  paymentStatus,
}: {
  orderId: string;
  paymentStatus: string;
}) {
  const router = useRouter();
  const [value, setValue] = React.useState(paymentStatus);
  const [pending, setPending] = React.useState(false);

  async function handleSave() {
    if (value === paymentStatus) return;

    setPending(true);
    const result = await setPaymentStatusAction({
      orderId,
      paymentStatus: value as (typeof PAYMENT_STATUSES)[number],
    });
    setPending(false);

    if (!result.ok) {
      toast.error("Không thể cập nhật thanh toán", { description: result.message });
      return;
    }
    toast.success("Đã cập nhật trạng thái thanh toán");
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={value}
        onChange={(event) => setValue(event.target.value)}
        aria-label="Trạng thái thanh toán"
        className="max-w-[200px]"
      >
        {PAYMENT_STATUSES.map((status) => (
          <option key={status} value={status}>
            {paymentStatusLabels[status] ?? status}
          </option>
        ))}
      </Select>
      <Button variant="outline" size="sm" onClick={handleSave} disabled={pending}>
        {pending ? "Đang lưu…" : "Lưu"}
      </Button>
    </div>
  );
}
