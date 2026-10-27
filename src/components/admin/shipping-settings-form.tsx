"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { formatVnd } from "@/lib/format";
import { shippingSettingsSchema, type ShippingSettingsValues } from "@/lib/validations/product";
import { updateShippingSettingsAction } from "@/server/actions/admin-catalog.actions";

export function ShippingSettingsForm({
  flatFee,
  freeThreshold,
}: {
  flatFee: number;
  freeThreshold: number;
}) {
  const router = useRouter();
  const [serverMessage, setServerMessage] = React.useState<string | null>(null);

  const form = useForm<ShippingSettingsValues>({
    resolver: zodResolver(shippingSettingsSchema),
    defaultValues: {
      flatFee: String(flatFee),
      freeThreshold: String(freeThreshold),
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setServerMessage(null);
    const result = await updateShippingSettingsAction(values);

    if (!result.ok) {
      setServerMessage(result.message);
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          form.setError(field as keyof ShippingSettingsValues, { message: messages[0] });
        }
      }
      toast.error("Không thể lưu cấu hình", { description: result.message });
      return;
    }

    toast.success("Đã lưu cấu hình vận chuyển");
    router.refresh();
  });

  const errors = form.formState.errors;

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-xl space-y-4 border border-border bg-surface p-5"
      noValidate
    >
      <h2 className="font-serif text-lg">Phí vận chuyển</h2>
      <p className="text-xs text-muted">
        Phí được tính thủ công khi khách đặt hàng. Đơn đạt mức miễn phí sẽ không mất phí vận chuyển.
      </p>

      <FormField
        label="Phí vận chuyển mặc định (VND)"
        htmlFor="flatFee"
        required
        error={errors.flatFee?.message}
        hint={`Hiện tại: ${formatVnd(Number.parseInt(form.watch("flatFee") || "0", 10))}`}
      >
        <Input
          id="flatFee"
          inputMode="numeric"
          aria-invalid={Boolean(errors.flatFee)}
          {...form.register("flatFee")}
        />
      </FormField>

      <FormField
        label="Miễn phí vận chuyển từ (VND)"
        htmlFor="freeThreshold"
        required
        error={errors.freeThreshold?.message}
        hint={`Hiện tại: ${formatVnd(Number.parseInt(form.watch("freeThreshold") || "0", 10))}`}
      >
        <Input
          id="freeThreshold"
          inputMode="numeric"
          aria-invalid={Boolean(errors.freeThreshold)}
          {...form.register("freeThreshold")}
        />
      </FormField>

      {serverMessage ? (
        <p role="alert" className="border border-danger/40 bg-danger/5 p-3 text-xs text-danger">
          {serverMessage}
        </p>
      ) : null}

      <Button type="submit" variant="accent" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Đang lưu…" : "Lưu cấu hình"}
      </Button>
    </form>
  );
}
