"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { lookupOrderAction } from "@/server/actions/order.actions";

/**
 * Tra cứu đơn hàng cho khách vãng lai: cần mã đơn + số điện thoại đã dùng khi đặt.
 * Khi khớp, chuyển sang trang chi tiết kèm token truy cập.
 */
export function OrderLookupForm() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [message, setMessage] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setPending(true);

    const result = await lookupOrderAction({ orderNumber, phone });
    setPending(false);

    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    toast.success("Đã tìm thấy đơn hàng");
    router.push(
      `/account/orders/${orderNumber.trim().toUpperCase()}?token=${result.accessToken}`,
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormField label="Mã đơn hàng" htmlFor="lookup-order-number" required>
        <Input
          id="lookup-order-number"
          value={orderNumber}
          onChange={(event) => setOrderNumber(event.target.value)}
          placeholder="AH20260101-AB12CD"
          className="font-mono"
          required
        />
      </FormField>

      <FormField label="Số điện thoại đặt hàng" htmlFor="lookup-phone" required>
        <Input
          id="lookup-phone"
          inputMode="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="0901234567"
          required
        />
      </FormField>

      {message ? (
        <p role="alert" className="border border-danger/40 bg-danger/5 p-3 text-xs text-danger">
          {message}
        </p>
      ) : null}

      <Button type="submit" variant="outline" className="w-full" disabled={pending}>
        {pending ? "Đang tra cứu…" : "Tra cứu đơn hàng"}
      </Button>
    </form>
  );
}
