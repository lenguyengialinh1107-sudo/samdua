"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import { slugify } from "@/lib/format";
import {
  brandFormSchema,
  categoryFormSchema,
  type BrandFormValues,
  type CategoryFormValues,
} from "@/lib/validations/product";
import { createBrandAction, saveCategoryAction } from "@/server/actions/admin-catalog.actions";

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
}

const emptyCategory: CategoryFormValues = {
  name: "",
  slug: "",
  description: "",
  sortOrder: "0",
  isActive: true,
};

export function CategoryManager({ categories }: { categories: AdminCategory[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [serverMessage, setServerMessage] = React.useState<string | null>(null);
  const [slugTouched, setSlugTouched] = React.useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: emptyCategory,
  });

  function startEdit(category: AdminCategory) {
    setEditingId(category.id);
    setSlugTouched(true);
    setServerMessage(null);
    form.reset({
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      sortOrder: String(category.sortOrder),
      isActive: category.isActive,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setSlugTouched(false);
    setServerMessage(null);
    form.reset(emptyCategory);
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setServerMessage(null);
    const result = await saveCategoryAction({ id: editingId ?? undefined, values });

    if (!result.ok) {
      setServerMessage(result.message);
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          form.setError(field as keyof CategoryFormValues, { message: messages[0] });
        }
      }
      toast.error("Không thể lưu danh mục", { description: result.message });
      return;
    }

    toast.success(editingId ? "Đã cập nhật danh mục" : "Đã tạo danh mục");
    cancelEdit();
    router.refresh();
  });

  const errors = form.formState.errors;

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="overflow-x-auto border border-border">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-surface-muted/60 text-left">
            <tr>
              <th scope="col" className="px-4 py-2 font-medium">
                Danh mục
              </th>
              <th scope="col" className="px-4 py-2 font-medium">
                Thứ tự
              </th>
              <th scope="col" className="px-4 py-2 font-medium">
                Sản phẩm
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
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-4 py-3">
                  <span className="block">{category.name}</span>
                  <span className="font-mono text-xs text-muted">{category.slug}</span>
                </td>
                <td className="px-4 py-3">{category.sortOrder}</td>
                <td className="px-4 py-3">{category.productCount}</td>
                <td className="px-4 py-3">
                  <Badge variant={category.isActive ? "success" : "default"}>
                    {category.isActive ? "Đang hiện" : "Đang ẩn"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="outline" size="sm" onClick={() => startEdit(category)}>
                    Sửa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={onSubmit} className="h-fit space-y-4 border border-border bg-surface p-5" noValidate>
        <h2 className="font-serif text-lg">{editingId ? "Sửa danh mục" : "Thêm danh mục"}</h2>

        <FormField label="Tên danh mục" htmlFor="category-name" required error={errors.name?.message}>
          <Input
            id="category-name"
            aria-invalid={Boolean(errors.name)}
            {...form.register("name", {
              onChange: (event) => {
                if (!slugTouched) form.setValue("slug", slugify(event.target.value));
              },
            })}
          />
        </FormField>

        <FormField label="Slug" htmlFor="category-slug" required error={errors.slug?.message}>
          <Input
            id="category-slug"
            aria-invalid={Boolean(errors.slug)}
            {...form.register("slug", { onChange: () => setSlugTouched(true) })}
          />
        </FormField>

        <FormField label="Mô tả" htmlFor="category-description" error={errors.description?.message}>
          <Textarea id="category-description" rows={3} {...form.register("description")} />
        </FormField>

        <FormField label="Thứ tự hiển thị" htmlFor="category-sort" error={errors.sortOrder?.message}>
          <Input
            id="category-sort"
            inputMode="numeric"
            aria-invalid={Boolean(errors.sortOrder)}
            {...form.register("sortOrder")}
          />
        </FormField>

        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" className="accent-[var(--ah-accent)]" {...form.register("isActive")} />
          Hiển thị danh mục trên cửa hàng
        </label>

        {serverMessage ? (
          <p role="alert" className="border border-danger/40 bg-danger/5 p-3 text-xs text-danger">
            {serverMessage}
          </p>
        ) : null}

        <div className="flex gap-2">
          <Button type="submit" variant="accent" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Đang lưu…" : editingId ? "Lưu thay đổi" : "Thêm danh mục"}
          </Button>
          {editingId ? (
            <Button type="button" variant="ghost" onClick={cancelEdit}>
              Huỷ
            </Button>
          ) : null}
        </div>
      </form>
    </div>
  );
}

export function BrandManager({
  brands,
}: {
  brands: { id: string; name: string; slug: string; productCount: number }[];
}) {
  const router = useRouter();
  const [serverMessage, setServerMessage] = React.useState<string | null>(null);
  const [slugTouched, setSlugTouched] = React.useState(false);

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: { name: "", slug: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setServerMessage(null);
    const result = await createBrandAction(values);

    if (!result.ok) {
      setServerMessage(result.message);
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          form.setError(field as keyof BrandFormValues, { message: messages[0] });
        }
      }
      toast.error("Không thể thêm thương hiệu", { description: result.message });
      return;
    }

    toast.success("Đã thêm thương hiệu");
    setSlugTouched(false);
    form.reset({ name: "", slug: "" });
    router.refresh();
  });

  const errors = form.formState.errors;

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="flex flex-wrap gap-2">
        {brands.map((brand) => (
          <span
            key={brand.id}
            className="inline-flex items-center gap-2 border border-border bg-surface px-3 py-1.5 text-sm"
          >
            {brand.name}
            <span className="text-xs text-muted">({brand.productCount})</span>
          </span>
        ))}
        {brands.length === 0 ? <p className="text-sm text-muted">Chưa có thương hiệu nào.</p> : null}
      </div>

      <form onSubmit={onSubmit} className="h-fit space-y-4 border border-border bg-surface p-5" noValidate>
        <h2 className="font-serif text-lg">Thêm thương hiệu</h2>

        <FormField label="Tên thương hiệu" htmlFor="brand-name" required error={errors.name?.message}>
          <Input
            id="brand-name"
            aria-invalid={Boolean(errors.name)}
            {...form.register("name", {
              onChange: (event) => {
                if (!slugTouched) form.setValue("slug", slugify(event.target.value));
              },
            })}
          />
        </FormField>

        <FormField label="Slug" htmlFor="brand-slug" required error={errors.slug?.message}>
          <Input
            id="brand-slug"
            aria-invalid={Boolean(errors.slug)}
            {...form.register("slug", { onChange: () => setSlugTouched(true) })}
          />
        </FormField>

        {serverMessage ? (
          <p role="alert" className="border border-danger/40 bg-danger/5 p-3 text-xs text-danger">
            {serverMessage}
          </p>
        ) : null}

        <Button type="submit" variant="accent" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Đang lưu…" : "Thêm thương hiệu"}
        </Button>
        <p className="text-xs text-muted">
          Thương hiệu không thể sửa hoặc xoá để bảo toàn dữ liệu sản phẩm.
        </p>
      </form>
    </div>
  );
}
