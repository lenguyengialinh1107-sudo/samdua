# Analog House

Website thương mại điện tử mua bán máy ảnh film, máy ảnh digital, compact, lens và phụ kiện nhiếp ảnh.
Giao diện tiếng Việt, tiền tệ VND, phong cách editorial/analog.

## Công nghệ

| Thành phần | Lựa chọn |
| --- | --- |
| Framework | Next.js 15 (App Router) + React 19 + TypeScript |
| Giao diện | Tailwind CSS v4 + design tokens riêng (không dùng template đại trà) |
| Form & validate | React Hook Form + Zod (validate lại ở server) |
| Database | PostgreSQL (Neon) + Prisma ORM |
| Xác thực | Auth.js v5 — Credentials (email + mật khẩu, bcrypt), session JWT |
| Upload ảnh | Cloudinary (tuỳ chọn; có adapter và fallback nhập URL thủ công) |
| Test | Vitest |

Backend **không dùng Supabase**: toàn bộ nghiệp vụ chạy trong Next.js Route Handlers / Server Actions.

## Bắt đầu

```bash
# 1. Cài phụ thuộc
npm install

# 2. Tạo file môi trường
copy .env.example .env      # Windows
# cp .env.example .env      # macOS/Linux

# 3. Điền DATABASE_URL (Neon) và AUTH_SECRET, sau đó:
npx auth secret             # sinh AUTH_SECRET

# 4. Tạo bảng + nạp dữ liệu demo
npm run db:deploy           # hoặc npm run db:migrate khi phát triển
npm run db:seed

# 5. Chạy dev
npm run dev
```

Mở http://localhost:3000

### Tài khoản demo

| Vai trò | Email | Mật khẩu |
| --- | --- | --- |
| Quản trị | `admin@analoghouse.vn` | `Admin@12345` |
| Khách hàng | `khach@analoghouse.vn` | `Khachhang@123` |

Mật khẩu admin lấy từ `ADMIN_EMAIL` / `ADMIN_PASSWORD` trong `.env` nếu có khai báo.

## Kiến trúc

```
src/
  app/
    (site)/          # Khu vực khách hàng (header/footer chung)
    admin/           # Khu vực quản trị (layout + chặn quyền ở server)
    api/             # Route Handlers (upload ảnh, Auth.js)
  components/        # UI dùng lại (ui/, product/, cart/, admin/, layout/)
  lib/               # Logic thuần, không phụ thuộc DB
    cart.ts          # tính tiền, phí vận chuyển, kẹp số lượng
    format.ts        # định dạng VND, slug, parse tiền
    order-status.ts  # luồng trạng thái đơn hàng
    validations/     # Zod schema dùng chung client + server
  server/
    repositories/    # Truy vấn Prisma
    services/        # Nghiệp vụ
    actions/         # Server Actions (đều có assertAdmin/assertUser)
prisma/
  schema.prisma
  seed.ts
tests/               # Test cho logic thuần
```

Luồng phụ thuộc một chiều: `repositories → services → actions → components`.
Logic thuần được tách khỏi DB để test không cần database.

## Trang

**Khách hàng**

- `/` trang chủ, `/products` duyệt + tìm/lọc/sắp xếp, `/products/[slug]` chi tiết
- `/cart`, `/checkout`, `/order-success/[orderNumber]`
- `/account`, `/account/orders`, `/account/orders/[orderNumber]` (tra cứu đơn cho khách vãng lai)
- `/login`, `/register`
- `/about`, `/contact`, `/policies/shipping`, `/policies/returns`, `/policies/warranty`

**Quản trị** (`/admin`, yêu cầu role `ADMIN`)

- `/admin` dashboard thống kê, `/admin/products` + `/admin/products/new` + `/admin/products/[id]` (CRUD + upload ảnh + sửa tồn kho)
- `/admin/orders` + `/admin/orders/[id]` (chuyển trạng thái, cập nhật thanh toán)
- `/admin/categories` (danh mục & thương hiệu), `/admin/settings` (phí vận chuyển)

## Lệnh thường dùng

| Lệnh | Mô tả |
| --- | --- |
| `npm run dev` | Chạy server phát triển |
| `npm run build` | Build production |
| `npm run lint` | Kiểm tra ESLint |
| `npm run typecheck` | Kiểm tra TypeScript |
| `npm run test` | Chạy test Vitest |
| `npm run db:migrate` | Tạo migration mới (dev) |
| `npm run db:deploy` | Áp migration lên database |
| `npm run db:seed` | Nạp dữ liệu demo |
| `npm run db:studio` | Mở Prisma Studio |

## Nghiệp vụ quan trọng

- **Giá là số nguyên VND**, không dùng số thực cho tiền.
- **Không bán vượt tồn kho**: tạo đơn dùng transaction và `updateMany` với điều kiện
  `stockQuantity >= quantity`; nếu bất kỳ dòng nào không đủ hàng, toàn bộ đơn bị rollback.
- **Snapshot trong đơn hàng**: tên, SKU và đơn giá được lưu tại thời điểm đặt, nên sửa sản phẩm
  sau này không làm sai lịch sử đơn.
- **Ưu tiên archive thay vì xoá**: sản phẩm đã từng bán chỉ được "ngừng bán" để giữ lịch sử.
- **Luồng trạng thái đơn**: `PENDING → CONFIRMED → SHIPPING → COMPLETED`, có thể `CANCELLED`
  ở các bước chưa kết thúc. Huỷ đơn sẽ hoàn lại tồn kho tự động.
- **Giá và tồn kho luôn được tính lại ở server** khi tạo đơn; tổng tiền hiển thị trên client chỉ
  mang tính tham khảo.

## Bảo mật

Xem [SECURITY.md](./SECURITY.md).

## Triển khai

Xem [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md).
