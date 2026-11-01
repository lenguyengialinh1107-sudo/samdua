"use server";

import { revalidatePath } from "next/cache";

import type { BlogStatus } from "@/lib/blog/types";
import { blogPostFormSchema, type BlogPostFormValues } from "@/lib/validations/blog";
import { assertAdmin } from "@/server/auth-guard";
import {
  failure,
  toErrorMessage,
  zodFieldErrors,
  type ActionResult,
} from "@/server/actions/action-result";
import {
  createBlogPost,
  deleteBlogPost,
  updateBlogPost,
  updateBlogPostStatus,
} from "@/server/services/blog.service";

function revalidateBlog(slug?: string) {
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  revalidatePath("/");
  if (slug) revalidatePath(`/blog/${slug}`);
}

export async function saveBlogPostAction(input: {
  id?: string;
  values: BlogPostFormValues;
}): Promise<ActionResult<{ postId: string; slug: string }>> {
  await assertAdmin();

  const parsed = blogPostFormSchema.safeParse(input.values);
  if (!parsed.success) {
    return failure("Vui lòng kiểm tra lại thông tin bài viết.", zodFieldErrors(parsed.error));
  }

  try {
    const post = input.id
      ? await updateBlogPost(input.id, parsed.data)
      : await createBlogPost(parsed.data);

    if (!post) return failure("Không tìm thấy bài viết cần cập nhật.");

    revalidateBlog(post.slug);
    return { ok: true, postId: post.id, slug: post.slug };
  } catch (error) {
    return failure(toErrorMessage(error, "Không thể lưu bài viết."));
  }
}

export async function setBlogPostStatusAction(input: {
  id: string;
  status: BlogStatus;
}): Promise<ActionResult<{ slug: string }>> {
  await assertAdmin();

  try {
    const post = await updateBlogPostStatus(input.id, input.status);
    if (!post) return failure("Không tìm thấy bài viết.");

    revalidateBlog(post.slug);
    return { ok: true, slug: post.slug };
  } catch (error) {
    return failure(toErrorMessage(error, "Không thể đổi trạng thái bài viết."));
  }
}

export async function deleteBlogPostAction(id: string): Promise<ActionResult> {
  await assertAdmin();

  try {
    const removed = await deleteBlogPost(id);
    if (!removed) return failure("Không tìm thấy bài viết.");

    revalidateBlog();
    return { ok: true };
  } catch (error) {
    return failure(toErrorMessage(error, "Không thể xoá bài viết."));
  }
}
