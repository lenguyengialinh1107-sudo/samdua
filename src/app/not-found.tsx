import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="ah-label">Lỗi 404</p>
      <h1 className="font-serif text-3xl">Không tìm thấy trang này</h1>
      <p className="max-w-md text-sm text-muted">
        Đường dẫn có thể đã thay đổi hoặc sản phẩm không còn được bán. Hãy quay lại cửa hàng để
        tiếp tục xem sản phẩm.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Button variant="accent" asChild>
          <Link href="/">Về trang chủ</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/products">Xem sản phẩm</Link>
        </Button>
      </div>
    </main>
  );
}
