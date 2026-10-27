"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { loginAction } from "@/server/actions/session.actions";

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [serverMessage, setServerMessage] = React.useState<string | null>(null);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setServerMessage(null);
    const result = await loginAction({ ...values, redirectTo });

    if (!result.ok) {
      setServerMessage(result.message);
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          form.setError(field as keyof LoginInput, { message: messages[0] });
        }
      }
      toast.error("Đăng nhập thất bại", { description: result.message });
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
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
        label="Mật khẩu"
        htmlFor="password"
        required
        error={form.formState.errors.password?.message}
      >
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(form.formState.errors.password)}
          {...form.register("password")}
        />
      </FormField>

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
        {form.formState.isSubmitting ? "Đang đăng nhập…" : "Đăng nhập"}
      </Button>

      <p className="text-center text-sm text-muted">
        Chưa có tài khoản?{" "}
        <Link href="/register" className="text-accent underline underline-offset-4">
          Đăng ký ngay
        </Link>
      </p>
    </form>
  );
}
