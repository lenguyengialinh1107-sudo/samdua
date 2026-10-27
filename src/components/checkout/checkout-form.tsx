"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { ArrowRight, Banknote, Building2 } from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FormField } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import { summarizeCart, type ShippingConfig } from "@/lib/cart";
import { formatVnd } from "@/lib/format";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations/checkout";
import { createOrderAction } from "@/server/actions/order.actions";

const paymentOptions = [
  {
    value: "COD" as const,
    icon: Banknote,
    title: "Thanh toán khi nhận hàng (COD)",
    description: "Kiểm tra máy rồi mới thanh toán cho nhân viên giao hàng.",
  },
  {
    value: "BANK_TRANSFER" as const,
    icon: Building2,
    title: "Chuyển khoản ngân hàng",
    description: "Cửa hàng gửi thông tin chuyển khoản sau khi xác nhận đơn.",
  },
];

export function CheckoutForm({
  config,
  isAuthenticated,
  defaults,
}: {
  config: ShippingConfig;
  isAuthenticated: boolean;
  defaults: { customerName: string; customerPhone: string; customerEmail: string };
}) {
  const router = useRouter();
  const { lines, isReady, clear } = useCart();
  const [serverMessage, setServerMessage] = React.useState<string | null>(null);

  const form = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: defaults.customerName,
      customerPhone: defaults.customerPhone,
      customerEmail: defaults.customerEmail,
      shippingAddress: "",
      note: "",
      paymentMethod: "COD",
    },
  });

  const paymentMethod = form.watch("paymentMethod");
  const summary = summarizeCart(lines, config);

  const onSubmit = form.handleSubmit(async (values) => {
    setServerMessage(null);

    const result = await createOrderAction({
      ...values,
      items: lines.map((line) => ({ productId: line.productId, quantity: line.quantity })),
    });

    if (!result.ok) {
      setServerMessage(result.message);
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          form.setError(field as keyof CheckoutInput, { message: messages[0] });
        }
      }
      toast.error("Không thể đặt hàng", { description: result.message });
      return;
    }

    clear();
    router.push(`/order-success/${result.orderNumber}?token=${result.accessToken}`);
  });

  if (!isReady) {
    return <p className="text-sm text-muted">Đang tải giỏ hàng…</p>;
  }

  if (lines.length === 0) {
    return (
      <EmptyState
        title="Chưa có sản phẩm để đặt hàng"
        description="Giỏ hàng của bạn đang trống."
        action={
          <Button variant="accent" asChild>
            <Link href="/products">Chọn sản phẩm</Link>
          </Button>
        }
      />
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1fr_360px]" noValidate>
      <div className="space-y-6">
        <section className="space-y-4 border border-border bg-surface p-5">
          <h2 className="font-serif text-lg">Thông tin người nhận</h2>

          <FormField
            label="Họ và tên"
            htmlFor="customerName"
            required
            error={form.formState.errors.customerName?.message}
          >
            <Input
              id="customerName"
              autoComplete="name"
              aria-invalid={Boolean(form.formState.errors.customerName)}
              {...form.register("customerName")}
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Số điện thoại"
              htmlFor="customerPhone"
              required
              error={form.formState.errors.customerPhone?.message}
            >
              <Input
                id="customerPhone"
                inputMode="tel"
                autoComplete="tel"
                aria-invalid={Boolean(form.formState.errors.customerPhone)}
                {...form.register("customerPhone")}
              />
            </FormField>

            <FormField
              label="Email (không bắt buộc)"
              htmlFor="customerEmail"
              error={form.formState.errors.customerEmail?.message}
              hint="Dùng để gửi xác nhận đơn hàng."
            >
              <Input
                id="customerEmail"
                type="email"
                autoComplete="email"
                aria-invalid={Boolean(form.formState.errors.customerEmail)}
                {...form.register("customerEmail")}
              />
            </FormField>
          </div>

          <FormField
            label="Địa chỉ nhận hàng"
            htmlFor="shippingAddress"
            required
            error={form.formState.errors.shippingAddress?.message}
            hint="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành."
          >
            <Textarea
              id="shippingAddress"
              rows={3}
              autoComplete="street-address"
              aria-invalid={Boolean(form.formState.errors.shippingAddress)}
              {...form.register("shippingAddress")}
            />
          </FormField>

          <FormField
            label="Ghi chú (không bắt buộc)"
            htmlFor="note"
            error={form.formState.errors.note?.message}
          >
            <Textarea
              id="note"
              rows={2}
              placeholder="Ví dụ: giao ngoài giờ hành chính, cần kiểm tra kỹ lens…"
              aria-invalid={Boolean(form.formState.errors.note)}
              {...form.register("note")}
            />
          </FormField>
        </section>

        <section className="space-y-4 border border-border bg-surface p-5">
          <h2 className="font-serif text-lg">Phương thức thanh toán</h2>
          <div className="space-y-3">
            {paymentOptions.map((option) => (
              <label
                key={option.value}
                className={cn(
                  "flex cursor-pointer items-start gap-3 border p-4 transition-colors",
                  paymentMethod === option.value
                    ? "border-accent bg-accent-soft/40"
                    : "border-border hover:border-border-strong",
                )}
              >
                <input
                  type="radio"
                  value={option.value}
                  className="mt-1 accent-[var(--ah-accent)]"
                  {...form.register("paymentMethod")}
                />
                <span className="space-y-1">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <option.icon className="size-4 text-accent" aria-hidden />
                    {option.title}
                  </span>
                  <span className="block text-xs text-muted">{option.description}</span>
                </span>
              </label>
            ))}
          </div>
          {form.formState.errors.paymentMethod ? (
            <p role="alert" className="text-xs text-danger">
              {form.formState.errors.paymentMethod.message}
            </p>
          ) : null}

          {paymentMethod === "BANK_TRANSFER" ? (
            <div className="border border-dashed border-border-strong bg-surface-muted/50 p-4 text-xs text-muted">
              <p className="text-foreground">Thông tin chuyển khoản (demo):</p>
              <p>{site.bank.bankName}</p>
              <p>Số tài khoản: {site.bank.accountNumber}</p>
              <p>Chủ tài khoản: {site.bank.accountHolder}</p>
              <p>{site.bank.note}</p>
            </div>
          ) : null}
        </section>

        {!isAuthenticated ? (
          <p className="text-xs text-muted">
            Bạn đang đặt hàng với tư cách khách vãng lai.{" "}
            <Link href="/login?next=/checkout" className="text-accent underline underline-offset-4">
              Đăng nhập
            </Link>{" "}
            để lưu lại lịch sử đơn hàng.
          </p>
        ) : null}
      </div>

      <aside className="h-fit space-y-4 border border-border bg-surface p-5 lg:sticky lg:top-24">
        <p className="ah-label">Đơn hàng của bạn</p>

        <ul className="max-h-72 space-y-3 overflow-y-auto pr-1 text-sm">
          {lines.map((line) => (
            <li key={line.productId} className="flex justify-between gap-3">
              <span className="min-w-0">
                <span className="block truncate">{line.name}</span>
                <span className="text-xs text-muted">
                  {formatVnd(line.unitPrice)} × {line.quantity}
                </span>
              </span>
              <span className="whitespace-nowrap font-medium">
                {formatVnd(line.unitPrice * line.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <dl className="space-y-2 border-t border-border pt-3 text-sm">
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

        {serverMessage ? (
          <p role="alert" className="border border-danger/40 bg-danger/5 p-3 text-xs text-danger">
            {serverMessage}
          </p>
        ) : null}

        <Button
          type="submit"
          variant="accent"
          size="lg"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Đang xử lý…" : "Đặt hàng"}
          <ArrowRight />
        </Button>
        <p className="text-xs text-muted">
          Nhấn đặt hàng nghĩa là bạn đồng ý với{" "}
          <Link href="/policies/returns" className="text-accent underline underline-offset-4">
            chính sách đổi trả
          </Link>{" "}
          của cửa hàng.
        </p>
      </aside>
    </form>
  );
}
