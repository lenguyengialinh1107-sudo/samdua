import type { Metadata } from "next";
import Link from "next/link";

import { ProductForm } from "@/components/admin/product-form";
import { findAllBrands, findAllCategories } from "@/server/repositories/taxonomy.repository";

export const metadata: Metadata = { title: "Thêm sản phẩm" };

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([findAllCategories(), findAllBrands()]);

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="text-xs text-muted">
        <Link href="/admin/products" className="hover:text-accent">
          Sản phẩm
        </Link>
        <span className="px-2" aria-hidden>
          /
        </span>
        <span className="text-foreground">Thêm mới</span>
      </nav>

      <header className="space-y-1">
        <h1 className="font-serif text-2xl">Thêm sản phẩm</h1>
        <p className="text-sm text-muted">
          Sản phẩm chỉ hiển thị với khách khi được xuất bản và còn tồn kho.
        </p>
      </header>

      {categories.length === 0 ? (
        <p className="border border-warning/40 bg-warning/5 p-4 text-sm text-warning">
          Chưa có danh mục nào. Hãy tạo danh mục trước khi thêm sản phẩm.
        </p>
      ) : (
        <ProductForm categories={categories} brands={brands} />
      )}
    </div>
  );
}
