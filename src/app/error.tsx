"use client";

import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Ghi log để tiện tra cứu khi triển khai thật (không hiển thị chi tiết cho người dùng).
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="ah-label">Đã xảy ra lỗi</p>
      <h1 className="font-serif text-3xl">Có gì đó không đúng</h1>
      <p className="max-w-md text-sm text-muted">
        Cửa hàng đang gặp sự cố khi tải nội dung này. Bạn thử tải lại trang, nếu vẫn tiếp diễn hãy
        liên hệ hotline để được hỗ trợ.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Button variant="accent" onClick={reset}>
          Thử lại
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Về trang chủ</Link>
        </Button>
      </div>
      {error.digest ? (
        <p className="font-mono text-xs text-muted">Mã lỗi: {error.digest}</p>
      ) : null}
    </main>
  );
}
