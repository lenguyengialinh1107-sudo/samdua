import type { Prisma, ProductCondition, ProductType } from "@prisma/client";

import { prisma } from "@/server/db";

export interface ProductFilters {
  q?: string;
  categorySlug?: string;
  brandSlugs?: string[];
  productTypes?: ProductType[];
  conditions?: ProductCondition[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sort?: "newest" | "price-asc" | "price-desc";
  page?: number;
  perPage?: number;
}

export const DEFAULT_PER_PAGE = 9;

export const productListInclude = {
  images: { orderBy: { sortOrder: "asc" } },
  category: true,
  brand: true,
} satisfies Prisma.ProductInclude;

export const productDetailInclude = {
  images: { orderBy: { sortOrder: "asc" } },
  category: true,
  brand: true,
} satisfies Prisma.ProductInclude;

export type ProductListItem = Prisma.ProductGetPayload<{
  include: typeof productListInclude;
}>;

function buildWhere(filters: ProductFilters): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {
    isPublished: true,
    archivedAt: null,
  };

  if (filters.q) {
    const q = filters.q.trim();
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { sku: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { brand: { name: { contains: q, mode: "insensitive" } } },
    ];
  }

  if (filters.categorySlug) {
    where.category = { slug: filters.categorySlug, isActive: true };
  }

  if (filters.brandSlugs?.length) {
    where.brand = { slug: { in: filters.brandSlugs } };
  }

  if (filters.productTypes?.length) {
    where.productType = { in: filters.productTypes };
  }

  if (filters.conditions?.length) {
    where.condition = { in: filters.conditions };
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {
      ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
      ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
    };
  }

  if (filters.inStockOnly) {
    where.stockQuantity = { gt: 0 };
  }

  return where;
}

function buildOrderBy(sort: ProductFilters["sort"]): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "price-asc":
      return { price: "asc" };
    case "price-desc":
      return { price: "desc" };
    default:
      return { createdAt: "desc" };
  }
}

export async function findPublishedProducts(filters: ProductFilters) {
  const page = Math.max(1, filters.page ?? 1);
  const perPage = filters.perPage ?? DEFAULT_PER_PAGE;
  const where = buildWhere(filters);

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productListInclude,
      orderBy: buildOrderBy(filters.sort),
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
  };
}

export async function findProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, isPublished: true, archivedAt: null },
    include: productDetailInclude,
  });
}

export async function findFeaturedProducts(limit = 4) {
  return prisma.product.findMany({
    where: { isPublished: true, archivedAt: null, isFeatured: true },
    include: productListInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function findNewArrivals(limit = 8) {
  return prisma.product.findMany({
    where: { isPublished: true, archivedAt: null },
    include: productListInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function findRelatedProducts(
  productId: string,
  categoryId: string,
  limit = 4,
) {
  return prisma.product.findMany({
    where: {
      isPublished: true,
      archivedAt: null,
      categoryId,
      id: { not: productId },
    },
    include: productListInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

/** Danh sách cho admin: bao gồm cả sản phẩm chưa publish và đã archive. */
export async function findProductsForAdmin(options: {
  q?: string;
  status?: "all" | "published" | "draft" | "archived";
  page?: number;
  perPage?: number;
}) {
  const page = Math.max(1, options.page ?? 1);
  const perPage = options.perPage ?? 15;

  const where: Prisma.ProductWhereInput = {};
  if (options.q) {
    where.OR = [
      { name: { contains: options.q, mode: "insensitive" } },
      { sku: { contains: options.q, mode: "insensitive" } },
    ];
  }
  if (options.status === "published") {
    where.isPublished = true;
    where.archivedAt = null;
  } else if (options.status === "draft") {
    where.isPublished = false;
    where.archivedAt = null;
  } else if (options.status === "archived") {
    where.archivedAt = { not: null };
  }

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true, brand: true, images: { orderBy: { sortOrder: "asc" }, take: 1 } },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total, page, perPage, totalPages: Math.max(1, Math.ceil(total / perPage)) };
}

export async function findProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: productDetailInclude,
  });
}

export async function findProductsByIds(ids: string[]) {
  return prisma.product.findMany({
    where: { id: { in: ids } },
    include: productListInclude,
  });
}

/** Chỉ lấy slug + thời điểm cập nhật để dựng sitemap, tránh tải toàn bộ sản phẩm. */
export async function findPublishedProductSlugs() {
  return prisma.product.findMany({
    where: { isPublished: true, archivedAt: null },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function findLowStockProducts(threshold = 2, limit = 5) {
  return prisma.product.findMany({
    where: { isPublished: true, archivedAt: null, stockQuantity: { lte: threshold } },
    include: { category: true },
    orderBy: { stockQuantity: "asc" },
    take: limit,
  });
}
