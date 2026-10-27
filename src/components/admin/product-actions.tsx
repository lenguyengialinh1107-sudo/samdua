"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { archiveProductAction, restoreProductAction, updateStockAction } from "@/server/actions/admin-catalog.actions";

export function ArchiveProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  async function handleClick() {
    if (!window.confirm(`Ngừng bán "${name}"? Sản phẩm sẽ bị ẩn khỏi cửa hàng nhưng vẫn giữ lịch sử đơn hàng.`)) {
      return;
    }
    setPending(true);
    const result = await archiveProductAction(id);
    setPending(false);

    if (!result.ok) {
      toast.error("Không thể ngừng bán", { description: result.message });
      return;
    }
    toast.success("Đã ngừng bán sản phẩm");
    router.refresh();
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleClick} disabled={pending}>
      {pending ? "Đang xử lý…" : "Ngừng bán"}
    </Button>
  );
}

export function RestoreProductButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  async function handleClick() {
    setPending(true);
    const result = await restoreProductAction(id);
    setPending(false);

    if (!result.ok) {
      toast.error("Không thể khôi phục", { description: result.message });
      return;
    }
    toast.success("Đã khôi phục sản phẩm");
    router.refresh();
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleClick} disabled={pending}>
      {pending ? "Đang xử lý…" : "Khôi phục"}
    </Button>
  );
}

export function StockEditor({
  id,
  stockQuantity,
}: {
  id: string;
  stockQuantity: number;
}) {
  const router = useRouter();
  const [value, setValue] = React.useState(String(stockQuantity));
  const [pending, setPending] = React.useState(false);

  async function handleSave() {
    const next = Number.parseInt(value.replace(/[^\d]/g, ""), 10);
    if (!Number.isInteger(next) || next < 0) {
      toast.error("Tồn kho phải là số nguyên không âm");
      return;
    }
    if (next === stockQuantity) return;

    setPending(true);
    const result = await updateStockAction({ id, stockQuantity: next });
    setPending(false);

    if (!result.ok) {
      toast.error("Không thể cập nhật tồn kho", { description: result.message });
      return;
    }
    toast.success("Đã cập nhật tồn kho");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        inputMode="numeric"
        aria-label="Số lượng tồn kho"
        className="h-9 w-20"
      />
      <Button variant="outline" size="sm" onClick={handleSave} disabled={pending}>
        Lưu
      </Button>
    </div>
  );
}
