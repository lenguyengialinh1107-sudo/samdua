import type {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Prisma,
} from "@prisma/client";

import { prisma } from "@/server/db";

export const orderInclude = {
  items: { orderBy: { id: "asc" } },
} satisfies Prisma.OrderInclude;

export interface CreateOrderItemInput {
  productId: string;
  productName: string;
  productSku: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface CreateOrderInput {
  orderNumber: string;
  userId: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  shippingAddress: string;
  note: string | null;
  subtotal: number;
  shippingFee: number;
  discountTotal: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  items: CreateOrderItemInput[];
}

/**
 * Tạo đơn hàng trong MỘT transaction:
 * - Trừ tồn kho bằng điều kiện `stockQuantity >= quantity` để hai đơn đồng thời
 *   không thể bán vượt số lượng (chống oversell).
 * - Nếu bất kỳ dòng nào không đủ hàng, ném lỗi để rollback toàn bộ.
 */
export async function createOrderWithStock(input: CreateOrderInput) {
  return prisma.$transaction(async (tx) => {
    for (const item of input.items) {
      const updated = await tx.product.updateMany({
        where: { id: item.productId, stockQuantity: { gte: item.quantity } },
        data: { stockQuantity: { decrement: item.quantity } },
      });

      if (updated.count !== 1) {
        throw new Error(
          `Sản phẩm "${item.productName}" không đủ tồn kho để hoàn tất đơn hàng.`,
        );
      }
    }

    return tx.order.create({
      data: {
        orderNumber: input.orderNumber,
        userId: input.userId,
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        customerEmail: input.customerEmail,
        shippingAddress: input.shippingAddress,
        note: input.note,
        subtotal: input.subtotal,
        shippingFee: input.shippingFee,
        discountTotal: input.discountTotal,
        grandTotal: input.grandTotal,
        paymentMethod: input.paymentMethod,
        paymentStatus: input.paymentStatus,
        items: { create: input.items },
      },
      include: orderInclude,
    });
  });
}

export async function findOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: orderInclude,
  });
}

export async function findOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { ...orderInclude, user: true },
  });
}

export async function findOrdersByUserId(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function findOrdersForAdmin(options: {
  q?: string;
  status?: OrderStatus | "ALL";
  page?: number;
  perPage?: number;
}) {
  const page = Math.max(1, options.page ?? 1);
  const perPage = options.perPage ?? 15;

  const where: Prisma.OrderWhereInput = {};
  if (options.q) {
    where.OR = [
      { orderNumber: { contains: options.q, mode: "insensitive" } },
      { customerName: { contains: options.q, mode: "insensitive" } },
      { customerPhone: { contains: options.q } },
    ];
  }
  if (options.status && options.status !== "ALL") {
    where.orderStatus = options.status;
  }

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: orderInclude,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.order.count({ where }),
  ]);

  return { items, total, page, perPage, totalPages: Math.max(1, Math.ceil(total / perPage)) };
}

export async function updateOrderStatusById(
  id: string,
  orderStatus: OrderStatus,
  timestamps: { confirmedAt?: Date; completedAt?: Date; cancelledAt?: Date },
) {
  return prisma.order.update({
    where: { id },
    data: { orderStatus, ...timestamps },
    include: orderInclude,
  });
}

export async function updateOrderPaymentStatusById(id: string, paymentStatus: PaymentStatus) {
  return prisma.order.update({ where: { id }, data: { paymentStatus } });
}

/**
 * Huỷ đơn + hoàn tồn kho trong cùng một transaction.
 */
export async function cancelOrderAndRestoreStock(id: string) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id }, include: orderInclude });
    if (!order) throw new Error("Không tìm thấy đơn hàng.");

    for (const item of order.items) {
      if (!item.productId) continue;
      await tx.product.update({
        where: { id: item.productId },
        data: { stockQuantity: { increment: item.quantity } },
      });
    }

    return tx.order.update({
      where: { id },
      data: { orderStatus: "CANCELLED", cancelledAt: new Date() },
      include: orderInclude,
    });
  });
}

export async function getOrderStats() {
  const [totalOrders, byStatus, revenue, recentOrders, pendingCount] = await Promise.all([
    prisma.order.count(),
    prisma.order.groupBy({ by: ["orderStatus"], _count: { _all: true } }),
    prisma.order.aggregate({
      _sum: { grandTotal: true },
      where: { orderStatus: { not: "CANCELLED" } },
    }),
    prisma.order.findMany({
      include: orderInclude,
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.order.count({ where: { orderStatus: "PENDING" } }),
  ]);

  const statusCounts = byStatus.reduce<Record<string, number>>((accumulator, row) => {
    accumulator[row.orderStatus] = row._count._all;
    return accumulator;
  }, {});

  return {
    totalOrders,
    pendingCount,
    revenue: revenue._sum.grandTotal ?? 0,
    statusCounts,
    recentOrders,
  };
}
