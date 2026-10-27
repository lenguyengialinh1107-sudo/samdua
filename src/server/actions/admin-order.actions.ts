"use server";

import { revalidatePath } from "next/cache";

import { assertAdmin } from "@/server/auth-guard";
import { failure, toErrorMessage, type ActionResult } from "@/server/actions/action-result";
import { changeOrderStatus, setOrderPaymentStatus } from "@/server/services/admin.service";

export async function changeOrderStatusAction(input: {
  orderId: string;
  status: string;
}): Promise<ActionResult> {
  await assertAdmin();

  try {
    await changeOrderStatus(input.orderId, input.status);
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${input.orderId}`);
    revalidatePath("/admin");
    return { ok: true };
  } catch (error) {
    return failure(toErrorMessage(error, "Không thể cập nhật trạng thái đơn hàng."));
  }
}

export async function setPaymentStatusAction(input: {
  orderId: string;
  paymentStatus: "UNPAID" | "PAID" | "REFUNDED" | "FAILED";
}): Promise<ActionResult> {
  await assertAdmin();

  try {
    await setOrderPaymentStatus(input.orderId, input.paymentStatus);
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${input.orderId}`);
    return { ok: true };
  } catch (error) {
    return failure(toErrorMessage(error, "Không thể cập nhật trạng thái thanh toán."));
  }
}
