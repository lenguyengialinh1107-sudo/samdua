# Bảo mật

Tài liệu này tóm tắt các biện pháp bảo mật đang áp dụng trong Analog House và những việc cần làm
trước khi chạy thật.

## Nguyên tắc chung

1. **Kiểm tra quyền ở server, không dựa vào UI.** Mọi Server Action của admin bắt đầu bằng
   `assertAdmin()`; layout `/admin` gọi `requireAdmin()`. Việc ẩn nút trên giao diện không được
   coi là biện pháp bảo mật.
2. **Validate hai lần.** Zod schema được dùng ở client (phản hồi nhanh) và ở server (nguồn tin cậy).
   Dữ liệu gửi lên không qua được `safeParse` sẽ bị từ chối.
3. **Không tin dữ liệu từ client.** Giá, tồn kho và tổng tiền được đọc lại từ database ở server
   khi tạo đơn; client chỉ gửi `productId` và `quantity`.
4. **Không lộ secret.** Các biến như `DATABASE_URL`, `AUTH_SECRET`, `CLOUDINARY_API_SECRET` chỉ
   tồn tại phía server, không bao giờ đặt tiền tố `NEXT_PUBLIC_`.

## Xác thực & phân quyền

- Auth.js v5 với Credentials provider; mật khẩu băm bằng bcrypt (10 vòng).
- Session dùng chiến lược JWT; `role` được đưa vào token để phân quyền.
- Trang yêu cầu đăng nhập gọi `requireUser(...)`, trang admin gọi `requireAdmin()` — cả hai đều
  redirect ở server trước khi render.
- Không có luồng nào cho phép người dùng tự nâng quyền lên `ADMIN` qua form.

## Truy cập đơn hàng

Đơn hàng chứa thông tin cá nhân nên được bảo vệ theo hai lớp:

- Chủ đơn đã đăng nhập (`order.userId === session.user.id`), **hoặc**
- Người biết `accessToken` của đơn (dùng cho khách vãng lai sau khi đặt hàng thành công).

Nếu không thoả một trong hai điều kiện, trang gọi `notFound()` thay vì báo lỗi phân quyền, để
không tiết lộ sự tồn tại của đơn hàng. Trang `/order-success` chỉ hiển thị thông tin người nhận và
danh sách sản phẩm khi token hợp lệ.

`/cart`, `/checkout`, `/account`, `/admin` đều đặt `robots: { index: false }` và bị chặn trong
`robots.txt`.

## Upload ảnh

- `POST /api/admin/upload` kiểm tra session **và** role `ADMIN` trước khi xử lý.
- Chỉ nhận `image/jpeg`, `image/png`, `image/webp`, `image/avif`; tối đa 5MB.
- Việc đọc file và gọi Cloudinary diễn ra ở server (`runtime = "nodejs"`); API secret không rời
  khỏi server.
- Khi chưa cấu hình Cloudinary, endpoint trả 501 và admin nhập URL ảnh thủ công.

## CSDL & toàn vẹn dữ liệu

- Tạo đơn hàng chạy trong `prisma.$transaction`; trừ tồn kho bằng `updateMany` có điều kiện để
  chống bán vượt kho khi nhiều đơn đồng thời.
- Ràng buộc duy nhất ở tầng database cho `email`, `slug`, `sku`, `orderNumber`, `accessToken`.
- Xoá cứng sản phẩm không được cung cấp qua UI; thay vào đó là archive để giữ lịch sử đơn hàng.

## Việc cần làm trước khi chạy thật

- [ ] Đổi toàn bộ mật khẩu demo và `ADMIN_PASSWORD`; không dùng tài khoản seed trên production.
- [ ] Cập nhật thông tin ngân hàng trong `src/lib/site.ts` (hiện là dữ liệu demo).
- [ ] Bật HTTPS và đặt `NEXT_PUBLIC_SITE_URL` đúng tên miền (ảnh hưởng canonical/sitemap).
- [ ] Xem lại chính sách bảo mật của nhà cung cấp database (Neon) và giới hạn IP nếu cần.
- [ ] Thêm rate limiting cho `/api/auth/*`, `/api/admin/upload` và Server Action tạo đơn hàng.
- [ ] Cân nhắc thêm xác thực email (verification) và luồng quên mật khẩu.

## Báo cáo lỗ hổng

Nếu phát hiện vấn đề bảo mật, vui lòng gửi email tới địa chỉ liên hệ trong `src/lib/site.ts`
thay vì mở issue công khai.
