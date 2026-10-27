"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { registerAction } from "@/server/actions/auth.actions";
import { loginAction } from "@/server/actions/session.actions";

export function RegisterForm() {
  const [serverMessage, setServerMessage] = React.useState<string | null>(null);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", phone: "", password: "", confirmPassword: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setServerMessage(null);

    const result = await registerAction(values);
    if (!result.ok) {
      setServerMessage(result.message);
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          form.setError(field as keyof RegisterInput, { message: messages[0] });
        }
      }
      toast.error("Đăng ký thất bại", { description: result.message });
      return;
    }

    toast.success("Tạo tài khoản thành công", {
      description: "Đang đăng nhập vào tài khoản của bạn…",
    });

    // Đăng nhập luôn sau khi đăng ký; server action sẽ điều hướng sang /account.
    await loginAction({ email: values.email, password: values.password, redirectTo: "/account" });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <FormField
        label="Họ và tên"
        htmlFor="name"
        required
        error={form.formState.errors.name?.message}
      >
        <Input
          id="name"
          autoComplete="name"
          aria-invalid={Boolean(form.formState.errors.name)}
          {...form.register("name")}
        />
      </FormField>

      <FormField
        label="Email"
        htmlFor="email"
        required
        error={form.formState.errors.email?.message}
      >
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(form.formState.errors.email)}
          {...form.register("email")}
        />
      </FormField>

      <FormField
        label="Số điện thoại (không bắt buộc)"
        htmlFor="phone"
        error={form.formState.errors.phone?.message}
      >
        <Input
          id="phone"
          inputMode="tel"
          autoComplete="tel"
          aria-invalid={Boolean(form.formState.errors.phone)}
          {...form.register("phone")}
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Mật khẩu"
          htmlFor="password"
          required
          error={form.formState.errors.password?.message}
          hint="Tối thiểu 8 ký tự, có chữ và số."
        >
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            aria-invalid={Boolean(form.formState.errors.password)}
            {...form.register("password")}
          />
        </FormField>

        <FormField
          label="Nhập lại mật khẩu"
          htmlFor="confirmPassword"
          required
          error={form.formState.errors.confirmPassword?.message}
        >
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            aria-invalid={Boolean(form.formState.errors.confirmPassword)}
            {...form.register("confirmPassword")}
          />
        </FormField>
      </div>

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
        {form.formState.isSubmitting ? "Đang tạo tài khoản…" : "Tạo tài khoản"}
      </Button>

      <p className="text-center text-sm text-muted">
        Đã có tài khoản?{" "}
        <Link href="/login" className="text-accent underline underline-offset-4">
          Đăng nhập
        </Link>
      </p>
    </form>
  );
}
