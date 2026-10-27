import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function SiteNotFound() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <EmptyState
        title="Không tìm thấy nội dung bạn đang tìm"
        description="Sản phẩm có thể đã được bán hoặc đường dẫn không còn tồn tại. Bạn thử xem các sản phẩm khác trong cửa hàng nhé."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="accent" asChild>
              <Link href="/products">Xem tất cả sản phẩm</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Về trang chủ</Link>
            </Button>
          </div>
        }
      />
    </div>
  );
}
