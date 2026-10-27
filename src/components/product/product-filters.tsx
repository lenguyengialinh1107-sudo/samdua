import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { productConditionLabels, productTypeLabels } from "@/lib/site";
import { cn } from "@/lib/utils";
import { PRODUCT_CONDITIONS, PRODUCT_TYPES } from "@/lib/validations/product";
import type { ProductFilters as ProductFiltersValue } from "@/server/repositories/product.repository";
import type { findActiveCategories, findBrandsWithProductCount } from "@/server/repositories/taxonomy.repository";

type Categories = Awaited<ReturnType<typeof findActiveCategories>>;
type Brands = Awaited<ReturnType<typeof findBrandsWithProductCount>>;

const sortOptions = [
  { value: "newest", label: "Mới nhất" },
  { value: "price-asc", label: "Giá thấp → cao" },
  { value: "price-desc", label: "Giá cao → thấp" },
] as const;

/**
 * Bộ lọc dạng form GET thuần: hoạt động không cần JavaScript,
 * mọi trạng thái đều nằm trên URL nên có thể chia sẻ/đặt lại dễ dàng.
 */
export function ProductFilters({
  filters,
  categories,
  brands,
  total,
}: {
  filters: ProductFiltersValue;
  categories: Categories;
  brands: Brands;
  total: number;
}) {
  const activeBrands = filters.brandSlugs ?? [];
  const activeTypes = filters.productTypes ?? [];
  const activeConditions = filters.conditions ?? [];

  const hasFilters =
    Boolean(filters.q) ||
    Boolean(filters.categorySlug) ||
    activeBrands.length > 0 ||
    activeTypes.length > 0 ||
    activeConditions.length > 0 ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    Boolean(filters.inStockOnly);

  return (
    <form action="/products" method="get" className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="ah-label">Bộ lọc</p>
        {hasFilters ? (
          <Link href="/products" className="text-xs text-accent hover:underline">
            Xoá bộ lọc
          </Link>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="filter-q" className="ah-label block">
          Từ khoá
        </label>
        <Input
          id="filter-q"
          name="q"
          type="search"
          defaultValue={filters.q ?? ""}
          placeholder="Tên máy, SKU, thương hiệu…"
        />
      </div>

      <fieldset className="space-y-2">
        <legend className="ah-label">Danh mục</legend>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="category"
              value=""
              defaultChecked={!filters.categorySlug}
              className="accent-[var(--ah-accent)]"
            />
            Tất cả
          </label>
          {categories.map((category) => (
            <label key={category.id} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="category"
                value={category.slug}
                defaultChecked={filters.categorySlug === category.slug}
                className="accent-[var(--ah-accent)]"
              />
              {category.name}
              <span className="text-xs text-muted">({category._count.products})</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="ah-label">Loại sản phẩm</legend>
        <div className="space-y-1.5">
          {PRODUCT_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="type"
                value={type}
                defaultChecked={filters.productTypes!.includes(type)}
                className="accent-[var(--ah-accent)]"
              />
              {productTypeLabels[type]}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="ah-label">Tình trạng</legend>
        <div className="space-y-1.5">
          {PRODUCT_CONDITIONS.map((condition) => (
            <label key={condition} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="condition"
                value={condition}
                defaultChecked={filters.conditions!.includes(condition)}
                className="accent-[var(--ah-accent)]"
              />
              {productConditionLabels[condition]}
            </label>
          ))}
        </div>
      </fieldset>

      {brands.length > 0 ? (
        <fieldset className="space-y-2">
          <legend className="ah-label">Thương hiệu</legend>
          <div className="max-h-52 space-y-1.5 overflow-y-auto pr-1">
            {brands.map((brand) => (
              <label key={brand.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="brand"
                  value={brand.slug}
                  defaultChecked={activeBrands.includes(brand.slug)}
                  className="accent-[var(--ah-accent)]"
                />
                {brand.name}
                <span className="text-xs text-muted">({brand._count.products})</span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      <fieldset className="space-y-2">
        <legend className="ah-label">Khoảng giá (VND)</legend>
        <div className="flex items-center gap-2">
          <Input
            name="min"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Từ"
            defaultValue={filters.minPrice ?? ""}
            aria-label="Giá thấp nhất"
          />
          <span className="text-muted">–</span>
          <Input
            name="max"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Đến"
            defaultValue={filters.maxPrice ?? ""}
            aria-label="Giá cao nhất"
          />
        </div>
      </fieldset>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="stock"
          value="in-stock"
          defaultChecked={filters.inStockOnly}
          className="accent-[var(--ah-accent)]"
        />
        Chỉ hiện sản phẩm còn hàng
      </label>

      <div className="space-y-2">
        <label htmlFor="filter-sort" className="ah-label block">
          Sắp xếp
        </label>
        <Select id="filter-sort" name="sort" defaultValue={filters.sort ?? "newest"}>
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      <Button type="submit" variant="default" className={cn("w-full")}>
        Áp dụng ({total})
      </Button>
    </form>
  );
}
