/**
 * Quy tắc chuyển trạng thái đơn hàng — dùng chung cho admin và test.
 */
export type OrderStatusValue =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPING"
  | "COMPLETED"
  | "CANCELLED";

export const ORDER_STATUSES: OrderStatusValue[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPING",
  "COMPLETED",
  "CANCELLED",
];

export const ORDER_STATUS_TRANSITIONS: Record<OrderStatusValue, OrderStatusValue[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["SHIPPING", "CANCELLED"],
  SHIPPING: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export function isOrderStatus(value: unknown): value is OrderStatusValue {
  return typeof value === "string" && (ORDER_STATUSES as string[]).includes(value);
}

/** Chỉ cho phép chuyển trạng thái theo đúng luồng nghiệp vụ. */
export function canTransitionOrderStatus(
  from: OrderStatusValue,
  to: OrderStatusValue,
): boolean {
  return ORDER_STATUS_TRANSITIONS[from].includes(to);
}

export function nextOrderStatuses(from: OrderStatusValue): OrderStatusValue[] {
  return ORDER_STATUS_TRANSITIONS[from];
}

/** Huỷ đơn hoặc hoàn tất thì không được sửa nữa. */
export function isOrderLocked(status: OrderStatusValue): boolean {
  return status === "COMPLETED" || status === "CANCELLED";
}
