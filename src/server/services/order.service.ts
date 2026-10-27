import { randomBytes } from "node:crypto";

import type { PaymentMethod, PaymentStatus } from "@prisma/client";

import {
  calculateGrandTotal,
  calculateShippingFee,
  calculateSubtotal,
  type PricedLine,
} from "@/lib/cart";
import { cartSubmissionSchema } from "@/lib/validations/checkout";
import { createOrderWithStock } from "@/server/repositories/order.repository";
import { findProductsByIds } from "@/server/repositories/product.repository";
import { getShippingConfig } from "@/server/services/settings.service";

export interface CreateOrderPayload {
  userId: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  shippingAddress: string;
  note: string | null;
  paymentMethod: PaymentMethod;
  items: { productId: string; quantity: number }[];
}

function generateOrderNumber(): string {
  const now = new Date();
  const stamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");
  const suffix = randomBytes(3).toString("hex").toUpperCase();
  return `SS${stamp}-${suffix}`;
}

export class OrderError extends Error {
  constructor(
    message: string,
    readonly code:
      | "EMPTY_CART"
      | "PRODUCT_UNAVAILABLE"
      | "OUT_OF_STOCK"
      | "INVALID_INPUT" = "INVALID_INPUT",
  ) {
    super(message);
    this.name = "OrderError";
  }
}

/**
 * Tạo đơn hàng từ phía server.
 * Giá và tồn kho LUÔN được đọc lại từ database — không tin dữ liệu client gửi.
 */
export async function createOrder(payload: CreateOrderPayload) {
  const parsed = cartSubmissionSchema.safeParse({ items: payload.items });
  if (!parsed.success) {
    throw new OrderError("Giỏ hàng không hợp lệ.", "EMPTY_CART");
  }

  const requested = parsed.data.items;
  const products = await findProductsByIds(requested.map((item) => item.productId));
  const productMap = new Map(products.map((product) => [product.id, product]));

  const lines: PricedLine[] = [];
  const orderItems = [];

  for (const item of requested) {
    const product = productMap.get(item.productId);

    if (!product || !product.isPublished || product.archivedAt) {
      throw new OrderError(
        "Một sản phẩm trong giỏ đã ngừng bán. Vui lòng kiểm tra lại giỏ hàng.",
        "PRODUCT_UNAVAILABLE",
      );
    }

    if (product.stockQuantity < item.quantity) {
      throw new OrderError(
        product.stockQuantity === 0
          ? `"${product.name}" đã hết hàng.`
          : `"${product.name}" chỉ còn ${product.stockQuantity} sản phẩm.`,
        "OUT_OF_STOCK",
      );
    }

    const unitPrice = product.price;
    const lineTotal = unitPrice * item.quantity;

    lines.push({ unitPrice, quantity: item.quantity });
    orderItems.push({
      productId: product.id,
      productName: product.name,
      productSku: product.sku,
      unitPrice,
      quantity: item.quantity,
      lineTotal,
    });
  }

  const shippingConfig = await getShippingConfig();
  const subtotal = calculateSubtotal(lines);
  const shippingFee = calculateShippingFee(subtotal, shippingConfig);
  const discountTotal = 0;
  const grandTotal = calculateGrandTotal({ subtotal, shippingFee, discountTotal });

  const paymentStatus: PaymentStatus = "UNPAID";

  // `orderNumber` là unique; thử lại vài lần nếu trùng (rất hiếm).
  let lastError: unknown = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await createOrderWithStock({
        orderNumber: generateOrderNumber(),
        userId: payload.userId,
        customerName: payload.customerName,
        customerPhone: payload.customerPhone,
        customerEmail: payload.customerEmail,
        shippingAddress: payload.shippingAddress,
        note: payload.note,
        subtotal,
        shippingFee,
        discountTotal,
        grandTotal,
        paymentMethod: payload.paymentMethod,
        paymentStatus,
        items: orderItems,
      });
    } catch (error) {
      lastError = error;
      const message = error instanceof Error ? error.message : "";
      // Chỉ retry khi trùng orderNumber; lỗi tồn kho phải ném ra ngay.
      if (!message.includes("orderNumber") && !message.includes("Unique constraint")) {
        throw error;
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new OrderError("Không thể tạo đơn hàng, vui lòng thử lại.");
}
