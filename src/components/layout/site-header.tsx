import { getSessionUser } from "@/server/auth-guard";

import { SiteHeaderNav } from "./site-header-nav";

/**
 * Header dùng dữ liệu session ở server để hiển thị đúng trạng thái đăng nhập.
 * Toàn bộ phần tương tác (tìm kiếm, giỏ hàng, menu) nằm trong component client.
 */
export async function SiteHeader() {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <SiteHeaderNav
        user={user ? { name: user.name, role: user.role } : null}
      />
    </header>
  );
}
