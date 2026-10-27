"use server";

import { revalidatePath } from "next/cache";

import { checkoutSchema, type CheckoutInput } from "@/lib/validations/checkout";
import { getSessionUser } from "@/server/auth-guard";
import {
  failure,
  toErrorMessage,
  zodFieldErrors,
  type ActionResult,
} from "@/server/actions/action-result";
import { findOrderByNumber } from "@/server/repositories/order.repository";
import { createOrder, OrderError } from "@/server/services/order.service";

export interface CreateOrderPayload extends CheckoutInput {
  items: { productId: string; quantity: number }[];
}

export async function createOrderAction(
  payload: CreateOrderPayload,
): Promise<ActionResult<{ orderNumber: string; accessToken: string }>> {
  const parsed = checkoutSchema.safeParse(payload);
  if (!parsed.success) {
    return failure("Vui lòng kiểm tra lại thông tin đặt hàng.", zodFieldErrors(parsed.error));
  }

  const user = await getSessionUser();

  try {
    const order = await createOrder({
      userId: user?.id ?? null,
      customerName: parsed.data.customerName,
      customerPhone: parsed.data.customerPhone,
      customerEmail: parsed.data.customerEmail ? parsed.data.customerEmail : null,
      shippingAddress: parsed.data.shippingAddress,
      note: parsed.data.note ? parsed.data.note : null,
      paymentMethod: parsed.data.paymentMethod,
      items: payload.items,
    });

    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    if (user) revalidatePath("/account/orders");

    return { ok: true, orderNumber: order.orderNumber, accessToken: order.accessToken };
  } catch (error) {
    if (error instanceof OrderError) return failure(error.message);
    return failure(toErrorMessage(error, "Không thể tạo đơn hàng, vui lòng thử lại."));
  }
}

/**
 * Tra cứu đơn cho khách vãng lai: cần đúng số đơn + số điện thoại đã dùng khi đặt.
 * Trả về token truy cập đơn để mở trang chi tiết an toàn.
 */
export async function lookupOrderAction(input: {
  orderNumber: string;
  phone: string;
}): Promise<ActionResult<{ accessToken: string }>> {
  const orderNumber = input.orderNumber.trim().toUpperCase();
  const phone = input.phone.trim();

  if (!orderNumber || !phone) {
    return failure("Vui lòng nhập mã đơn hàng và số điện thoại.");
  }

  const order = await findOrderByNumber(orderNumber);

  // Thông báo giống nhau cho mọi trường hợp sai để tránh dò thông tin đơn hàng.
  if (!order || order.customerPhone !== phone) {
    return failure("Không tìm thấy đơn hàng khớp với thông tin đã nhập.");
  }

  return { ok: true, accessToken: order.accessToken };
}
