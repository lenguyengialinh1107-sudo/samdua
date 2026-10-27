/**
 * Logic giỏ hàng thuần (không phụ thuộc React/DB) để dùng chung cho
 * client (hiển thị) và server (tính lại khi tạo đơn).
 *
 * Quan trọng: tổng tiền hiển thị ở client chỉ là tham khảo.
 * Server LUÔN tính lại từ giá trong database tại thời điểm checkout.
 */

export interface ShippingConfig {
  /** Phí vận chuyển cố định (VND). */
  flatFee: number;
  /** Miễn phí vận chuyển cho đơn từ mức này (VND). */
  freeThreshold: number;
  /** Ghi chú hiển thị cho khách. */
  note: string;
}

export const DEFAULT_SHIPPING_CONFIG: ShippingConfig = {
  flatFee: 35_000,
  freeThreshold: 5_000_000,
  note: "Phí vận chuyển nội thành Hà Nội. Đơn từ 5.000.000 ₫ được miễn phí giao hàng.",
};

export interface PricedLine {
  unitPrice: number;
  quantity: number;
}

export interface PricedCartLine extends PricedLine {
  maxQuantity?: number;
}

export function calculateSubtotal(lines: PricedLine[]): number {
  return lines.reduce((total, line) => {
    const quantity = Number.isFinite(line.quantity) ? Math.max(0, Math.trunc(line.quantity)) : 0;
    const price = Number.isFinite(line.unitPrice) ? Math.max(0, Math.trunc(line.unitPrice)) : 0;
    return total + price * quantity;
  }, 0);
}

export function countItems(lines: PricedLine[]): number {
  return lines.reduce((total, line) => total + Math.max(0, Math.trunc(line.quantity)), 0);
}

export function calculateShippingFee(
  subtotal: number,
  config: ShippingConfig = DEFAULT_SHIPPING_CONFIG,
): number {
  if (subtotal <= 0) return 0;
  if (subtotal >= config.freeThreshold) return 0;
  return config.flatFee;
}

export function calculateGrandTotal(input: {
  subtotal: number;
  shippingFee: number;
  discountTotal?: number;
}): number {
  const discount = input.discountTotal ?? 0;
  return Math.max(0, input.subtotal + input.shippingFee - discount);
}

/** Nhân tổng tiền giỏ hàng theo phí vận chuyển cấu hình. */
export function summarizeCart(
  lines: PricedLine[],
  config: ShippingConfig = DEFAULT_SHIPPING_CONFIG,
) {
  const subtotal = calculateSubtotal(lines);
  const shippingFee = calculateShippingFee(subtotal, config);
  return {
    subtotal,
    shippingFee,
    discountTotal: 0,
    grandTotal: calculateGrandTotal({ subtotal, shippingFee }),
    itemCount: countItems(lines),
    freeShippingRemaining: Math.max(0, config.freeThreshold - subtotal),
  };
}

/**
 * Kiểm tra số lượng hợp lệ so với tồn kho.
 * Trả về số lượng đã được kẹp trong khoảng [1, tồn kho].
 */
export function clampQuantity(quantity: number, stockQuantity: number): number {
  const stock = Math.max(0, Math.trunc(stockQuantity));
  if (stock === 0) return 0;
  const requested = Number.isFinite(quantity) ? Math.trunc(quantity) : 1;
  return Math.min(Math.max(requested, 1), stock);
}
