import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

import {
  ArchiveProductButton,
  RestoreProductButton,
  StockEditor,
} from "@/components/admin/product-actions";
import { Pagination } from "@/components/product/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input, Select } from "@/components/ui/input";
import { formatVnd } from "@/lib/format";
import { productImageUrl } from "@/lib/images";
import { toQueryString, type SearchParamsRecord } from "@/lib/search-params";
import { productTypeLabels } from "@/lib/site";
import { listAdminProducts } from "@/server/services/admin.service";

export const metadata: Metadata = { title: "Sản phẩm" };

const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "published", label: "Đang bán" },
  { value: "draft", label: "Bản nháp" },
  { value: "archived", label: "Đã ngừng bán" },
] as const;

type StatusValue = (typeof STATUS_OPTIONS)[number]["value"];

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseStatus(value: string | undefined): StatusValue {
  return STATUS_OPTIONS.some((option) => option.value === value)
    ? (value as StatusValue)
    : "all";
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsRecord>;
}) {
  const params = await searchParams;
  const q = first(params.q) ?? "";
  const status = parseStatus(first(params.status));
  const page = Number.parseInt(first(params.page) ?? "1", 10) || 1;

  const { items, total, totalPages } = await listAdminProducts({ q, status, page });

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl">Sản phẩm</h1>
          <p className="text-sm text-muted">{total} sản phẩm</p>
        </div>
        <Button variant="accent" asChild>
          <Link href="/admin/products/new">
            <Plus />
            Thêm sản phẩm
          </Link>
        </Button>
      </header>

      <form action="/admin/products" method="get" className="flex flex-wrap gap-3">
        <Input
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Tìm theo tên hoặc SKU…"
          className="max-w-xs"
        />
        <Select name="status" defaultValue={status} className="max-w-[180px]">
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Button type="submit" variant="outline">
          Lọc
        </Button>
      </form>

      {items.length === 0 ? (
        <EmptyState
          title="Không có sản phẩm nào"
          description="Thử đổi bộ lọc hoặc thêm sản phẩm mới."
        />
      ) : (
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[840px] text-sm">
            <thead className="bg-surface-muted/60 text-left">
              <tr>
                <th scope="col" className="px-4 py-2 font-medium">
                  Sản phẩm
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  Loại / Tình trạng
                </th>
                <th scope="col" className="px-4 py-2 text-right font-medium">
                  Giá
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  Tồn kho
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  Trạng thái
                </th>
                <th scope="col" className="px-4 py-2 text-right font-medium">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {items.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={productImageUrl(product.images[0]?.url)}
                        alt=""
                        width={44}
                        height={44}
                        unoptimized
                        className="size-11 shrink-0 rounded-xs border border-border object-contain"
                      />
                      <div className="min-w-0">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="block truncate hover:text-accent"
                        >
                          {product.name}
                        </Link>
                        <span className="font-mono text-xs text-muted">{product.sku}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {productTypeLabels[product.productType] ?? product.productType}
                    <br />
                    {product.category?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right">{formatVnd(product.price)}</td>
                  <td className="px-4 py-3">
                    <StockEditor id={product.id} stockQuantity={product.stockQuantity} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {product.archivedAt ? (
                        <Badge variant="danger">Đã ngừng bán</Badge>
                      ) : product.isPublished ? (
                        <Badge variant="success">Đang bán</Badge>
                      ) : (
                        <Badge variant="warning">Bản nháp</Badge>
                      )}
                      {product.isFeatured ? <Badge variant="accent">Nổi bật</Badge> : null}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/products/${product.id}`}>Sửa</Link>
                      </Button>
                      {product.archivedAt ? (
                        <RestoreProductButton id={product.id} />
                      ) : (
                        <ArchiveProductButton id={product.id} name={product.name} />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        buildHref={(target) => `/admin/products${toQueryString(params, { page: String(target) })}`}
      />
    </div>
  );
}
