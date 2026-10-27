import { Prisma, type OrderStatus, type PaymentStatus } from "@prisma/client";

import { parseVndInput } from "@/lib/format";
import type {
  BrandFormValues,
  CategoryFormValues,
  ProductFormValues,
} from "@/lib/validations/product";
import { canTransitionOrderStatus, isOrderStatus } from "@/lib/order-status";
import { parseImageUrlsText, parseSpecsText } from "@/lib/product-specs";
import { prisma } from "@/server/db";
import {
  cancelOrderAndRestoreStock,
  findOrderById,
  getOrderStats,
  updateOrderPaymentStatusById,
  updateOrderStatusById,
} from "@/server/repositories/order.repository";
import { findLowStockProducts, findProductsForAdmin } from "@/server/repositories/product.repository";

export class AdminError extends Error {
  constructor(
    message: string,
    readonly code: "DUPLICATE" | "INVALID_STATUS" | "NOT_FOUND" = "NOT_FOUND",
  ) {
    super(message);
    this.name = "AdminError";
  }
}

export async function getDashboardData() {
  const [stats, lowStock] = await Promise.all([getOrderStats(), findLowStockProducts(2, 5)]);
  return { ...stats, lowStock };
}

export async function listAdminProducts(options: {
  q?: string;
  status?: "all" | "published" | "draft" | "archived";
  page?: number;
}) {
  return findProductsForAdmin(options);
}

function buildProductData(values: ProductFormValues) {
  const price = parseVndInput(values.price);
  const stockQuantity = parseVndInput(values.stockQuantity);
  const compareAtPrice = values.compareAtPrice === "" ? null : parseVndInput(values.compareAtPrice);

  if (price === null || stockQuantity === null) {
    throw new AdminError("Giá và tồn kho phải là số nguyên VND hợp lệ.", "INVALID_STATUS");
  }
  if (stockQuantity > 9999) {
    throw new AdminError("Tồn kho tối đa 9999.", "INVALID_STATUS");
  }
  if (compareAtPrice !== null && compareAtPrice < price) {
    throw new AdminError("Giá so sánh phải lớn hơn hoặc bằng giá bán.", "INVALID_STATUS");
  }

  const specs = parseSpecsText(values.cameraSpecs);
  const emptyToNull = (value: string) => (value.trim() === "" ? null : value.trim());

  return {
    name: values.name,
    slug: values.slug,
    sku: values.sku,
    description: values.description,
    price,
    compareAtPrice,
    categoryId: values.categoryId,
    brandId: values.brandId === "" ? null : values.brandId,
    productType: values.productType,
    condition: values.condition,
    cameraSpecs: specs as Prisma.InputJsonValue,
    cosmeticCondition: emptyToNull(values.cosmeticCondition),
    functionalCondition: emptyToNull(values.functionalCondition),
    includedAccessories: emptyToNull(values.includedAccessories),
    warrantyText: emptyToNull(values.warrantyText),
    stockQuantity,
    isPublished: values.isPublished,
    isFeatured: values.isFeatured,
  };
}

function toAdminError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    const target = Array.isArray(error.meta?.target) ? error.meta?.target.join(", ") : "slug/SKU";
    throw new AdminError(`Giá trị đã tồn tại, vui lòng kiểm tra lại (${target}).`, "DUPLICATE");
  }
  throw error;
}

export async function createProduct(values: ProductFormValues) {
  const imageUrls = parseImageUrlsText(values.imageUrls);
  try {
    return await prisma.product.create({
      data: {
        ...buildProductData(values),
        images: {
          create: imageUrls.map((url, index) => ({
            url,
            alt: `${values.name} — ảnh ${index + 1}`,
            sortOrder: index,
          })),
        },
      },
    });
  } catch (error) {
    toAdminError(error);
  }
}

export async function updateProduct(id: string, values: ProductFormValues) {
  const imageUrls = parseImageUrlsText(values.imageUrls);
  try {
    return await prisma.$transaction(async (tx) => {
      const product = await tx.product.update({
        where: { id },
        data: buildProductData(values),
      });

      await tx.productImage.deleteMany({ where: { productId: id } });
      if (imageUrls.length > 0) {
        await tx.productImage.createMany({
          data: imageUrls.map((url, index) => ({
            productId: id,
            url,
            alt: `${values.name} — ảnh ${index + 1}`,
            sortOrder: index,
          })),
        });
      }

      return product;
    });
  } catch (error) {
    toAdminError(error);
  }
}

/**
 * Không xoá cứng sản phẩm đã từng bán: chuyển sang trạng thái archive
 * để giữ nguyên lịch sử đơn hàng.
 */
export async function archiveProduct(id: string) {
  return prisma.product.update({
    where: { id },
    data: { archivedAt: new Date(), isPublished: false, isFeatured: false },
  });
}

export async function restoreProduct(id: string) {
  return prisma.product.update({
    where: { id },
    data: { archivedAt: null },
  });
}

export async function updateProductStock(id: string, stockQuantity: number) {
  if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
    throw new AdminError("Tồn kho phải là số nguyên không âm.", "NOT_FOUND");
  }
  return prisma.product.update({ where: { id }, data: { stockQuantity } });
}

export async function changeOrderStatus(orderId: string, next: string) {
  if (!isOrderStatus(next)) {
    throw new AdminError("Trạng thái đơn hàng không hợp lệ.", "INVALID_STATUS");
  }

  const order = await findOrderById(orderId);
  if (!order) throw new AdminError("Không tìm thấy đơn hàng.", "NOT_FOUND");

  const from = order.orderStatus as OrderStatus;
  if (from === next) return order;

  if (!canTransitionOrderStatus(from, next)) {
    throw new AdminError(
      `Không thể chuyển từ trạng thái hiện tại sang trạng thái đã chọn.`,
      "INVALID_STATUS",
    );
  }

  if (next === "CANCELLED") {
    // Hoàn tồn kho khi huỷ đơn.
    return cancelOrderAndRestoreStock(orderId);
  }

  const now = new Date();
  return updateOrderStatusById(orderId, next, {
    ...(next === "CONFIRMED" ? { confirmedAt: now } : {}),
    ...(next === "COMPLETED" ? { completedAt: now } : {}),
  });
}

export async function setOrderPaymentStatus(orderId: string, paymentStatus: PaymentStatus) {
  return updateOrderPaymentStatusById(orderId, paymentStatus);
}

// ---------------------------------------------------------------------------
// Danh mục & thương hiệu
// ---------------------------------------------------------------------------

export async function createCategory(values: CategoryFormValues) {
  const sortOrder = parseVndInput(values.sortOrder) ?? 0;
  try {
    return await prisma.category.create({
      data: {
        name: values.name,
        slug: values.slug,
        description: values.description.trim() === "" ? null : values.description,
        sortOrder,
        isActive: values.isActive,
      },
    });
  } catch (error) {
    toAdminError(error);
  }
}

export async function updateCategory(id: string, values: CategoryFormValues) {
  const sortOrder = parseVndInput(values.sortOrder) ?? 0;
  try {
    return await prisma.category.update({
      where: { id },
      data: {
        name: values.name,
        slug: values.slug,
        description: values.description.trim() === "" ? null : values.description,
        sortOrder,
        isActive: values.isActive,
      },
    });
  } catch (error) {
    toAdminError(error);
  }
}

export async function createBrand(values: BrandFormValues) {
  try {
    return await prisma.brand.create({ data: values });
  } catch (error) {
    toAdminError(error);
  }
}
