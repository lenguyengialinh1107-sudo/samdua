import type { Metadata } from "next";

import { CartView } from "@/components/cart/cart-view";
import { getShippingConfig } from "@/server/services/settings.service";

export const metadata: Metadata = {
  title: "Giỏ hàng",
  description: "Xem lại các sản phẩm bạn đã chọn trước khi đặt hàng.",
  robots: { index: false, follow: false },
};

export default async function CartPage() {
  const config = await getShippingConfig();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl">Giỏ hàng</h1>
        <p className="text-sm text-muted">{config.note}</p>
      </header>
      <div className="mt-8">
        <CartView config={config} />
      </div>
    </div>
  );
}
