import type { Metadata } from "next";

import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getSessionUser } from "@/server/auth-guard";
import { getShippingConfig } from "@/server/services/settings.service";

export const metadata: Metadata = {
  title: "Đặt hàng",
  description: "Điền thông tin nhận hàng và chọn phương thức thanh toán.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const [config, user] = await Promise.all([getShippingConfig(), getSessionUser()]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl">Đặt hàng</h1>
        <p className="text-sm text-muted">
          Kiểm tra lại thông tin trước khi xác nhận. Giá và tồn kho được hệ thống kiểm tra lại
          ở bước cuối.
        </p>
      </header>

      <div className="mt-8">
        <CheckoutForm
          config={config}
          isAuthenticated={Boolean(user)}
          defaults={{
            customerName: user?.name ?? "",
            customerPhone: "",
            customerEmail: user?.email ?? "",
          }}
        />
      </div>
    </div>
  );
}
