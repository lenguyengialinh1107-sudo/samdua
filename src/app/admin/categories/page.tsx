import type { Metadata } from "next";

import { BrandManager, CategoryManager } from "@/components/admin/category-forms";
import {
  findAllCategories,
  findBrandsWithProductCount,
} from "@/server/repositories/taxonomy.repository";

export const metadata: Metadata = { title: "Danh mục & thương hiệu" };

export default async function AdminCategoriesPage() {
  const [categories, brands] = await Promise.all([
    findAllCategories(),
    findBrandsWithProductCount(),
  ]);

  return (
    <div className="space-y-10">
      <header className="space-y-1">
        <h1 className="font-serif text-2xl">Danh mục & thương hiệu</h1>
        <p className="text-sm text-muted">
          Danh mục và thương hiệu dùng để phân loại và lọc sản phẩm trên cửa hàng.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="font-serif text-xl">Danh mục</h2>
        <CategoryManager
          categories={categories.map((category) => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            sortOrder: category.sortOrder,
            isActive: category.isActive,
            productCount: category._count.products,
          }))}
        />
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-xl">Thương hiệu</h2>
        <BrandManager
          brands={brands.map((brand) => ({
            id: brand.id,
            name: brand.name,
            slug: brand.slug,
            productCount: brand._count.products,
          }))}
        />
      </section>
    </div>
  );
}
