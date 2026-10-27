import { prisma } from "@/server/db";

export async function findActiveCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: { where: { isPublished: true } } } } },
  });
}

export async function findAllCategories() {
  return prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });
}

export async function findCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function findBrandsWithProductCount() {
  return prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: { where: { isPublished: true } } } } },
  });
}

export async function findAllBrands() {
  return prisma.brand.findMany({ orderBy: { name: "asc" } });
}
