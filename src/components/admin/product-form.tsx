"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/field";
import { Input, Select, Textarea } from "@/components/ui/input";
import { slugify } from "@/lib/format";
import { formatSpecsText } from "@/lib/product-specs";
import { productConditionLabels, productTypeLabels } from "@/lib/site";
import {
  PRODUCT_CONDITIONS,
  PRODUCT_TYPES,
  productFormSchema,
  type ProductFormValues,
} from "@/lib/validations/product";
import { saveProductAction } from "@/server/actions/admin-catalog.actions";

export interface ProductFormInitialValues {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  categoryId: string;
  brandId: string | null;
  productType: ProductFormValues["productType"];
  condition: ProductFormValues["condition"];
  cameraSpecs: unknown;
  cosmeticCondition: string | null;
  functionalCondition: string | null;
  includedAccessories: string | null;
  warrantyText: string | null;
  stockQuantity: number;
  isPublished: boolean;
  isFeatured: boolean;
  imageUrls: string[];
}

const emptyValues: ProductFormValues = {
  name: "",
  slug: "",
  sku: "",
  description: "",
  price: "",
  compareAtPrice: "",
  categoryId: "",
  brandId: "",
  productType: "FILM_CAMERA",
  condition: "EXCELLENT",
  cameraSpecs: "",
  cosmeticCondition: "",
  functionalCondition: "",
  includedAccessories: "",
  warrantyText: "",
  stockQuantity: "1",
  isPublished: true,
  isFeatured: false,
  imageUrls: "",
};

function toFormValues(product?: ProductFormInitialValues): ProductFormValues {
  if (!product) return emptyValues;

  return {
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    description: product.description,
    price: String(product.price),
    compareAtPrice: product.compareAtPrice === null ? "" : String(product.compareAtPrice),
    categoryId: product.categoryId,
    brandId: product.brandId ?? "",
    productType: product.productType,
    condition: product.condition,
    cameraSpecs: formatSpecsText(product.cameraSpecs),
    cosmeticCondition: product.cosmeticCondition ?? "",
    functionalCondition: product.functionalCondition ?? "",
    includedAccessories: product.includedAccessories ?? "",
    warrantyText: product.warrantyText ?? "",
    stockQuantity: String(product.stockQuantity),
    isPublished: product.isPublished,
    isFeatured: product.isFeatured,
    imageUrls: product.imageUrls.join("\n"),
  };
}

export function ProductForm({
  categories,
  brands,
  product,
}: {
  categories: { id: string; name: string }[];
  brands: { id: string; name: string }[];
  product?: ProductFormInitialValues;
}) {
  const router = useRouter();
  const [serverMessage, setServerMessage] = React.useState<string | null>(null);
  const [uploading, setUploading] = React.useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: toFormValues(product),
  });

  // Slug tự sinh từ tên khi tạo mới, nhưng vẫn cho phép sửa tay.
  const [slugTouched, setSlugTouched] = React.useState(Boolean(product));

  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!slugTouched) form.setValue("slug", slugify(event.target.value));
  }

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const payload = (await response.json()) as { ok: boolean; url?: string; message?: string };

      if (!response.ok || !payload.ok || !payload.url) {
        toast.error("Upload ảnh thất bại", { description: payload.message });
        return;
      }

      const current = form.getValues("imageUrls").trim();
      form.setValue("imageUrls", current ? `${current}\n${payload.url}` : payload.url, {
        shouldDirty: true,
      });
      toast.success("Đã thêm ảnh");
    } catch {
      toast.error("Upload ảnh thất bại", { description: "Không kết nối được tới server." });
    } finally {
      setUploading(false);
    }
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setServerMessage(null);

    const result = await saveProductAction({ id: product?.id, values });

    if (!result.ok) {
      setServerMessage(result.message);
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          form.setError(field as keyof ProductFormValues, { message: messages[0] });
        }
      }
      toast.error("Không thể lưu sản phẩm", { description: result.message });
      return;
    }

    toast.success(product ? "Đã cập nhật sản phẩm" : "Đã tạo sản phẩm");
    router.push("/admin/products");
    router.refresh();
  });

  const errors = form.formState.errors;

  return (
    <form onSubmit={onSubmit} className="grid gap-6 xl:grid-cols-[1fr_340px]" noValidate>
      <div className="space-y-6">
        <section className="space-y-4 border border-border bg-surface p-5">
          <h2 className="font-serif text-lg">Thông tin cơ bản</h2>

          <FormField label="Tên sản phẩm" htmlFor="name" required error={errors.name?.message}>
            <Input
              id="name"
              aria-invalid={Boolean(errors.name)}
              {...form.register("name", { onChange: handleNameChange })}
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Slug (đường dẫn)"
              htmlFor="slug"
              required
              error={errors.slug?.message}
              hint="Chỉ dùng chữ thường, số và dấu gạch ngang."
            >
              <Input
                id="slug"
                aria-invalid={Boolean(errors.slug)}
                {...form.register("slug", { onChange: () => setSlugTouched(true) })}
              />
            </FormField>

            <FormField label="SKU" htmlFor="sku" required error={errors.sku?.message}>
              <Input
                id="sku"
                placeholder="SS-0001"
                aria-invalid={Boolean(errors.sku)}
                {...form.register("sku")}
              />
            </FormField>
          </div>

          <FormField
            label="Mô tả"
            htmlFor="description"
            required
            error={errors.description?.message}
            hint="Tối thiểu 20 ký tự."
          >
            <Textarea
              id="description"
              rows={5}
              aria-invalid={Boolean(errors.description)}
              {...form.register("description")}
            />
          </FormField>
        </section>

        <section className="space-y-4 border border-border bg-surface p-5">
          <h2 className="font-serif text-lg">Phân loại & giá</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Danh mục" htmlFor="categoryId" required error={errors.categoryId?.message}>
              <Select
                id="categoryId"
                aria-invalid={Boolean(errors.categoryId)}
                {...form.register("categoryId")}
              >
                <option value="">— Chọn danh mục —</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Thương hiệu" htmlFor="brandId" error={errors.brandId?.message}>
              <Select id="brandId" {...form.register("brandId")}>
                <option value="">— Không có —</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Loại sản phẩm" htmlFor="productType" required>
              <Select id="productType" {...form.register("productType")}>
                {PRODUCT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {productTypeLabels[type] ?? type}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Tình trạng" htmlFor="condition" required>
              <Select id="condition" {...form.register("condition")}>
                {PRODUCT_CONDITIONS.map((condition) => (
                  <option key={condition} value={condition}>
                    {productConditionLabels[condition] ?? condition}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Giá bán (VND)" htmlFor="price" required error={errors.price?.message}>
              <Input
                id="price"
                inputMode="numeric"
                placeholder="12500000"
                aria-invalid={Boolean(errors.price)}
                {...form.register("price")}
              />
            </FormField>

            <FormField
              label="Giá so sánh"
              htmlFor="compareAtPrice"
              error={errors.compareAtPrice?.message}
              hint="Để trống nếu không giảm giá."
            >
              <Input
                id="compareAtPrice"
                inputMode="numeric"
                aria-invalid={Boolean(errors.compareAtPrice)}
                {...form.register("compareAtPrice")}
              />
            </FormField>

            <FormField
              label="Tồn kho"
              htmlFor="stockQuantity"
              required
              error={errors.stockQuantity?.message}
            >
              <Input
                id="stockQuantity"
                inputMode="numeric"
                aria-invalid={Boolean(errors.stockQuantity)}
                {...form.register("stockQuantity")}
              />
            </FormField>
          </div>
        </section>

        <section className="space-y-4 border border-border bg-surface p-5">
          <h2 className="font-serif text-lg">Tình trạng chi tiết & thông số</h2>

          <FormField
            label="Thông số kỹ thuật"
            htmlFor="cameraSpecs"
            error={errors.cameraSpecs?.message}
            hint="Mỗi dòng một thông số, dạng “Tên: giá trị”. Ví dụ: Mount: M42"
          >
            <Textarea id="cameraSpecs" rows={5} {...form.register("cameraSpecs")} />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Ngoại hình"
              htmlFor="cosmeticCondition"
              error={errors.cosmeticCondition?.message}
            >
              <Textarea id="cosmeticCondition" rows={3} {...form.register("cosmeticCondition")} />
            </FormField>

            <FormField
              label="Hoạt động"
              htmlFor="functionalCondition"
              error={errors.functionalCondition?.message}
            >
              <Textarea id="functionalCondition" rows={3} {...form.register("functionalCondition")} />
            </FormField>
          </div>

          <FormField
            label="Phụ kiện đi kèm"
            htmlFor="includedAccessories"
            error={errors.includedAccessories?.message}
          >
            <Textarea id="includedAccessories" rows={3} {...form.register("includedAccessories")} />
          </FormField>

          <FormField label="Bảo hành" htmlFor="warrantyText" error={errors.warrantyText?.message}>
            <Textarea id="warrantyText" rows={2} {...form.register("warrantyText")} />
          </FormField>
        </section>
      </div>

      <aside className="h-fit space-y-6 xl:sticky xl:top-24">
        <section className="space-y-4 border border-border bg-surface p-5">
          <h2 className="font-serif text-lg">Hiển thị</h2>

          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              className="mt-0.5 accent-[var(--ah-accent)]"
              {...form.register("isPublished")}
            />
            <span>
              <span className="block font-medium">Xuất bản</span>
              <span className="block text-xs text-muted">Cho phép khách xem sản phẩm.</span>
            </span>
          </label>

          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              className="mt-0.5 accent-[var(--ah-accent)]"
              {...form.register("isFeatured")}
            />
            <span>
              <span className="block font-medium">Sản phẩm nổi bật</span>
              <span className="block text-xs text-muted">Hiển thị ở mục nổi bật trên trang chủ.</span>
            </span>
          </label>
        </section>

        <section className="space-y-4 border border-border bg-surface p-5">
          <h2 className="font-serif text-lg">Ảnh sản phẩm</h2>

          <FormField
            label="Danh sách URL ảnh"
            htmlFor="imageUrls"
            error={errors.imageUrls?.message}
            hint="Mỗi dòng một URL. Ảnh đầu tiên là ảnh chính. Tối đa 12 ảnh."
          >
            <Textarea id="imageUrls" rows={6} {...form.register("imageUrls")} />
          </FormField>

          <div className="space-y-2">
            <label
              htmlFor="imageUpload"
              className="block text-xs font-semibold uppercase tracking-widest text-muted"
            >
              Tải ảnh lên
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="block w-full text-xs file:mr-3 file:rounded-sm file:border file:border-border-strong file:bg-surface-muted file:px-3 file:py-1.5 file:text-xs file:text-foreground"
            />
            <p className="text-xs text-muted">
              {uploading
                ? "Đang tải ảnh lên…"
                : "Cần cấu hình Cloudinary trong .env. Nếu chưa cấu hình, hãy dán URL ảnh thủ công."}
            </p>
          </div>
        </section>

        {serverMessage ? (
          <p role="alert" className="border border-danger/40 bg-danger/5 p-3 text-xs text-danger">
            {serverMessage}
          </p>
        ) : null}

        <div className="flex flex-col gap-2">
          <Button type="submit" variant="accent" size="lg" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Đang lưu…" : product ? "Lưu thay đổi" : "Tạo sản phẩm"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.push("/admin/products")}>
            Huỷ
          </Button>
        </div>
      </aside>
    </form>
  );
}
