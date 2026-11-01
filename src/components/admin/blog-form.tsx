"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/field";
import { Input, Select, Textarea } from "@/components/ui/input";
import { blogCategories } from "@/lib/blog/categories";
import { parseTagInput } from "@/lib/blog/blog";
import { slugify } from "@/lib/format";
import { BLOG_STATUSES, type BlogStatus } from "@/lib/blog/types";
import { blogPostFormSchema, type BlogPostFormValues } from "@/lib/validations/blog";
import { saveBlogPostAction } from "@/server/actions/admin-blog.actions";

export interface BlogFormInitialValues {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  categorySlug: BlogPostFormValues["categorySlug"];
  tags: string[];
  coverImage: string;
  coverAlt: string;
  gallery: string[];
  author: string;
  readingMinutes: number;
  isFeatured: boolean;
  status: BlogStatus;
  content: string;
}

const STATUS_LABELS: Record<BlogStatus, string> = {
  DRAFT: "Bản nháp",
  PUBLISHED: "Đã xuất bản",
};

const emptyValues: BlogPostFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  categorySlug: "huong-dan-cho-nguoi-moi",
  tags: "",
  coverImage: "",
  coverAlt: "",
  galleryImages: "",
  author: "Second Shot",
  readingMinutes: "0",
  content: "",
  isFeatured: false,
  status: "DRAFT",
};

function toFormValues(post?: BlogFormInitialValues): BlogPostFormValues {
  if (!post) return emptyValues;

  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    categorySlug: post.categorySlug,
    tags: post.tags.join(", "),
    coverImage: post.coverImage,
    coverAlt: post.coverAlt,
    galleryImages: post.gallery.join("\n"),
    author: post.author,
    readingMinutes: String(post.readingMinutes),
    content: post.content,
    isFeatured: post.isFeatured,
    status: post.status,
  };
}

export function BlogForm({ post }: { post?: BlogFormInitialValues }) {
  const router = useRouter();
  const [serverMessage, setServerMessage] = React.useState<string | null>(null);
  const [uploading, setUploading] = React.useState<"cover" | "gallery" | null>(null);

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: toFormValues(post),
  });

  // Slug tự sinh từ tiêu đề khi tạo mới, vẫn cho phép sửa tay.
  const [slugTouched, setSlugTouched] = React.useState(Boolean(post));

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!slugTouched) form.setValue("slug", slugify(event.target.value));
  }

  async function uploadFile(file: File): Promise<string | null> {
    const body = new FormData();
    body.append("file", file);
    body.append("folder", "blog");

    try {
      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const payload = (await response.json()) as { ok: boolean; url?: string; message?: string };

      if (!response.ok || !payload.ok || !payload.url) {
        toast.error("Upload ảnh thất bại", { description: payload.message });
        return null;
      }
      return payload.url;
    } catch {
      toast.error("Upload ảnh thất bại", { description: "Không kết nối được tới server." });
      return null;
    }
  }

  async function handleCoverUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading("cover");
    const url = await uploadFile(file);
    setUploading(null);

    if (url) {
      form.setValue("coverImage", url, { shouldDirty: true });
      toast.success("Đã thêm ảnh bìa");
    }
  }

  async function handleGalleryUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    setUploading("gallery");
    const urls: string[] = [];
    for (const file of files) {
      const url = await uploadFile(file);
      if (url) urls.push(url);
    }
    setUploading(null);

    if (urls.length === 0) return;

    const current = form.getValues("galleryImages").trim();
    form.setValue("galleryImages", current ? `${current}\n${urls.join("\n")}` : urls.join("\n"), {
      shouldDirty: true,
    });
    toast.success("Đã thêm ảnh minh hoạ");
  }

  async function persist(values: BlogPostFormValues) {
    setServerMessage(null);
    const result = await saveBlogPostAction({ id: post?.id, values });

    if (!result.ok) {
      setServerMessage(result.message);
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          form.setError(field as keyof BlogPostFormValues, { message: messages[0] });
        }
      }
      toast.error("Không thể lưu bài viết", { description: result.message });
      return null;
    }

    return result;
  }

  const onSave = form.handleSubmit(async (values) => {
    const result = await persist(values);
    if (!result) return;

    toast.success(post ? "Đã cập nhật bài viết" : "Đã tạo bài viết");
    router.push("/admin/blog");
    router.refresh();
  });

  const onPreview = form.handleSubmit(async (values) => {
    const result = await persist(values);
    if (!result) return;

    toast.success("Đã lưu bản xem trước");
    window.open(`/admin/blog/${result.postId}/preview`, "_blank", "noopener");

    if (post) {
      router.refresh();
    } else {
      // Bài mới: chuyển sang trang chỉnh sửa để các lần lưu sau là cập nhật.
      router.replace(`/admin/blog/${result.postId}`);
    }
  });

  async function handleToggle() {
    const current = form.getValues("status");
    form.setValue("status", current === "PUBLISHED" ? "DRAFT" : "PUBLISHED", {
      shouldDirty: true,
    });
  }

  const errors = form.formState.errors;
  const status = form.watch("status");
  const tagsPreview = parseTagInput(form.watch("tags") ?? "");

  return (
    <form onSubmit={onSave} className="grid gap-6 xl:grid-cols-[1fr_340px]" noValidate>
      <div className="space-y-6">
        <section className="space-y-4 border border-border bg-surface p-5">
          <h2 className="font-serif text-lg">Nội dung bài viết</h2>

          <FormField label="Tiêu đề" htmlFor="title" required error={errors.title?.message}>
            <Input
              id="title"
              aria-invalid={Boolean(errors.title)}
              {...form.register("title", { onChange: handleTitleChange })}
            />
          </FormField>

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

          <FormField
            label="Mô tả ngắn"
            htmlFor="excerpt"
            required
            error={errors.excerpt?.message}
            hint="Hiển thị trên card và trong kết quả tìm kiếm."
          >
            <Textarea
              id="excerpt"
              rows={3}
              aria-invalid={Boolean(errors.excerpt)}
              {...form.register("excerpt")}
            />
          </FormField>

          <FormField
            label="Nội dung"
            htmlFor="content"
            required
            error={errors.content?.message}
            hint={
              <>
                Dùng <code>## Tiêu đề mục</code> cho mục lớn (tự sinh mục lục),{" "}
                <code>- </code> cho gạch đầu dòng và <code>&gt; </code> cho trích dẫn.
              </>
            }
          >
            <Textarea
              id="content"
              rows={22}
              className="font-mono text-xs"
              aria-invalid={Boolean(errors.content)}
              {...form.register("content")}
            />
          </FormField>
        </section>
      </div>

      <aside className="h-fit space-y-6 xl:sticky xl:top-6">
        <section className="space-y-4 border border-border bg-surface p-5">
          <h2 className="font-serif text-lg">Xuất bản</h2>

          <FormField label="Trạng thái" htmlFor="status" required>
            <Select id="status" {...form.register("status")}>
              {BLOG_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {STATUS_LABELS[value]}
                </option>
              ))}
            </Select>
          </FormField>

          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              className="mt-0.5 accent-[var(--ah-accent)]"
              {...form.register("isFeatured")}
            />
            <span>
              <span className="block font-medium">Bài viết nổi bật</span>
              <span className="block text-xs text-muted">Hiển thị ở mục nổi bật trên trang Blog.</span>
            </span>
          </label>

          <Button type="button" variant="outline" size="sm" onClick={handleToggle}>
            {status === "PUBLISHED" ? "Chuyển về bản nháp" : "Chuyển sang xuất bản"}
          </Button>
        </section>

        <section className="space-y-4 border border-border bg-surface p-5">
          <h2 className="font-serif text-lg">Phân loại</h2>

          <FormField label="Danh mục" htmlFor="categorySlug" required>
            <Select id="categorySlug" {...form.register("categorySlug")}>
              {blogCategories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="Thẻ (tags)"
            htmlFor="tags"
            error={errors.tags?.message}
            hint="Phân tách bằng dấu phẩy. Ví dụ: người mới, chọn máy"
          >
            <Input id="tags" {...form.register("tags")} />
          </FormField>

          {tagsPreview.length > 0 ? (
            <p className="text-xs text-muted">Thẻ: {tagsPreview.map((tag) => `#${tag}`).join(" ")}</p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Tác giả" htmlFor="author" required error={errors.author?.message}>
              <Input id="author" aria-invalid={Boolean(errors.author)} {...form.register("author")} />
            </FormField>

            <FormField
              label="Phút đọc"
              htmlFor="readingMinutes"
              required
              error={errors.readingMinutes?.message}
              hint="Để 0 để tự tính theo nội dung."
            >
              <Input
                id="readingMinutes"
                inputMode="numeric"
                aria-invalid={Boolean(errors.readingMinutes)}
                {...form.register("readingMinutes")}
              />
            </FormField>
          </div>
        </section>

        <section className="space-y-4 border border-border bg-surface p-5">
          <h2 className="font-serif text-lg">Ảnh bìa</h2>

          <FormField
            label="URL ảnh bìa"
            htmlFor="coverImage"
            error={errors.coverImage?.message}
            hint="Để trống sẽ dùng ảnh mặc định."
          >
            <Input id="coverImage" {...form.register("coverImage")} />
          </FormField>

          <FormField label="Mô tả ảnh bìa" htmlFor="coverAlt" error={errors.coverAlt?.message}>
            <Input id="coverAlt" {...form.register("coverAlt")} />
          </FormField>

          <div className="space-y-2">
            <label
              htmlFor="coverUpload"
              className="block text-xs font-semibold uppercase tracking-widest text-muted"
            >
              Tải ảnh bìa lên
            </label>
            <input
              id="coverUpload"
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              disabled={uploading !== null}
              className="block w-full text-xs file:mr-3 file:rounded-sm file:border file:border-border-strong file:bg-surface-muted file:px-3 file:py-1.5 file:text-xs file:text-foreground"
            />
            <p className="text-xs text-muted">
              {uploading === "cover" ? "Đang tải ảnh lên…" : "Cần cấu hình Cloudinary trong .env."}
            </p>
          </div>
        </section>

        <section className="space-y-4 border border-border bg-surface p-5">
          <h2 className="font-serif text-lg">Ảnh minh hoạ</h2>

          <FormField
            label="Danh sách URL ảnh"
            htmlFor="galleryImages"
            error={errors.galleryImages?.message}
            hint="Mỗi dòng một URL. Tối đa 8 ảnh."
          >
            <Textarea id="galleryImages" rows={5} {...form.register("galleryImages")} />
          </FormField>

          <div className="space-y-2">
            <label
              htmlFor="galleryUpload"
              className="block text-xs font-semibold uppercase tracking-widest text-muted"
            >
              Tải ảnh minh hoạ lên
            </label>
            <input
              id="galleryUpload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryUpload}
              disabled={uploading !== null}
              className="block w-full text-xs file:mr-3 file:rounded-sm file:border file:border-border-strong file:bg-surface-muted file:px-3 file:py-1.5 file:text-xs file:text-foreground"
            />
            <p className="text-xs text-muted">
              {uploading === "gallery" ? "Đang tải ảnh lên…" : "Có thể chọn nhiều ảnh cùng lúc."}
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
            {form.formState.isSubmitting ? "Đang lưu…" : post ? "Lưu thay đổi" : "Tạo bài viết"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onPreview}
            disabled={form.formState.isSubmitting}
          >
            Lưu &amp; xem trước
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.push("/admin/blog")}>
            Huỷ
          </Button>
        </div>
      </aside>
    </form>
  );
}
