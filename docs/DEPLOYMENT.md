# Triển khai

Hướng dẫn đưa Analog House lên môi trường production (khuyến nghị: Vercel + Neon PostgreSQL).

## 1. Chuẩn bị database (Neon)

1. Tạo project trên [Neon](https://neon.tech).
2. Vào **Dashboard → Connection string**, chọn định dạng **Prisma** (hoặc Node.js).
3. Sao chép chuỗi kết nối, đảm bảo có `?sslmode=require` ở cuối.
4. Áp schema lên database:

```bash
DATABASE_URL="postgresql://...?sslmode=require" npx prisma migrate deploy
```

5. Nạp dữ liệu khởi tạo (danh mục, thương hiệu, sản phẩm mẫu, tài khoản admin):

```bash
DATABASE_URL="postgresql://...?sslmode=require" npm run db:seed
```

> Trên Neon nên tạo branch riêng cho production và bật **Connection pooling** (PgBouncer) cho
> các kết nối từ serverless function.

## 2. Biến môi trường

Khai báo trong **Vercel → Project → Settings → Environment Variables**:

| Biến | Bắt buộc | Ghi chú |
| --- | --- | --- |
| `DATABASE_URL` | Có | Chuỗi kết nối PostgreSQL/Neon |
| `AUTH_SECRET` | Có | Ít nhất 32 ký tự ngẫu nhiên; sinh bằng `npx auth secret` |
| `NEXT_PUBLIC_SITE_URL` | Có | Tên miền thật, ví dụ `https://analoghouse.vn` |
| `ADMIN_EMAIL` | Không | Email tài khoản admin do seed tạo |
| `ADMIN_PASSWORD` | Không | Mật khẩu admin, tối thiểu 8 ký tự |
| `CLOUDINARY_CLOUD_NAME` | Không | Bật upload ảnh sản phẩm |
| `CLOUDINARY_API_KEY` | Không | |
| `CLOUDINARY_API_SECRET` | Không | Chỉ ở server, không đặt tiền tố `NEXT_PUBLIC_` |

Nếu bỏ trống Cloudinary, admin vẫn nhập URL ảnh thủ công trong form sản phẩm.

## 3. Triển khai lên Vercel

```bash
npm i -g vercel
vercel link
vercel env pull .env.local   # tuỳ chọn, để kiểm tra biến
vercel --prod
```

Hoặc kết nối repository với Vercel và để mỗi lần push lên nhánh chính tự build.

Thiết lập trên Vercel:

- **Build command**: `npm run build` (mặc định)
- **Install command**: `npm install` — script `postinstall` tự chạy `prisma generate`
- **Node.js version**: 20 trở lên

## 4. Cloudinary (tuỳ chọn)

1. Tạo tài khoản Cloudinary, lấy **Cloud name**, **API key**, **API secret**.
2. Khai báo 3 biến môi trường tương ứng.
3. Ảnh sẽ được upload vào thư mục `analog-house/products`.
4. Kiểm tra trạng thái tại `/admin/settings` — badge "Đã cấu hình" nghĩa là upload hoạt động.

## 5. Sau khi deploy

- [ ] Đăng nhập `/admin` bằng tài khoản admin và **đổi mật khẩu mặc định**.
- [ ] Cập nhật hotline, địa chỉ, email và thông tin ngân hàng trong `src/lib/site.ts`.
- [ ] Kiểm tra `/robots.txt` và `/sitemap.xml` trả về tên miền đúng.
- [ ] Thử luồng: thêm sản phẩm → đặt hàng → xác nhận đơn → chuyển trạng thái → huỷ đơn (kiểm tra tồn kho được hoàn).
- [ ] Cập nhật phí vận chuyển tại `/admin/settings` cho phù hợp thực tế.

## 6. Kiểm tra chất lượng trước khi phát hành

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Cả bốn lệnh phải chạy thành công (exit code 0).

## 7. Ghi chú vận hành

- **Migration**: khi schema thay đổi, tạo migration ở môi trường dev bằng `npm run db:migrate`,
  commit thư mục `prisma/migrations`, rồi chạy `npx prisma migrate deploy` trên production.
- **Sao lưu**: Neon hỗ trợ point-in-time restore; nên bật và kiểm tra định kỳ.
- **Không commit** file `.env` / `.env.local`. Chúng đã nằm trong `.gitignore`.
- **Rollback**: dùng chức năng "Instant Rollback" của Vercel; lưu ý migration database không tự
  rollback nên cần chuẩn bị migration nghịch nếu thay đổi phá vỡ tương thích.
