import type { ProductCondition, ProductType } from "@prisma/client";

import { PRODUCT_CONDITIONS, PRODUCT_TYPES } from "@/lib/validations/product";
import {
  DEFAULT_PER_PAGE,
  findFeaturedProducts,
  findNewArrivals,
  findProductBySlug,
  findPublishedProducts,
  findRelatedProducts,
  type ProductFilters,
} from "@/server/repositories/product.repository";
import { findActiveCategories, findBrandsWithProductCount } from "@/server/repositories/taxonomy.repository";

export type SearchParamValue = string | string[] | undefined;

export interface RawSearchParams {
  q?: SearchParamValue;
  category?: SearchParamValue;
  brand?: SearchParamValue;
  type?: SearchParamValue;
  condition?: SearchParamValue;
  min?: SearchParamValue;
  max?: SearchParamValue;
  stock?: SearchParamValue;
  sort?: SearchParamValue;
  page?: SearchParamValue;
}

function toArray(value: SearchParamValue): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function toSingle(value: SearchParamValue): string | undefined {
  if (!value) return undefined;
  const first = Array.isArray(value) ? value[0] : value;
  return first?.trim() || undefined;
}

function toPositiveInt(value: SearchParamValue): number | undefined {
  const single = toSingle(value);
  if (!single) return undefined;
  const parsed = Number.parseInt(single.replace(/[^\d]/g, ""), 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

export function parseProductFilters(params: RawSearchParams): ProductFilters {
  const sortParam = toSingle(params.sort);
  const sort = sortParam === "price-asc" || sortParam === "price-desc" ? sortParam : "newest";

  return {
    q: toSingle(params.q),
    categorySlug: toSingle(params.category),
    brandSlugs: toArray(params.brand).filter(Boolean),
    productTypes: toArray(params.type).filter((value): value is ProductType =>
      (PRODUCT_TYPES as readonly string[]).includes(value),
    ),
    conditions: toArray(params.condition).filter((value): value is ProductCondition =>
      (PRODUCT_CONDITIONS as readonly string[]).includes(value),
    ),
    minPrice: toPositiveInt(params.min),
    maxPrice: toPositiveInt(params.max),
    inStockOnly: toSingle(params.stock) === "in-stock",
    sort,
    page: toPositiveInt(params.page) ?? 1,
    perPage: DEFAULT_PER_PAGE,
  };
}

export async function getProductListPage(params: RawSearchParams) {
  const filters = parseProductFilters(params);
  const [result, categories, brands] = await Promise.all([
    findPublishedProducts(filters),
    findActiveCategories(),
    findBrandsWithProductCount(),
  ]);

  return { ...result, filters, categories, brands };
}

export async function getProductDetail(slug: string) {
  const product = await findProductBySlug(slug);
  if (!product) return null;

  const related = await findRelatedProducts(product.id, product.categoryId, 4);
  return { product, related };
}

export async function getHomeSections() {
  const [featured, newArrivals, categories] = await Promise.all([
    findFeaturedProducts(4),
    findNewArrivals(8),
    findActiveCategories(),
  ]);

  return { featured, newArrivals, categories };
}
