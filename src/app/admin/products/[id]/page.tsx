import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductForm } from "@/components/admin/product-form";
import { findProductById } from "@/server/repositories/product.repository";
import { findAllBrands, findAllCategories } from "@/server/repositories/taxonomy.repository";

export const metadata: Metadata = { title: "Sửa sản phẩm" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [product, categories, brands] = await Promise.all([
    findProductById(id),
    findAllCategories(),
    findAllBrands(),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="text-xs text-muted">
        <Link href="/admin/products" className="hover:text-accent">
          Sản phẩm
        </Link>
        <span className="px-2" aria-hidden>
          /
        </span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl">Sửa sản phẩm</h1>
          <p className="font-mono text-xs text-muted">{product.sku}</p>
        </div>
        {product.slug ? (
          <Link
            href={`/products/${product.slug}`}
            target="_blank"
            className="text-sm text-accent hover:underline"
          >
            Xem trên cửa hàng ↗
          </Link>
        ) : null}
      </header>

      <ProductForm
        categories={categories}
        brands={brands}
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          description: product.description,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          categoryId: product.categoryId,
          brandId: product.brandId,
          productType: product.productType,
          condition: product.condition,
          cameraSpecs: product.cameraSpecs,
          cosmeticCondition: product.cosmeticCondition,
          functionalCondition: product.functionalCondition,
          includedAccessories: product.includedAccessories,
          warrantyText: product.warrantyText,
          stockQuantity: product.stockQuantity,
          isPublished: product.isPublished,
          isFeatured: product.isFeatured,
          imageUrls: product.images.map((image) => image.url),
        }}
      />
    </div>
  );
}
