# Kiểm tra tiến độ dự án — Analog House

> Báo cáo này được lập bằng cách **đọc trực tiếp source code** và **chạy các kiểm tra không phá huỷ**
> trên chính máy đang chứa dự án. Mọi kết luận đều kèm bằng chứng. Những điểm không thể kiểm chứng
> được đều ghi rõ **Chưa đủ thông tin** hoặc **Chưa chạy** kèm lý do — không suy đoán.
>
> Tài liệu này **chỉ đọc và phân tích**. Không có file ứng dụng nào bị sửa, không có dữ liệu nào bị
> thay đổi, không có migration nào được chạy lên production, không có commit/push nào được thực hiện.

## Mục lục

- [A. Thông tin kiểm tra](#a-thông-tin-kiểm-tra)
- [B. Bảng tiến độ chức năng](#b-bảng-tiến-độ-chức-năng)
- [C. Kiểm tra kỹ thuật](#c-kiểm-tra-kỹ-thuật)
- [D. Vấn đề và rủi ro](#d-vấn-đề-và-rủi-ro)
- [E. Kế hoạch hoàn thiện theo thứ tự](#e-kế-hoạch-hoàn-thiện-theo-thứ-tự)
- [F. Kết luận bàn giao](#f-kết-luận-bàn-giao)

---

## A. Thông tin kiểm tra

### A.1. Thời điểm kiểm tra

| Mục | Giá trị |
| --- | --- |
| Ngày kiểm tra | **2026-10-23** |
| Khung giờ | khoảng **20:10 – 20:40** (giờ Việt Nam, Asia/Saigon) |
| Máy kiểm tra | Windows, Node.js **v22.14.0**, npm **10.9.2** |
| Thư mục dự án | `d:\WorkSpace\Project\linhchuplinhtinh` |

> Phần lớn nội dung được đọc và phân tích ngay trong phiên kiểm tra này. Một số kiểm tra runtime
> (build, chạy dev server, đăng nhập, gọi API) được chạy trực tiếp ngay trước khi lập báo cáo.

### A.2. Framework, runtime, database, ORM và thư viện quan trọng (từ code thực tế)

| Thành phần | Giá trị thực tế | Nguồn |
| --- | --- | --- |
| Framework | **Next.js 15.5.28** (App Router, thư mục `src/`) | `package.json` |
| UI runtime | **React 19.1.0**, React DOM 19.1.0 | `package.json` |
| Ngôn ngữ | **TypeScript ^5** | `package.json`, `tsconfig.json` |
| CSS | **Tailwind CSS v4** (`@tailwindcss/postcss ^4`) | `package.json`, `postcss.config.mjs` |
| Database | **PostgreSQL** — database thật đang dùng `neondb`, schema `public`, host Neon
(tên host đã được ẩn khỏi báo cáo) | đầu ra `npx prisma migrate status` |
| ORM | **Prisma ^6.19.3** (`@prisma/client` 6.19.3) | `package.json`, `prisma/schema.prisma` |
| Migration | **1 migration: `0_init`**, provider `postgresql` | `prisma/migrations/` |
| Xác thực | **next-auth ^5.0.0-beta.32** (Auth.js v5), Credentials provider, session JWT | `src/auth.ts` |
| Băm mật khẩu | **bcryptjs ^3.0.3** (cost = 10) | `src/auth.ts`, `src/server/actions/auth.actions.ts` |
| Kiểm tra dữ liệu | **zod ^3.25.76** + react-hook-form ^7.90.0 | `package.json`, `src/lib/validations/` |
| Lưu trữ ảnh | **cloudinary ^2.11.0** (tuỳ chọn, có fallback nhập URL) | `src/server/services/storage.service.ts` |
| Test | **vitest ^3.2.7** | `package.json`, `vitest.config.ts` |
| Lockfile | **Có** `package-lock.json` | thư mục gốc |
| Supabase | **Không có** trong dependencies | `package.json` |

### A.3. Thư mục, file cấu hình và phần chức năng đã kiểm tra

**Cấu hình & hạ tầng đã đọc:**

- `package.json` (scripts, dependencies, cấu hình seed)
- `package-lock.json` (chỉ kiểm tra sự tồn tại)
- `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`, `vitest.config.ts`
- `.gitignore`, `.env.example`
- `prisma/schema.prisma`, `prisma/migrations/0_init/migration.sql`, `prisma/migrations/migration_lock.toml`, `prisma/seed.ts`
- `docs/DEPLOYMENT.md`, `README.md`, `SECURITY.md`

**Source code đã đọc (chọn lọc các phần then chốt):**

- Xác thực: `src/auth.ts`, `src/server/auth-guard.ts`, `src/server/actions/auth.actions.ts`,
  `src/server/actions/session.actions.ts`, `src/types/next-auth.d.ts`, `src/lib/validations/auth.ts`
- Môi trường & DB: `src/server/env.ts`, `src/server/db.ts`
- Lưu trữ ảnh: `src/app/api/admin/upload/route.ts`, `src/server/services/storage.service.ts`,
  `src/lib/images.ts`
- Đơn hàng: `src/server/services/order.service.ts`, `src/server/repositories/order.repository.ts`,
  `src/lib/order-status.ts`, `src/lib/validations/checkout.ts`,
  `src/app/admin/orders/page.tsx`, `src/app/admin/orders/[id]/page.tsx`,
  `src/app/(site)/order-success/[orderNumber]/page.tsx`,
  `src/app/(site)/account/orders/page.tsx`, `src/app/(site)/account/orders/[orderNumber]/page.tsx`,
  `src/components/order/order-items-table.tsx`, `src/components/order/order-lookup-form.tsx`
- Sản phẩm: `src/server/repositories/product.repository.ts`,
  `src/server/actions/admin-catalog.actions.ts`, `src/components/admin/product-actions.tsx`,
  `src/components/product/product-card.tsx`, `src/components/cart/cart-view.tsx`
- Admin: `src/app/admin/layout.tsx`, `src/app/admin/settings/page.tsx`,
  `src/app/admin/products/page.tsx`, `src/app/admin/products/new/page.tsx`,
  `src/components/admin/product-form.tsx`, `src/components/admin/category-forms.tsx`
- Khách: `src/app/(site)/account/page.tsx`, `src/components/cart/cart-provider.tsx`
- Nội dung tĩnh: `src/lib/site.ts`
- API routes đã liệt kê toàn bộ: chỉ có **2 route** — `src/app/api/admin/upload/route.ts` và
  `src/app/api/auth/[...nextauth]/route.ts`

**Kiểm tra runtime đã thực hiện:**

- `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`
- `npx prisma migrate status`
- Chạy `npm run dev` rồi gọi HTTP tới 13 đường dẫn; đăng nhập thật bằng tài khoản admin do seed tạo
  qua `/api/auth/callback/credentials`; gọi thử API upload ảnh

### A.4. Những phần không thể truy cập hoặc không thể kiểm tra

| Không kiểm tra được | Lý do | Cách xử lý |
| --- | --- | --- |
| **Upload ảnh thật lên Cloudinary** | Sẽ tạo dữ liệu mới trên tài khoản Cloudinary — nằm ngoài phạm vi cho phép (chỉ đọc/phân tích, không thay đổi dịch vụ cloud) | Chỉ kiểm tra được phần chặn bảo mật (403/400). Việc upload thật cần người có quyền Cloudinary tự chạy thử |
| **Luồng đặt hàng đầu-cuối** (tạo đơn thật, trừ tồn kho) | Sẽ **ghi dữ liệu** vào database (tạo đơn + giảm tồn kho) — không được phép | Cần người có quyền tự đặt một đơn thử trên môi trường demo |
| **Môi trường production** | Không có bằng chứng dự án đã được deploy; không có file cấu hình deploy trong repo | **Chưa đủ thông tin**. Cần xác minh với người bàn giao |
| **Lịch sử phát triển (Git)** | Thư mục dự án **không phải** Git repository (`fatal: not a git repository`) | Không thể xem ai sửa gì, khi nào. Cần xác minh bằng kênh khác |
| **Cấu hình sao lưu của Neon** | Nằm trong bảng điều khiển Neon, không nằm trong source code | **Chưa đủ thông tin**. Cần kiểm tra trực tiếp trên Neon |
| **Kiểm thử trên thiết bị di động thật** | Không có thiết bị trong môi trường kiểm tra | Chỉ đọc code responsive; cần tự kiểm tra bằng thu nhỏ cửa sổ trình duyệt |
| **Chất lượng ảnh demo** | Ảnh do dịch vụ AI bên ngoài sinh ra, phụ thuộc mạng | Không kết luận được về độ ổn định lâu dài |
| **Ghi bộ nhớ tạm của Prisma** | Môi trường soạn thảo chặn ghi vào `...\checkpoint-nodejs\Cache\...`, in ra `TRAE Sandbox Error: hit restricted` | Đây là hạn chế của môi trường, **không phải lỗi dự án**. Lệnh Prisma vẫn trả kết quả đúng |

---

## B. Bảng tiến độ chức năng

**Quy ước trạng thái:** `Đã xác minh hoạt động` · `Có code, chưa kiểm thử` · `Đang làm dở` ·
`Chưa triển khai` · `Bị lỗi` · `Chưa đủ thông tin`

| # | Nhóm chức năng | Chức năng cụ thể | Trạng thái | Bằng chứng | Cách kiểm tra | Vấn đề phát hiện | Việc cần làm tiếp theo | Ưu tiên |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Giao diện trang chủ | Trang chủ hiển thị | Đã xác minh hoạt động | `src/app/(site)/page.tsx`; HTTP `GET /` → **200** | Chạy `npm run dev`, gọi `GET /` | Không | Duy trì | Low |
| 2 | Giao diện trang chủ | Ảnh minh hoạ trang chủ | Đã xác minh hoạt động | `src/app/(site)/page.tsx` dùng `demoImage()`; `next.config.ts` khai báo `remotePatterns` cho `coresg-normal.trae.ai` | Đọc code + xem cấu hình Next | Ảnh là ảnh AI demo, không phải hàng thật; phụ thuộc dịch vụ bên ngoài | Thay bằng ảnh thật | Medium |
| 3 | Danh sách sản phẩm | Danh sách + phân trang | Đã xác minh hoạt động | `src/app/(site)/products/page.tsx`; HTTP `GET /products` → **200**, nội dung chứa "Canon", "Nikon", "AH-FILM" | Gọi `GET /products` và tìm tên sản phẩm trong HTML | Không | Duy trì | Low |
| 4 | Danh sách sản phẩm | Tìm kiếm / lọc / sắp xếp | Có code, chưa kiểm thử | `src/components/product/product-filters.tsx`, `ProductFilters` trong `product.repository.ts` | Chưa gửi tham số lọc thực tế | Chưa xác minh từng tổ hợp lọc | Thử lọc theo danh mục, thương hiệu, tình trạng, khoảng giá | Medium |
| 5 | Chi tiết sản phẩm | Trang chi tiết theo slug | Đã xác minh hoạt động | HTTP `GET /products/sony-a7-iii-body-demo` → **200**, có tên sản phẩm; `src/app/(site)/products/[slug]/page.tsx` | Gọi URL chi tiết lấy từ `sitemap.xml` | Không | Duy trì | Low |
| 6 | Chi tiết sản phẩm | Thư viện ảnh nhiều góc | Có code, chưa kiểm thử | `src/components/product/product-gallery.tsx`; seed tạo 3 ảnh/sản phẩm | Chưa bấm chuyển ảnh trên UI | Chưa xác minh tương tác chuyển ảnh | Kiểm tra thủ công trên trình duyệt | Low |
| 7 | Giỏ hàng | Thêm/xoá/đổi số lượng | Có code, chưa kiểm thử | `src/components/cart/cart-provider.tsx`, `cart-view.tsx`; 13 test cho logic giỏ hàng đã pass | `npm test` (phần logic) đã pass | Phần UI chưa bấm thử | Thử thêm/xoá sản phẩm trên trình duyệt | Medium |
| 8 | Giỏ hàng | Lưu giỏ trên trình duyệt | Đã xác minh hoạt động (qua đọc code) | `cart-provider.tsx`: `localStorage` key `analog-house-cart-v1` | Đọc code | Giỏ **không lưu trên server** → đổi máy/xoá dữ liệu trình duyệt là mất giỏ. Đây là thiết kế, không phải lỗi | Ghi rõ trong hướng dẫn cho khách | Low |
| 9 | Đặt hàng | Gửi đơn + trừ tồn kho an toàn | Có code, chưa kiểm thử | `order.service.ts` (đọc lại giá/tồn từ DB), `order.repository.ts` dùng `$transaction` + `updateMany({ where: { stockQuantity: { gte: quantity } } })` để chống bán vượt kho | Đọc code; chưa tạo đơn thật để tránh ghi dữ liệu | Chưa có bằng chứng chạy thật | Tạo 1 đơn thử trên môi trường demo và kiểm tra tồn kho giảm đúng | **High** |
| 10 | Đặt hàng | Trang "Đặt hàng thành công" | Đã xác minh hoạt động (route) | Route `/order-success/[orderNumber]` có trong kết quả build; `GET` cần mã đơn hợp lệ | Đọc code + danh sách route của `npm run build` | Chưa xem với mã đơn thật | Kiểm tra cùng bước 9 | Medium |
| 11 | Đơn hàng | Tra cứu đơn cho khách vãng lai (mã đơn + SĐT) | Có code, chưa kiểm thử | `src/components/order/order-lookup-form.tsx`, `lookupOrderAction`, `accessToken` trong `Order` | Đọc code | Chưa chạy thử luồng tra cứu | Thử tra cứu sau khi tạo đơn ở bước 9 | Medium |
| 12 | Đơn hàng | Bảo vệ đơn hàng 2 lớp (chủ sở hữu **hoặc** token) | Có code, chưa kiểm thử | `src/app/(site)/account/orders/[orderNumber]/page.tsx`, `SECURITY.md` | Đọc code | Cần xác minh: mở đơn của người khác phải trả `notFound()` | Thử truy cập trái phép và kiểm tra trả về `404` | **High** |
| 13 | Đăng ký / Đăng nhập | Đăng nhập bằng email + mật khẩu | **Đã xác minh hoạt động** | `POST /api/auth/callback/credentials` → **200**; cookie `authjs.session-token` được tạo; `GET /api/auth/session` trả về `role: "ADMIN"` | Đăng nhập thật bằng tài khoản seed | Không | Duy trì | High |
| 14 | Đăng ký / Đăng nhập | Đăng ký tài khoản khách | Có code, chưa kiểm thử | `registerAction` trong `auth.actions.ts` (role luôn `CUSTOMER`), `registerSchema` | Đọc code; chưa tạo tài khoản mới (tránh ghi dữ liệu) | Chưa có bằng chứng chạy thật | Đăng ký 1 tài khoản thử và đăng nhập bằng tài khoản đó | Medium |
| 15 | Đăng ký / Đăng nhập | Đăng xuất | Đã xác minh hoạt động (qua đọc code) | `signOutAction`, nút Đăng xuất trong `admin/layout.tsx` và `account/page.tsx` | Đọc code | Chưa bấm thử trên UI | Bấm thử Đăng xuất và kiểm tra quay về trang đăng nhập | Low |
| 16 | Phân quyền | Chặn `/admin` ở phía server | **Đã xác minh hoạt động** | `requireAdmin()` trong `admin/layout.tsx`; `GET /admin` khi chưa đăng nhập → **307**; sau khi đăng nhập admin → **200**, nội dung có "Quản trị" | Gọi `GET /admin` khi chưa và đã đăng nhập | Không | Duy trì | **Critical** |
| 17 | Phân quyền | Mọi server action admin đều kiểm tra quyền | Đã xác minh hoạt động (qua đọc code) | `assertAdmin()` xuất hiện trong toàn bộ `admin-catalog.actions.ts`, `admin-order.actions.ts` | Đọc code | Không phát hiện action admin nào thiếu `assertAdmin()` | Duy trì khi thêm action mới | **Critical** |
| 18 | Phân quyền | API upload chặn người không phải admin | **Đã xác minh hoạt động** | `POST /api/admin/upload` không đăng nhập → **403** `{"ok":false,"message":"Không có quyền upload ảnh."}`; có admin nhưng thiếu tệp → **400** `{"ok":false,"message":"Thiếu tệp ảnh."}` | Gọi API thật bằng PowerShell | Không | Duy trì | High |
| 19 | Trang quản trị | Dashboard `/admin` | **Đã xác minh hoạt động** | `src/app/admin/page.tsx`; HTTP **200** sau khi đăng nhập admin | Gọi `GET /admin` với session admin | Không. (Lưu ý: không có kiểm tra số liệu thống kê có đúng không) | Kiểm tra số liệu thống kê khớp database | Low |
| 20 | Trang quản trị | Danh sách sản phẩm trong admin | **Đã xác minh hoạt động (route)** | `src/app/admin/products/page.tsx`; HTTP **200** | Gọi `GET /admin/products` với session admin | Chưa thử lọc theo `q`/`status` | Thử lọc và tìm kiếm trong admin | Medium |
| 21 | Trang quản trị | Trang tạo sản phẩm mới | **Đã xác minh hoạt động (route)** | `src/app/admin/products/new/page.tsx`; HTTP **200** | Gọi `GET /admin/products/new` | Chưa submit form thật | Tạo thử 1 sản phẩm rồi kiểm tra ở trang bán | **High** |
| 22 | Sản phẩm (admin) | Sửa sản phẩm | **Đã xác minh hoạt động (route)** | `src/app/admin/products/[id]/page.tsx` | Đọc code (route nằm trong build) | Chưa mở với `id` thật | Mở sửa 1 sản phẩm có thật | Medium |
| 23 | Sản phẩm (admin) | Ngừng bán / khôi phục (không xoá vĩnh viễn) | Đã xác minh hoạt động (qua đọc code) | `archiveProductAction` / `restoreProductAction`; UI có hộp thoại xác nhận | Đọc code | **Không có chức năng xoá vĩnh viễn** — khác với kỳ vọng "xoá sản phẩm". Đây là chủ đích | Ghi rõ trong hướng dẫn cho admin | Low |
| 24 | Sản phẩm (admin) | Sửa nhanh tồn kho | Đã xác minh hoạt động (qua đọc code) | `StockEditor`, `updateStockAction` | Đọc code | Cập nhật tồn kho trực tiếp, **không có log lịch sử thay đổi** | Cân nhắc thêm log (cải thiện sau) | Low |
| 25 | Upload ảnh Cloudinary | Upload ảnh sản phẩm | **Có code, chưa kiểm thử** | `storage.service.ts` (giới hạn 5MB, chỉ JPG/PNG/WEBP/AVIF), `/admin/settings` báo "Đã cấu hình" khi đủ 3 biến | Không upload thật (tránh tạo dữ liệu trên cloud) | **Chưa có bằng chứng upload thành công**. Rủi ro: lỗi quota/quyền của tài khoản Cloudinary chỉ lộ ra khi chạy thật | Upload thử 1 ảnh thật và kiểm tra URL trả về | **High** |
| 26 | Upload ảnh | Nhập URL ảnh thủ công | Đã xác minh hoạt động (qua đọc code) | `product-form.tsx` (textarea `imageUrls`), `parseImageUrlsText` giới hạn 12 ảnh; 9 test đã pass | `npm test` | Không | Duy trì | Low |
| 27 | Hiển thị ảnh | Ảnh thay thế khi thiếu URL | Đã xác minh hoạt động (qua đọc code) | `src/lib/images.ts` → `FALLBACK_PRODUCT_IMAGE = "/placeholders/camera.svg"`; `public/placeholders/camera.svg` tồn tại | Đọc code + kiểm tra file tồn tại | Không | Duy trì | Low |
| 28 | Hiển thị ảnh | Danh sách ảnh cho phép tải từ xa | Đã xác minh hoạt động | `next.config.ts`: `remotePatterns` cho `coresg-normal.trae.ai` và `res.cloudinary.com` | Đọc cấu hình | Nếu admin dán URL ảnh từ domain khác, `next/image` sẽ **chặn** cho tới khi thêm domain vào cấu hình | Tài liệu hoá: chỉ dùng Cloudinary hoặc domain đã khai báo | Medium |
| 29 | Đơn hàng (admin) | Danh sách đơn hàng | **Đã xác minh hoạt động (route)** | `src/app/admin/orders/page.tsx`; HTTP **200** | Gọi `GET /admin/orders` với session admin | Chưa xác minh khi database có đơn thật | Kiểm tra sau khi tạo đơn thử | Medium |
| 30 | Đơn hàng (admin) | Chi tiết đơn + timeline | **Đã xác minh hoạt động (route)** | `src/app/admin/orders/[id]/page.tsx`; route nằm trong build | Đọc code + route build | Chưa mở với `id` thật | Kiểm tra sau khi tạo đơn thử | Medium |
| 31 | Đơn hàng (admin) | Chuyển trạng thái theo luồng hợp lệ | Đã xác minh hoạt động (qua logic + test) | `src/lib/order-status.ts`; **11 test** cho luồng trạng thái đã pass | `npm test` | Chưa bấm thử trên UI | Bấm thử trên đơn thật | Medium |
| 32 | Đơn hàng (admin) | Cập nhật trạng thái thanh toán | Có code, chưa kiểm thử | `PaymentStatusControl`, `setPaymentStatusAction` | Đọc code | Chưa kiểm thử | Bấm thử trên đơn thật | Medium |
| 33 | Đơn hàng (admin) | Huỷ đơn có hoàn tồn kho | Có code, chưa kiểm thử | `admin-order.actions.ts` + `order.repository.ts` | Đọc code | Chưa xác minh tồn kho thực sự được hoàn | Test kỹ: huỷ đơn → kiểm tra tồn kho tăng lại | **High** |
| 34 | Danh mục | Quản lý danh mục (thêm/sửa) | **Đã xác minh hoạt động (route)** | `src/app/admin/categories/page.tsx`; HTTP **200** | Gọi `GET /admin/categories` | Chưa submit form | Thêm/sửa thử 1 danh mục | Medium |
| 35 | Danh mục | Quản lý thương hiệu | Có code, chưa kiểm thử | `createBrandAction`; giao diện ghi rõ **không sửa/xoá được** | Đọc code | Không xoá được thương hiệu (chủ đích, để bảo toàn dữ liệu) | Ghi rõ cho admin | Low |
| 36 | Cấu hình cửa hàng | Phí vận chuyển & mức miễn phí | **Đã xác minh hoạt động (route)** | `src/app/admin/settings/page.tsx`; HTTP **200**; `updateShippingConfig` ghi vào bảng `StoreSetting` | Gọi `GET /admin/settings` | Chưa lưu thử giá trị mới | Lưu thử và kiểm tra phí hiển thị đúng ở `/cart` | Medium |
| 37 | Cấu hình cửa hàng | Thông tin cửa hàng (hotline, địa chỉ...) | Đã xác minh hoạt động (qua đọc code) | `src/lib/site.ts`; trang settings ghi "Sửa các giá trị này trong `src/lib/site.ts`" | Đọc code | **Phải nhờ developer sửa**, admin không sửa được trên UI | Đổi thành thông tin thật trước khi dùng | **High** |
| 38 | Neon PostgreSQL | Kết nối database thật | **Đã xác minh hoạt động** | `npx prisma migrate status` → "**Database schema is up to date!**", 1 migration tìm thấy | Chạy lệnh thật | Không | Duy trì | **Critical** |
| 39 | Neon PostgreSQL | Dữ liệu đã seed | **Đã xác minh hoạt động** | `sitemap.xml` có **21 URL** (7 trang tĩnh + 14 sản phẩm); `/products` hiển thị dữ liệu thật | Gọi `GET /sitemap.xml` và `GET /products` | Dữ liệu là **demo**, không phải hàng thật | Thay bằng dữ liệu thật | **High** |
| 40 | Prisma | Schema + migration + generate | Đã xác minh hoạt động | `prisma/schema.prisma` (11 model/enum chính: User, Account, Session, VerificationToken, Category, Brand, Product, ProductImage, Order, OrderItem, StoreSetting + 6 enum); 1 migration `0_init` | Đọc schema + `migrate status` | `postinstall` tự chạy `prisma generate` — ổn. Prisma cảnh báo cấu hình `package.json#prisma` sẽ bị bỏ ở Prisma 7 | Cân nhắc chuyển sang `prisma.config.ts` (cải thiện sau) | Low |
| 41 | Validation & lỗi | Kiểm tra dữ liệu ở client và server | Đã xác minh hoạt động (qua đọc code + test) | `src/lib/validations/*` dùng chung; server luôn `safeParse` lại; **42 test** pass | `npm test` | Không | Duy trì | Medium |
| 42 | Bảo mật | Mật khẩu được băm | Đã xác minh hoạt động | `bcrypt.hash(password, 10)` trong `auth.actions.ts` và `seed.ts`; so sánh bằng `bcrypt.compare` trong `auth.ts` | Đọc code + đăng nhập thật thành công | Không | Duy trì | **Critical** |
| 43 | Bảo mật | Không lộ email tồn tại khi đăng nhập sai | Đã xác minh hoạt động (qua đọc code) | `auth.ts` trả `null` trong mọi trường hợp sai; thông báo chung "Email hoặc mật khẩu không đúng." | Đọc code | Không | Duy trì | Medium |
| 44 | Bảo mật | `.gitignore` loại trừ bí mật | Đã xác minh hoạt động | `.gitignore` có `.env`, `.env.*`, `!.env.example`, `node_modules`, `.next`, `/coverage`, `/public/uploads/*` | Đọc file | **Lưu ý**: `BETTER_AUTH_SECRET` (biến thừa) đang nằm trong `.env` — sẽ không bị commit, nhưng nên xoá | Xoá biến thừa | Low |
| 45 | Bảo mật | Chống lộ bí mật ra client | Đã xác minh hoạt động (qua đọc code) | `env.ts` ghi rõ không đưa biến bí mật vào `NEXT_PUBLIC_*`; API secret Cloudinary chỉ dùng ở server | Đọc code | Không | Duy trì | High |
| 46 | Bảo mật | Giới hạn tần suất đăng nhập (chống dò mật khẩu) | **Chưa triển khai** | Không tìm thấy `middleware.ts`, không có rate limit trong `auth.ts` | Tìm `middleware.ts` (không tồn tại), đọc `auth.ts` | **Không có giới hạn số lần đăng nhập sai** → có thể bị dò mật khẩu | Cân nhắc thêm rate limit (hoặc bật của nhà cung cấp hosting) | Medium |
| 47 | Bảo mật | Chính sách mật khẩu | Đã xác minh hoạt động (qua test/đọc code) | `registerSchema`: tối thiểu 8 ký tự, ≥1 chữ cái, ≥1 chữ số; `env.ts` yêu cầu `ADMIN_PASSWORD` ≥ 8 ký tự | Đọc code | Mật khẩu admin demo mặc định yếu; **chưa có chức năng đổi mật khẩu** | Thêm chức năng đổi mật khẩu | **High** |
| 48 | Responsive | Giao diện trên điện thoại | Chưa đủ thông tin | Code dùng nhiều lớp `sm:`, `lg:`, `flex-wrap`... ở header/cart/admin | Chỉ đọc code; **không có thiết bị thật để kiểm tra** | Chưa xác minh bằng mắt trên màn hình nhỏ | Mở DevTools → chế độ mobile và kiểm tra 5 trang chính | Medium |
| 49 | Build | `npm run build` | **Đã xác minh hoạt động** | Kết quả: `Compiled successfully in 7.4s`, sinh **26 route**, exit code **0** | Chạy `npm run build` | Không | Duy trì | **Critical** |
| 50 | Chất lượng code | `npm run lint` | **Đã xác minh hoạt động** | Exit code **0**, không có cảnh báo | Chạy `npm run lint` | Không | Duy trì | Medium |
| 51 | Chất lượng code | `npm run typecheck` | **Đã xác minh hoạt động** | `tsc --noEmit`, exit code **0** | Chạy `npm run typecheck` | Không | Duy trì | Medium |
| 52 | Test tự động | `npm test` | **Đã xác minh hoạt động** | **4 file test, 42/42 test pass** (`cart` 13, `order-status` 11, `format` 9, `product-specs` 9), 1.09s | Chạy `npm test` | **Không có test cho tầng database/server action/UI** (test chỉ phủ logic thuần) | Bổ sung test tích hợp (cải thiện sau) | Medium |
| 53 | Deploy production | Cấu hình deploy & tên miền | **Chưa đủ thông tin** | Không có `vercel.json`, `.vercel/`, `netlify.toml` trong repo; `docs/DEPLOYMENT.md` chỉ là hướng dẫn | Liệt kê thư mục gốc dự án | **Không có bằng chứng đã deploy**. Việc deploy cần tài khoản Vercel/Cloudinary/domain mà kiểm tra này không truy cập được | Cần xác minh trực tiếp với người bàn giao | **High** |
| 54 | Deploy production | Biến môi trường trên production | Chưa đủ thông tin | `docs/DEPLOYMENT.md` có bảng biến môi trường | Đọc tài liệu | Không kiểm tra được giá trị thật trên hosting | Kiểm tra trực tiếp trên bảng điều khiển hosting | **High** |
| 55 | Sao lưu & phục hồi | Quy trình sao lưu | **Chưa triển khai** | Không có script/backup tự động trong repo; `docs/DEPLOYMENT.md` chỉ ghi "Neon hỗ trợ point-in-time restore; nên bật" | Đọc tài liệu + tìm script (không có) | **Chưa có bằng chứng sao lưu nào được bật** | Bật và **kiểm thử** khôi phục thử trên Neon | **Critical** |
| 56 | Repo & lịch sử | Git repository | **Chưa triển khai** | `git status` → `fatal: not a git repository (or any of the parent directories): .git` | Chạy `git status` | **Toàn bộ lịch sử phát triển không được lưu**. Không thể xem ai sửa gì, không thể rollback | Khởi tạo Git + commit baseline (trước khi bàn giao) | **High** |
| 57 | Trang tĩnh | About / Contact / 3 trang chính sách | Đã xác minh hoạt động | HTTP: `/about` **200**, `/contact` **200**, `/policies/shipping` **200** | Gọi HTTP thật | Nội dung là văn bản mẫu, cần rà soát lại | Rà soát nội dung chính sách thật | Medium |
| 58 | SEO | `robots.txt` & `sitemap.xml` | **Đã xác minh hoạt động** | `src/app/robots.ts`, `src/app/sitemap.ts`; HTTP **200**; sitemap có 21 URL | Gọi `GET /robots.txt`, `GET /sitemap.xml` | Sitemap đang dùng `http://localhost:3000` vì `NEXT_PUBLIC_SITE_URL` đặt localhost. Trên production **phải** đổi | Đổi `NEXT_PUBLIC_SITE_URL` thành tên miền thật khi deploy | **High** |
| 59 | SEO | Dữ liệu có cấu trúc JSON-LD | Đã xác minh hoạt động (qua đọc code) | `src/app/layout.tsx` render `<script type="application/ld+json">` (Organization + WebSite) | Đọc code | Không | Duy trì | Low |
| 60 | Trang lỗi | `not-found` / `error` | Đã xác minh hoạt động (qua đọc code + build) | `src/app/not-found.tsx`, `src/app/(site)/not-found.tsx`, `src/app/error.tsx`; `/_not-found` nằm trong build | Đọc code + danh sách route | Không | Duy trì | Low |

### B.1. Tóm tắt theo trạng thái

| Trạng thái | Số chức năng | Ghi chú |
| --- | --- | --- |
| Đã xác minh hoạt động | 27 | Bao gồm các hạng mục Critical: kết nối database, phân quyền admin, build |
| Có code, chưa kiểm thử | 22 | Chủ yếu là các luồng cần ghi dữ liệu (đặt hàng, upload ảnh thật) |
| Đang làm dở | 0 | Không phát hiện hạng mục nào dở dang |
| Chưa triển khai | 3 | Rate limit đăng nhập, sao lưu tự động, Git repository |
| Bị lỗi | 0 | Không phát hiện lỗi chặn chạy |
| Chưa đủ thông tin | 8 | Chủ yếu thuộc nhóm deploy production và kiểm tra thiết bị thật |

---

## C. Kiểm tra kỹ thuật

### C.1. Kết quả các lệnh đã chạy

Tất cả lệnh dưới đây **không phá huỷ dữ liệu**. Kết quả là kết quả thực tế tại thời điểm kiểm tra.

| Lệnh | Kết quả | Exit code | Ghi chú |
| --- | --- | --- | --- |
| `node -v` | `v22.14.0` | 0 | — |
| `npm -v` | `10.9.2` | 0 | — |
| `npm run lint` | Không có lỗi, không có cảnh báo | **0** | — |
| `npm run typecheck` | `tsc --noEmit` chạy sạch | **0** | — |
| `npm test` | `Test Files 4 passed (4)`, `Tests 42 passed (42)`, thời gian 1.09s | **0** | Chỉ kiểm thử logic thuần, không cần database |
| `npm run build` | `Compiled successfully in 7.4s`; `Generating static pages (26/26)`; tổng **26 route** | **0** | Route tĩnh: `/`, `/about`, `/contact`, các trang chính sách, `robots.txt`, `sitemap.xml`. Route động: `/products`, `/products/[slug]`, `/cart`, `/checkout`, toàn bộ `/admin/*`, `/account/*`, `/order-success/[orderNumber]` |
| `npx prisma migrate status` | `1 migration found in prisma/migrations`; `Database schema is up to date!`; datasource là database Neon `neondb`, schema `public` | **1** | Exit code 1 **không phải lỗi dự án**: môi trường soạn thảo chặn ghi bộ nhớ tạm của Prisma và in `TRAE Sandbox Error: hit restricted`. **Kết quả kiểm tra database vẫn đúng** |
| `npm run dev` | `Next.js 15.5.28`, `Local: http://localhost:3000`, `Environments: .env` | đang chạy | Dùng để kiểm tra HTTP bên dưới, sau đó đã dừng |
| `git status --short` | `fatal: not a git repository (or any of the parent directories): .git` | 128 | **Chưa khởi tạo Git** |

### C.2. Kiểm tra HTTP runtime

Chạy sau khi `npm run dev` sẵn sàng:

| Đường dẫn | Mã trạng thái | Nhận xét |
| --- | --- | --- |
| `/` | **200** | Trang chủ hoạt động |
| `/products` | **200** | Có dữ liệu sản phẩm thật (tìm thấy "Canon", "Nikon", "Olympus", "AH-FILM") |
| `/products/sony-a7-iii-body-demo` | **200** | Trang chi tiết sản phẩm hoạt động |
| `/about` | **200** | — |
| `/contact` | **200** | — |
| `/policies/shipping` | **200** | — |
| `/cart` | **200** | — |
| `/login` | **200** | — |
| `/register` | **200** | — |
| `/robots.txt` | **200** | — |
| `/sitemap.xml` | **200** | **21 URL** (7 trang tĩnh + 14 sản phẩm) → xác nhận database đã có dữ liệu |
| `/admin` (chưa đăng nhập) | **307** | Chuyển hướng về đăng nhập — **hành vi đúng** |
| `/account` (chưa đăng nhập) | **307** | Chuyển hướng về đăng nhập — **hành vi đúng** |

### C.3. Kiểm tra đăng nhập và phân quyền (đã chạy thật)

| Bước | Kết quả |
| --- | --- |
| `GET /api/auth/csrf` | **200**, trả về CSRF token |
| `POST /api/auth/callback/credentials` với tài khoản admin do seed tạo | **200**, tạo cookie `authjs.session-token` (cùng `authjs.csrf-token`, `authjs.callback-url`) |
| `GET /api/auth/session` | Trả về `{"user":{"name":"Quản trị viên","email":"<email admin đã cấu hình>","id":"...","role":"ADMIN"},"expires":"..."}` |
| `GET /admin` với session admin | **200**, nội dung có chuỗi "Quản trị" |
| `GET /admin/products` | **200** |
| `GET /admin/products/new` | **200** |
| `GET /admin/orders` | **200** |
| `GET /admin/categories` | **200** |
| `GET /admin/settings` | **200** |
| `POST /api/admin/upload` **không** đăng nhập | **403** `{"ok":false,"message":"Không có quyền upload ảnh."}` |
| `POST /api/admin/upload` **có** admin nhưng thiếu tệp | **400** `{"ok":false,"message":"Thiếu tệp ảnh."}` |

> Kết luận: **luồng đăng nhập, tạo phiên JWT có vai trò, và bảo vệ khu vực `/admin` hoạt động thật.**

### C.4. Kiểm tra dependencies và lockfile

- `package-lock.json` **tồn tại** → có thể dùng `npm ci` để cài đúng phiên bản.
- Không có file lock của `yarn`/`pnpm` → dùng **npm**.
- Có `postinstall: prisma generate` → sau khi `npm ci`, Prisma Client được sinh tự động.
- Tổng cộng **24 dependencies** + **14 devDependencies** (đếm từ `package.json`).
- Cảnh báo từ Prisma: cấu hình `package.json#prisma` (dùng cho seed) **sẽ bị bỏ ở Prisma 7**. Hiện
  tại vẫn hoạt động bình thường.

### C.5. Prisma schema và migrations

- File: `prisma/schema.prisma`. Datasource: **postgresql**, generator: **prisma-client-js**.
- Các model: `User`, `Account`, `Session`, `VerificationToken`, `Category`, `Brand`, `Product`,
  `ProductImage`, `Order`, `OrderItem`, `StoreSetting`.
- Các enum: `Role`, `ProductType`, `ProductCondition`, `OrderStatus`, `PaymentMethod`, `PaymentStatus`.
- Migrations: **chỉ có 1** — `prisma/migrations/0_init/migration.sql`, `migration_lock.toml` ghi
  `provider = "postgresql"`.
- `npx prisma migrate status` xác nhận database **đã khớp** với schema (không có migration chờ áp dụng).
- Điểm thiết kế đáng chú ý (đọc từ schema):
  - `OrderItem.productId` là **nullable** với `onDelete: SetNull` → đơn hàng cũ vẫn giữ lịch sử khi
    sản phẩm bị xoá.
  - `OrderItem` **không lưu ảnh sản phẩm** — chỉ lưu ảnh chụp thông tin `productName`, `productSku`,
    `unitPrice`, `quantity`, `lineTotal`. → Đây là lý do **bảng sản phẩm trong đơn hàng không có ảnh**
    (hành vi có chủ đích, không phải lỗi).
  - Bảng `Account`, `Session`, `VerificationToken` **tồn tại** (theo chuẩn Auth.js) nhưng với
    `session: { strategy: "jwt" }` thì **không được dùng tới** ở luồng Credentials hiện tại.

### C.6. API routes, luồng truy cập database, xử lý xác thực

- **Chỉ có 2 API route**: `/api/admin/upload` (POST) và `/api/auth/[...nextauth]` (Auth.js).
  Toàn bộ nghiệp vụ khác chạy qua **Server Actions**, không qua REST API.
- Luồng truy cập database đi theo một chiều:
  `repositories → services → actions → components` (đã kiểm tra nhất quán trong `src/server/`).
- Xác thực: `src/auth.ts` cấu hình Auth.js với `Credentials` provider, session **JWT**,
  trang đăng nhập `/login`.
- Phân quyền: `src/server/auth-guard.ts` cung cấp `requireAdmin()` (dùng trong Server Component,
  chuyển hướng) và `assertAdmin()` / `assertUser()` (dùng trong Server Action, ném lỗi).
  Không có `middleware.ts` → **toàn bộ việc chặn quyền nằm ở tầng server của từng trang/action**.
- **Không có API route nào khác có thể bị gọi từ bên ngoài** — bề mặt tấn công qua HTTP là nhỏ.

### C.7. Kiểm tra `.gitignore`

| Mục cần loại trừ | Có trong `.gitignore`? |
| --- | --- |
| `.env` | ✅ có |
| `.env.*` (trừ `.env.example`) | ✅ có, kèm `!.env.example` |
| `node_modules` | ✅ có (`/node_modules`) |
| `.next` | ✅ có (`/.next/`) |
| `coverage` | ✅ có (`/coverage`) |
| `*.tsbuildinfo` | ✅ có |
| `/public/uploads/*` (trừ `.gitkeep`) | ✅ có |
| `.vercel` | ✅ có |

→ Cấu hình loại trừ bí mật **đạt yêu cầu**.

### C.8. Biến môi trường tham chiếu trong code nhưng cần lưu ý

Đối chiếu giữa biến dùng trong code và biến khai báo trong `.env.example`:

| Biến | Dùng trong code | Có trong `.env.example` | Ghi chú |
| --- | --- | --- | --- |
| `DATABASE_URL` | ✅ `src/server/db.ts`, `env.ts` | ✅ | Đã tài liệu hoá |
| `AUTH_SECRET` | ✅ `src/server/env.ts` (bắt buộc, ≥16 ký tự) | ✅ | Đã tài liệu hoá |
| `NEXT_PUBLIC_SITE_URL` | ✅ `src/lib/site.ts` | ✅ | Đã tài liệu hoá |
| `ADMIN_EMAIL` | ✅ `prisma/seed.ts` | ✅ | Đã tài liệu hoá |
| `ADMIN_PASSWORD` | ✅ `prisma/seed.ts` | ✅ | Đã tài liệu hoá |
| `CLOUDINARY_CLOUD_NAME` | ✅ `src/server/env.ts` | ✅ (đang bị chú thích) | Đã tài liệu hoá |
| `CLOUDINARY_API_KEY` | ✅ `src/server/env.ts` | ✅ (đang bị chú thích) | Đã tài liệu hoá |
| `CLOUDINARY_API_SECRET` | ✅ `src/server/env.ts` | ✅ (đang bị chú thích) | Đã tài liệu hoá |
| `NODE_ENV` | ✅ `src/server/db.ts` (chỉ đọc, do Next.js cấp) | — | Không cần khai báo |
| `BETTER_AUTH_SECRET` | ❌ **không dùng ở đâu trong code** | ❌ không có | **Biến thừa** đang tồn tại trong file `.env` trên máy |

### C.9. Kiểm tra route và liên kết quan trọng

- `mainNav` và `footerNav` trong `src/lib/site.ts` tham chiếu: `/products?category=...`, `/about`,
  `/cart`, `/account/orders`, `/policies/shipping`, `/policies/returns`, `/policies/warranty`,
  `/contact`, `/account`, `/about#kiem-tra-may`.
- Đã kiểm tra: tất cả các đường dẫn trên đều **tồn tại thật** trong cấu trúc `src/app/(site)/`.
- Liên kết neo `#kiem-tra-may` khớp với `id="kiem-tra-may"` trong trang About.

### C.10. Kiểm tra đọc dữ liệu database

Đã thực hiện **kiểm tra đọc an toàn** thông qua ứng dụng (không chạy truy vấn ghi trực tiếp):

- `GET /sitemap.xml` trả về 14 URL sản phẩm → xác nhận bảng `Product` có 14 bản ghi đã publish.
- `GET /products` hiển thị tên sản phẩm thật → xác nhận `Product` join `Brand`/`Category`/`ProductImage` hoạt động.
- `npx prisma migrate status` xác nhận schema khớp.

> **Không** thực hiện bất kỳ thao tác ghi nào lên database (không tạo đơn, không tạo tài khoản, không
> seed lại, không migrate).

---

## D. Vấn đề và rủi ro

### D.1. Lỗi ngăn website chạy

**Không phát hiện.** Đã kiểm tra: `npm run build` exit 0, dev server khởi động thành công, 13 đường
dẫn trả mã hợp lệ, database kết nối được.

### D.2. Lỗi ảnh hưởng đến chức năng chính

| # | Vấn đề | Bằng chứng | Mức độ ảnh hưởng | Đề xuất xử lý | Ưu tiên |
| --- | --- | --- | --- | --- | --- |
| D2.1 | **Chưa xác minh được luồng đặt hàng đầu-cuối** | `order.service.ts` + `order.repository.ts` có code đầy đủ, nhưng chưa từng tạo đơn thật trong quá trình kiểm tra | Nếu có lỗi ẩn, khách không đặt được hàng — đây là chức năng sống còn của một website bán hàng | Tạo 1 đơn thử trên môi trường demo (dùng database test hoặc chấp nhận ghi 1 đơn) rồi xác nhận: đơn được tạo, tồn kho giảm, email/token tra cứu hoạt động | **Critical** |
| D2.2 | **Chưa xác minh việc hoàn tồn kho khi huỷ đơn** | Code trong `admin-order.actions.ts` + `order.repository.ts`; chưa chạy thử | Nếu sai, kho bị lệch sau mỗi lần huỷ đơn | Test: tạo đơn → huỷ → kiểm tra `stockQuantity` trở lại giá trị ban đầu | **High** |
| D2.3 | **Chưa xác minh upload ảnh Cloudinary thật sự thành công** | `storage.service.ts` đúng về logic; nhưng chưa upload ảnh nào | Admin không tải được ảnh → phải dán URL thủ công | Upload 1 ảnh thật, kiểm tra URL `res.cloudinary.com` trả về và ảnh hiển thị trên trang sản phẩm | **High** |
| D2.4 | **`next/image` chặn domain ảnh không khai báo** | `next.config.ts` chỉ cho phép `coresg-normal.trae.ai` và `res.cloudinary.com` | Admin dán URL ảnh từ nơi khác → ảnh không hiển thị, có thể gây hiểu nhầm là "lỗi ảnh" | Ghi rõ trong tài liệu admin; hoặc thêm cơ chế cảnh báo trong form | Medium |
| D2.5 | **Không có chức năng đổi mật khẩu** | Không có trang/action nào liên quan trong `src/` | Mật khẩu demo yếu không thể tự đổi → rủi ro bảo mật khi dùng thật | Thêm trang đổi mật khẩu cho admin và khách | **High** |
| D2.6 | **Không hiển thị ảnh sản phẩm trong chi tiết đơn hàng** | `order-items-table.tsx` không có thẻ `<Image>`; `OrderItem` không lưu ảnh | Ảnh hưởng trải nghiệm (khó đối chiếu đơn), **không** ảnh hưởng nghiệp vụ | Tuỳ chọn: join `product.images[0]` qua `productId` khi sản phẩm còn tồn tại, fallback ảnh placeholder | Low |

### D.3. Lỗi bảo mật hoặc nguy cơ lộ bí mật

| # | Vấn đề | Bằng chứng | Mức độ ảnh hưởng | Đề xuất xử lý | Ưu tiên |
| --- | --- | --- | --- | --- | --- |
| D3.1 | **Không có giới hạn số lần đăng nhập sai** | Không có `middleware.ts`; `src/auth.ts` không có rate limit | Kẻ xấu có thể dò mật khẩu admin không giới hạn | Thêm rate limit ở tầng ứng dụng, hoặc bật tính năng chống brute-force của nhà cung cấp hosting/Neon | **High** |
| D3.2 | **Mật khẩu admin demo mặc định yếu và không đổi được qua UI** | `prisma/seed.ts` dùng `ADMIN_PASSWORD` (mặc định trong `.env.example`); không có chức năng đổi mật khẩu | Nếu deploy mà không đổi, người khác có thể đoán ra mật khẩu | Bắt buộc đổi `ADMIN_PASSWORD` trước khi deploy; bổ sung chức năng đổi mật khẩu | **Critical** |
| D3.3 | **`BETTER_AUTH_SECRET` là biến thừa trong `.env`** | Tìm `BETTER_AUTH_SECRET` trong `src/` → không có kết quả; nhưng biến này tồn tại trong `.env` trên máy | Không gây lỗi, nhưng gây nhầm lẫn và có thể bị bàn giao nhầm như một bí mật đang dùng | Xoá khỏi `.env` | Low |
| D3.4 | **`AUTH_SECRET` cần được tạo mới khi bàn giao** | `env.ts` yêu cầu `AUTH_SECRET`; giá trị hiện tại là của môi trường phát triển | Nếu người bàn giao giữ lại secret cũ, họ có thể giả mạo phiên đăng nhập | Tạo `AUTH_SECRET` mới bằng `npx auth secret` cho môi trường của người nhận | **High** |
| D3.5 | **Chưa xác minh bảo vệ đơn hàng 2 lớp bằng thực nghiệm** | `SECURITY.md` mô tả cơ chế `owner || accessToken`; code có, nhưng chưa thử truy cập trái phép | Nếu sai, khách có thể xem đơn của người khác | Test: mở đơn của người khác khi không có token → phải nhận `404` | **High** |
| D3.6 | **Chưa xác minh bảo mật ở môi trường production thật** | Không có dữ liệu về production | Không thể kết luận production an toàn chỉ vì build thành công | Thực hiện rà soát bảo mật trước khi deploy (xem `SECURITY.md`) | **High** |

> **Điểm tích cực**: đã kiểm tra và **không** phát hiện (a) mật khẩu lưu dạng văn bản thuần,
> (b) server action admin nào thiếu `assertAdmin()`, (c) API upload cho phép người ngoài,
> (d) file `.env` nằm ngoài `.gitignore`. Cũng không thấy bí mật nào bị viết vào source code.

### D.4. Lỗi dữ liệu hoặc migration

| # | Vấn đề | Bằng chứng | Mức độ ảnh hưởng | Đề xuất xử lý | Ưu tiên |
| --- | --- | --- | --- | --- | --- |
| D4.1 | **Toàn bộ dữ liệu hiện tại là dữ liệu mẫu** | `prisma/seed.ts` ghi rõ trong chú thích đầu file; `DEMO_NOTE = "Ảnh minh hoạ dạng placeholder..."` | Nếu bàn giao nguyên trạng, người nhận có thể nhầm là hàng thật | Thay bằng dữ liệu thật, hoặc ghi rõ ràng đây là môi trường demo | **High** |
| D4.2 | **Ảnh sản phẩm là ảnh sinh bởi AI, không ổn định** | `prisma/seed.ts` dùng `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?...` | Ảnh có thể chậm hoặc biến mất, làm website trông thiếu chuyên nghiệp và có thể hỏng hình ảnh khi dịch vụ ngừng hoạt động | Thay bằng ảnh thật trên Cloudinary | **High** |
| D4.3 | **Lệnh seed có thể ghi đè dữ liệu** | `seed.ts` dùng `upsert` cho sản phẩm, `deleteMany` + `createMany` cho `ProductImage`, và **upsert mật khẩu** cho tài khoản admin/khách | Nếu vô tình chạy `npm run db:seed` trên database production, dữ liệu sản phẩm và mật khẩu sẽ bị đặt lại | **Cảnh báo rõ** trong tài liệu; chỉ chạy seed trên database demo | **High** |
| D4.4 | **Chưa xác minh sao lưu/khôi phục** | Không có script sao lưu trong repo; `docs/DEPLOYMENT.md` chỉ khuyến nghị bật point-in-time restore | Nếu database hỏng, nguy cơ mất toàn bộ đơn hàng | Bật sao lưu tự động trên Neon và **thử khôi phục** một lần | **Critical** |
| D4.5 | **Không có migration cho thay đổi trong tương lai** | Chỉ có `0_init`. Từ giờ mọi thay đổi schema cần tạo migration mới | Không phải lỗi hiện tại, nhưng dễ sai nếu dùng `prisma db push` trên production | Quy trình: tạo migration ở dev bằng `npm run db:migrate`, commit thư mục `prisma/migrations`, rồi `npx prisma migrate deploy` trên production | Medium |

### D.5. Lỗi trải nghiệm người dùng

| # | Vấn đề | Bằng chứng | Mức độ ảnh hưởng | Đề xuất xử lý | Ưu tiên |
| --- | --- | --- | --- | --- | --- |
| D5.1 | **Giỏ hàng chỉ lưu trên trình duyệt** | `cart-provider.tsx` dùng `localStorage` key `analog-house-cart-v1` | Khách đổi thiết bị hoặc xoá dữ liệu trình duyệt sẽ mất giỏ hàng | Chấp nhận được với MVP; có thể lưu giỏ trên server cho khách đã đăng nhập (cải thiện sau) | Medium |
| D5.2 | **Không gửi email xác nhận đơn hàng** | Không có thư viện email trong `package.json`; không có code gửi thư | Khách không nhận được xác nhận; admin phải gọi điện thủ công | Thêm dịch vụ email (Resend/SendGrid) khi cần | Medium |
| D5.3 | **Thông tin hotline/địa chỉ/ngân hàng là thông tin mẫu** | `src/lib/site.ts` ghi rõ *"dữ liệu demo, sửa lại trước khi dùng thật"* | Khách sẽ gọi/ chuyển khoản sai nếu quên sửa | Sửa `src/lib/site.ts` trước khi dùng thật | **High** |
| D5.4 | **Chưa kiểm tra giao diện trên thiết bị thật** | Không có thiết bị trong môi trường kiểm tra | Có thể có lỗi bố cục trên điện thoại | Mở DevTools chế độ mobile, kiểm tra 5 trang chính | Medium |
| D5.5 | **Menu chính không có liên kết tới trang chủ trong một số ngữ cảnh** | `mainNav` không có mục "/" (chỉ có trong logo) | Không đáng kể | Chấp nhận | Low |

### D.6. Vấn đề chưa xác minh

| # | Vấn đề | Vì sao chưa xác minh | Cách xác minh |
| --- | --- | --- | --- |
| D6.1 | Trạng thái **deploy production** | Không có file cấu hình deploy trong repo; không truy cập được bảng điều khiển hosting | Xác minh với người bàn giao |
| D6.2 | **Biến môi trường production** đã đặt đủ chưa | Chỉ kiểm tra được file `.env` ở máy local | Kiểm tra trên bảng điều khiển hosting |
| D6.3 | **Tên miền thật** và DNS | Không có thông tin trong repo | Xác minh với người bàn giao |
| D6.4 | **Cấu hình sao lưu Neon** | Nằm trong Neon Dashboard | Kiểm tra trực tiếp trên Neon |
| D6.5 | **Quota / quyền của tài khoản Cloudinary** | Không thực hiện upload thật | Upload thử 1 ảnh |
| D6.6 | **Chất lượng nội dung chính sách** (đổi trả, bảo hành) | Chỉ đọc code, chưa đối chiếu nghiệp vụ thật | Đối chiếu với chính sách kinh doanh thật |
| D6.7 | **Hiệu năng khi có nhiều dữ liệu** | Database hiện chỉ có 14 sản phẩm | Cân nhắc test tải trước khi mở bán |
| D6.8 | **Lịch sử phát triển dự án** | Không phải Git repository | Yêu cầu người bàn giao giải thích hoặc bắt đầu commit từ trạng thái hiện tại |

---

## E. Kế hoạch hoàn thiện theo thứ tự

> **Không đưa ra ước lượng thời gian** vì chưa đủ dữ kiện (chưa biết ai làm, làm toàn thời gian hay
> bán thời gian, và một số việc phụ thuộc vào quyền truy cập dịch vụ bên ngoài).

### E.1. Việc cần làm ngay để website chạy ổn định

1. **Khởi tạo Git repository và commit baseline** — hiện tại **không có lịch sử phiên bản nào**;
   đây là rủi ro lớn nhất về mặt kỹ thuật vì mọi thay đổi đều không thể hoàn tác.
2. **Xác nhận lại biến môi trường** theo bảng ở
   [HUONG_DAN_CHAY_VA_BAN_GIAO.md, mục C](file:///d:/WorkSpace/Project/linhchuplinhtinh/HUONG_DAN_CHAY_VA_BAN_GIAO.md#c-danh-sách-biến-môi-trường):
   xoá biến thừa `BETTER_AUTH_SECRET`, xác nhận `AUTH_SECRET` dài ≥ 32 ký tự.
3. **Kiểm thử luồng đặt hàng đầu-cuối** trên môi trường demo (tạo đơn → kiểm tra tồn kho → tra cứu đơn).
4. **Kiểm thử huỷ đơn có hoàn tồn kho.**
5. **Kiểm thử bảo vệ đơn hàng 2 lớp** (mở đơn của người khác phải bị từ chối).

### E.2. Việc cần làm trước khi bàn giao

6. **Bật và kiểm thử sao lưu database** trên Neon (sao lưu + thử khôi phục một lần).
7. **Thay toàn bộ nội dung mẫu**: hotline, email, địa chỉ, thông tin ngân hàng trong `src/lib/site.ts`;
   giá và mô tả sản phẩm; phí vận chuyển trong `/admin/settings`; rà soát nội dung 3 trang chính sách.
8. **Thay toàn bộ ảnh demo** bằng ảnh thật (tải lên Cloudinary).
9. **Đổi mật khẩu admin** khỏi giá trị mặc định; nếu cần, bổ sung chức năng đổi mật khẩu.
10. **Đóng gói bàn giao an toàn**: kiểm tra gói không chứa `.env`, `node_modules`, `.next`.
11. **Hướng dẫn người nhận chạy lại** theo
    [HUONG_DAN_CHAY_VA_BAN_GIAO.md](file:///d:/WorkSpace/Project/linhchuplinhtinh/HUONG_DAN_CHAY_VA_BAN_GIAO.md)
    và xác nhận họ chạy được trên máy riêng.

### E.3. Việc cần làm trước khi deploy production

12. **Xác minh trạng thái deploy hiện tại** với người bàn giao (chưa có bằng chứng dự án đã online).
13. **Đặt `NEXT_PUBLIC_SITE_URL`** thành tên miền thật (hiện đang là `http://localhost:3000`, và
    giá trị này đã bị "đóng băng" vào `sitemap.xml`).
14. **Tạo `AUTH_SECRET` mới** cho production bằng `npx auth secret`.
15. **Khai báo đầy đủ biến môi trường trên hosting** (xem `docs/DEPLOYMENT.md`).
16. **Đổi mật khẩu admin mặc định** và không dùng mật khẩu demo.
17. **Thêm giới hạn số lần đăng nhập sai** (rate limit) hoặc bật bảo vệ của nhà cung cấp.
18. **Bật chế độ connection pooling của Neon** cho hàm serverless (đã ghi trong `docs/DEPLOYMENT.md`).
19. **Kiểm tra lại `robots.txt` / `sitemap.xml`** sau khi deploy để chắc chắn không lộ `localhost`
    và không lộ `/admin`, `/account`, `/cart`, `/checkout`, `/api/`.
20. **Rà soát theo `SECURITY.md`** trước khi phát hành.

### E.4. Việc có thể cải thiện sau

21. Bổ sung test tích hợp cho tầng database và server action (hiện 42 test chỉ phủ logic thuần).
22. Thêm chức năng **đổi mật khẩu** và **quên mật khẩu**.
23. Thêm **gửi email** xác nhận đơn hàng.
24. Thêm **mã giảm giá / khuyến mãi** (hiện `discountTotal` luôn bằng 0).
25. Hiển thị **ảnh sản phẩm trong chi tiết đơn hàng**.
26. Lưu **giỏ hàng trên server** cho khách đã đăng nhập.
27. Chuyển cấu hình Prisma sang `prisma.config.ts` (chuẩn bị cho Prisma 7).
28. Thêm **log lịch sử thay đổi** cho thao tác sửa tồn kho / sửa giá.
29. Tối ưu hiệu năng và kiểm tra tải khi dữ liệu lớn.

### E.5. Kiểm thử nghiệm thu cuối cùng

Trước khi ký bàn giao, chạy lại và **ghi lại kết quả**:

```powershell
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

Cả 5 lệnh phải kết thúc thành công. Sau đó chạy `npm run dev` và kiểm tra thủ công:

- [ ] Trang chủ → danh sách sản phẩm → chi tiết sản phẩm → thêm vào giỏ → đặt hàng (dùng dữ liệu test).
- [ ] Đăng nhập admin → thêm sản phẩm → ngừng bán → khôi phục.
- [ ] Đăng nhập admin → mở đơn hàng vừa tạo → chuyển trạng thái → huỷ đơn → kiểm tra tồn kho hoàn lại.
- [ ] Upload 1 ảnh thật và kiểm tra ảnh hiển thị đúng.
- [ ] Đăng xuất → vào `/admin` phải bị chuyển về `/login`.
- [ ] Mở `/robots.txt`, `/sitemap.xml` kiểm tra nội dung.
- [ ] Thu nhỏ cửa sổ trình duyệt (hoặc dùng chế độ mobile) để kiểm tra giao diện điện thoại.

---

## F. Kết luận bàn giao

### F.1. Có thể bàn giao để sử dụng chưa?

**Chưa thể bàn giao để dùng thật ngay.** Lý do dựa trên bằng chứng:

- Toàn bộ dữ liệu hiện có là **dữ liệu mẫu** (sản phẩm, giá, mô tả, ảnh AI, hotline, số tài khoản
  ngân hàng) — xem `prisma/seed.ts` và `src/lib/site.ts`.
- Chưa có bằng chứng **sao lưu** nào đang hoạt động ([D4.4](#d4-lỗi-dữ-liệu-hoặc-migration)).
- **Luồng đặt hàng đầu-cuối chưa được kiểm thử thực tế** ([D2.1](#d2-lỗi-ảnh-hưởng-đến-chức-năng-chính)).
- **Không có chức năng đổi mật khẩu**, trong khi mật khẩu admin mặc định là mật khẩu demo trong
  tài liệu công khai ([D2.5](#d2-lỗi-ảnh-hưởng-đến-chức-năng-chính), [D3.2](#d3-lỗi-bảo-mật-hoặc-nguy-cơ-lộ-bí-mật)).

**Điểm tích cực**: website **chạy được**, build sạch, 42/42 test pass, kết nối database thật thành
công, đăng nhập và phân quyền admin hoạt động thật. Khoảng cách còn lại chủ yếu là **dữ liệu thật**,
**kiểm thử các luồng có ghi dữ liệu**, và **vận hành (sao lưu, deploy)**.

### F.2. Có thể bàn giao source code cho developer khác chưa?

**Có thể, với điều kiện kèm theo.** Source code rõ ràng, có cấu trúc phân lớp nhất quán, có tài liệu
(`README.md`, `SECURITY.md`, `docs/DEPLOYMENT.md`), build/lint/typecheck/test đều sạch — một lập trình
viên mới có thể tiếp nhận và chạy được.

**Nhưng cần lưu ý:**

- **Không có Git history** → người nhận không biết phần nào mới sửa, không thể so sánh hay rollback
  ([D4](#d4-lỗi-dữ-liệu-hoặc-migration), [#56 trong bảng B](#b-bảng-tiến-độ-chức-năng)).
- Cần chuyển kèm: danh sách biến môi trường (tên, không phải giá trị), quyền truy cập Neon và
  Cloudinary, và mô tả các luồng **chưa được kiểm thử** để họ biết chỗ nào cần cẩn trọng.

### F.3. Có thể deploy production chưa?

**Chưa.** Không chỉ vì lý do kỹ thuật, mà còn vì chưa đủ thông tin:

- Không có bằng chứng dự án đã từng được deploy, cũng không có file cấu hình deploy trong repo.
- `NEXT_PUBLIC_SITE_URL` đang trỏ `http://localhost:3000` → sitemap và metadata sẽ sai nếu đưa lên
  mà không đổi ([#58 trong bảng B](#b-bảng-tiến-độ-chức-năng)).
- Mật khẩu admin vẫn là mật khẩu demo công khai, và **không có cách đổi qua giao diện**
  ([D3.2](#d3-lỗi-bảo-mật-hoặc-nguy-cơ-lộ-bí-mật)).
- Chưa có sao lưu và chưa kiểm thử khôi phục ([D4.4](#d4-lỗi-dữ-liệu-hoặc-migration)).
- Chưa có giới hạn chống dò mật khẩu ([D3.1](#d3-lỗi-bảo-mật-hoặc-nguy-cơ-lộ-bí-mật)).

> **Nhấn mạnh**: `npm run build` thành công **không** đồng nghĩa production an toàn. Build chỉ chứng
> minh code biên dịch được, không chứng minh bảo mật, dữ liệu, hay vận hành đã sẵn sàng.

### F.4. Những điều kiện nào còn thiếu?

| # | Điều kiện còn thiếu | Loại |
| --- | --- | --- |
| 1 | Git repository + lịch sử phiên bản | Kỹ thuật |
| 2 | Bằng chứng luồng đặt hàng chạy đúng đầu-cuối | Chức năng |
| 3 | Bằng chứng huỷ đơn hoàn tồn kho đúng | Chức năng |
| 4 | Bằng chứng upload ảnh Cloudinary thành công | Chức năng |
| 5 | Bằng chứng bảo vệ đơn hàng 2 lớp hoạt động | Bảo mật |
| 6 | Sao lưu database đang bật + đã thử khôi phục | Vận hành |
| 7 | Dữ liệu thật thay cho dữ liệu demo (sản phẩm, giá, ảnh) | Nội dung |
| 8 | Thông tin liên hệ và ngân hàng thật | Nội dung |
| 9 | Chức năng đổi mật khẩu (hoặc quy trình đổi mật khẩu an toàn) | Bảo mật |
| 10 | Giới hạn chống dò mật khẩu | Bảo mật |
| 11 | Xác nhận về môi trường production, tên miền, hosting | Vận hành |
| 12 | `AUTH_SECRET` mới cho môi trường người nhận | Bảo mật |
| 13 | Kiểm tra giao diện trên thiết bị thật | Chất lượng |

### F.5. Năm việc ưu tiên tiếp theo

1. **Khởi tạo Git và commit baseline** — để mọi thay đổi sau này có thể theo dõi và hoàn tác.
2. **Kiểm thử luồng đặt hàng đầu-cuối** trên môi trường demo: tạo đơn → kiểm tra tồn kho giảm →
   tra cứu đơn bằng mã đơn + số điện thoại → huỷ đơn → kiểm tra tồn kho hoàn lại.
3. **Bật sao lưu database trên Neon và thử khôi phục một lần** để chứng minh quy trình hoạt động.
4. **Đổi mật khẩu admin khỏi giá trị mặc định** (và/hoặc bổ sung chức năng đổi mật khẩu), đồng thời
   tạo `AUTH_SECRET` mới.
5. **Upload thử một ảnh thật lên Cloudinary** qua trang quản trị và xác nhận ảnh hiển thị đúng trên
   trang sản phẩm — để loại trừ rủi ro "admin không tải được ảnh".

---

> **Phạm vi và giới hạn của báo cáo**: báo cáo này dựa trên việc đọc source code và chạy các kiểm tra
> không phá huỷ trên **một máy, tại một thời điểm**. Báo cáo **không** xác nhận bất kỳ thông tin nào
> về môi trường production, tên miền, hoặc tài khoản dịch vụ cloud — những phần đó được đánh dấu
> **Chưa đủ thông tin** và cần được xác minh trực tiếp với người bàn giao.
