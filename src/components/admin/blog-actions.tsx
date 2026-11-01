"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { BlogStatus } from "@/lib/blog/types";
import {
  deleteBlogPostAction,
  setBlogPostStatusAction,
} from "@/server/actions/admin-blog.actions";

export function ToggleBlogStatusButton({
  id,
  status,
}: {
  id: string;
  status: BlogStatus;
}) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const next: BlogStatus = status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

  async function handleClick() {
    setPending(true);
    const result = await setBlogPostStatusAction({ id, status: next });
    setPending(false);

    if (!result.ok) {
      toast.error("Không thể đổi trạng thái", { description: result.message });
      return;
    }

    toast.success(next === "PUBLISHED" ? "Đã xuất bản bài viết" : "Đã chuyển về bản nháp");
    router.refresh();
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleClick} disabled={pending}>
      {pending ? "Đang xử lý…" : next === "PUBLISHED" ? "Xuất bản" : "Bản nháp"}
    </Button>
  );
}

export function DeleteBlogPostButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  async function handleClick() {
    if (!window.confirm(`Xoá bài viết "${title}"? Hành động này không thể hoàn tác.`)) {
      return;
    }

    setPending(true);
    const result = await deleteBlogPostAction(id);
    setPending(false);

    if (!result.ok) {
      toast.error("Không thể xoá bài viết", { description: result.message });
      return;
    }

    toast.success("Đã xoá bài viết");
    router.refresh();
  }

  return (
    <Button variant="ghost" size="sm" className="text-danger" onClick={handleClick} disabled={pending}>
      {pending ? "Đang xoá…" : "Xoá"}
    </Button>
  );
}
