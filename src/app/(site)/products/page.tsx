import type { Metadata } from "next";
import Link from "next/link";

import { Pagination } from "@/components/product/pagination";
import { ProductCard } from "@/components/product/product-card";
import { ProductFilters } from "@/components/product/product-filters";
import { EmptyState } from "@/components/ui/empty-state";
import { formatNumber } from "@/lib/format";
import { toQueryString, type SearchParamsRecord } from "@/lib/search-params";
import { getProductListPage } from "@/server/services/catalog.service";

export const metadata: Metadata = {
  title: "Tất cả sản phẩm",
  description:
    "Danh sách máy ảnh film, máy ảnh digital, compact, lens và phụ kiện nhiếp ảnh đang có tại Second Shot.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsRecord>;
}) {
  const params = await searchParams;
  const { items, total, page, totalPages, filters, categories, brands } =
    await getProductListPage(params);

  const activeCategory = categories.find(
    (category) => category.slug === filters.categorySlug,
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="text-xs text-muted">
        <ol className="flex gap-2">
          <li>
            <Link href="/" className="hover:text-accent">
              Trang chủ
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-foreground">{activeCategory?.name ?? "Tất cả sản phẩm"}</li>
        </ol>
      </nav>

      <header className="mt-4 space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl">
          {activeCategory?.name ?? "Tất cả sản phẩm"}
        </h1>
        <p className="text-sm text-muted">
          {activeCategory?.description ??
            "Máy đã kiểm tra, mô tả trung thực, bảo hành rõ ràng."}
        </p>
        <p className="text-xs text-muted">{formatNumber(total)} sản phẩm</p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="border border-border bg-surface p-5">
            <ProductFilters
              filters={filters}
              categories={categories}
              brands={brands}
              total={total}
            />
          </div>
        </aside>

        <div className="space-y-8">
          {items.length > 0 ? (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <Pagination
                page={page}
                totalPages={totalPages}
                buildHref={(target) =>
                  `/products${toQueryString(params, { page: String(target) })}`
                }
              />
            </>
          ) : (
            <EmptyState
              title="Không tìm thấy sản phẩm phù hợp"
              description="Thử bỏ bớt bộ lọc hoặc tìm với từ khoá khác."
              action={
                <Link
                  href="/products"
                  className="text-sm text-accent underline underline-offset-4"
                >
                  Xoá toàn bộ bộ lọc
                </Link>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
