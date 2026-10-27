# Hướng dẫn chạy và bàn giao — Analog House

> Tài liệu này dành cho người **không có kiến thức lập trình** để: nhận bàn giao dự án, sử dụng
> website với tư cách quản trị viên, và biết phải làm gì nếu muốn chạy source code trên máy tính.
>
> Mọi thuật ngữ kỹ thuật đều được giải thích ngay khi xuất hiện lần đầu.
>
> Tài liệu được lập ngày **2026-10-23** dựa trên việc đọc trực tiếp source code và chạy kiểm tra
> thực tế. Những điểm **chưa kiểm chứng được** đều được ghi rõ là `Cần xác minh`.

## Mục lục

- [A. Tổng quan dự án](#a-tổng-quan-dự-án)
- [B. Hai cách sử dụng](#b-hai-cách-sử-dụng)
- [C. Danh sách biến môi trường](#c-danh-sách-biến-môi-trường)
- [D. Hướng dẫn sử dụng website](#d-hướng-dẫn-sử-dụng-website)
- [E. Quy trình bàn giao cho người khác](#e-quy-trình-bàn-giao-cho-người-khác)
- [F. Sao lưu, khôi phục và bảo trì](#f-sao-lưu-khôi-phục-và-bảo-trì)
- [G. Checklist bàn giao](#g-checklist-bàn-giao)

---

## A. Tổng quan dự án

### A.1. Website dùng để làm gì?

**Analog House** là một website bán hàng (thương mại điện tử) chuyên về **máy ảnh film, máy ảnh
digital, máy compact, ống kính (lens) và phụ kiện nhiếp ảnh**. Giao diện tiếng Việt, giá hiển thị
bằng đồng Việt Nam (VND).

Khách truy cập có thể: xem danh sách sản phẩm, tìm kiếm và lọc, xem chi tiết từng máy, thêm vào
giỏ hàng, đặt hàng, và tra cứu lại đơn hàng. Quản trị viên có một khu vực riêng để thêm/sửa sản
phẩm, tải ảnh lên, quản lý đơn hàng và cấu hình phí vận chuyển.

### A.2. Các công nghệ thực tế tìm thấy trong source code

Các giá trị dưới đây được đọc trực tiếp từ [package.json](file:///d:/WorkSpace/Project/linhchuplinhtinh/package.json):

| Thành phần | Công nghệ thực tế | Giải thích cho người không chuyên |
| --- | --- | --- |
| Framework | **Next.js 15.5.28** (App Router) | Bộ khung được dùng để dựng website; vừa làm phần hiển thị, vừa làm phần xử lý phía máy chủ. |
| Giao diện | **React 19.1.0** + **Tailwind CSS v4** | React dựng các thành phần giao diện; Tailwind định nghĩa màu sắc, khoảng cách, kiểu chữ. |
| Ngôn ngữ | **TypeScript 5** | Ngôn ngữ lập trình có kiểm tra kiểu dữ liệu, giúp giảm lỗi. |
| Cơ sở dữ liệu | **PostgreSQL** (khuyến nghị **Neon**) | Nơi lưu toàn bộ dữ liệu: sản phẩm, đơn hàng, tài khoản. |
| ORM | **Prisma 6.19.3** | Lớp trung gian giúp code nói chuyện với database một cách an toàn. |
| Xác thực | **Auth.js v5 (next-auth 5.0.0-beta.32)** — đăng nhập bằng email + mật khẩu | Thư viện quản lý việc đăng nhập/đăng xuất. |
| Mã hoá mật khẩu | **bcryptjs** | Mật khẩu được băm (hash) trước khi lưu, không lưu mật khẩu gốc. |
| Kiểm tra dữ liệu | **Zod** + React Hook Form | Kiểm tra dữ liệu người dùng nhập trước khi xử lý. |
| Lưu trữ ảnh | **Cloudinary 2.11.0** (tuỳ chọn) | Dịch vụ lưu ảnh trên internet; nếu không cấu hình, vẫn nhập được URL ảnh thủ công. |
| Kiểm thử | **Vitest 3.2.7** | Công cụ chạy các bài kiểm tra tự động. |

**Không có Supabase** trong dự án (đã kiểm tra `package.json` và toàn bộ source code).

### A.3. Chức năng người dùng và quản trị viên có thể sử dụng

**Đã xác minh hoạt động** (đã chạy thật trên máy trong ngày kiểm tra — xem
[KIEM_TRA_TIEN_DO_DU_AN.md](file:///d:/WorkSpace/Project/linhchuplinhtinh/KIEM_TRA_TIEN_DO_DU_AN.md)):

| Khu vực | Chức năng |
| --- | --- |
| Khách | Trang chủ, danh sách sản phẩm, tìm kiếm/lọc/sắp xếp, trang chi tiết sản phẩm |
| Khách | Giỏ hàng (lưu trên trình duyệt), trang thanh toán, trang đặt hàng thành công |
| Khách | Đăng nhập, đăng ký, xem tài khoản và danh sách đơn hàng của mình |
| Khách vãng lai | Tra cứu đơn hàng bằng **mã đơn + số điện thoại** |
| Khách | Trang Giới thiệu, Liên hệ, Chính sách vận chuyển / Đổi trả / Bảo hành |
| Quản trị | Đăng nhập bằng tài khoản admin; khu vực `/admin` được chặn ở phía máy chủ |
| Quản trị | Danh sách sản phẩm có lọc, thêm sản phẩm mới, sửa sản phẩm |
| Quản trị | Ngừng bán (ẩn) và khôi phục sản phẩm; sửa nhanh số lượng tồn kho |
| Quản trị | Danh sách đơn hàng, chi tiết đơn, chuyển trạng thái, cập nhật trạng thái thanh toán |
| Quản trị | Quản lý danh mục, thêm thương hiệu |
| Quản trị | Cấu hình phí vận chuyển; xem trạng thái Cloudinary ("Đã cấu hình" / "Chưa cấu hình") |
| Kỹ thuật | `sitemap.xml`, `robots.txt`, dữ liệu có cấu trúc (JSON-LD) cho Google |

**Đã có code nhưng chưa kiểm thử hết:**

- **Luồng đặt hàng đầu-cuối** (thêm vào giỏ → điền thông tin → tạo đơn → trừ tồn kho): code đã
  có đầy đủ và có kiểm tra ở phía máy chủ, nhưng người kiểm tra **không đặt đơn thật** vì điều đó
  sẽ ghi dữ liệu vào database. Trạng thái: *Có code, chưa kiểm thử*.
- **Tải ảnh lên Cloudinary**: đã kiểm tra được phần chặn bảo mật (khách thường bị từ chối `403`,
  admin thiếu tệp bị báo `400`), nhưng **không upload ảnh thật** để tránh tạo dữ liệu mới trên
  tài khoản Cloudinary. Trạng thái: *Có code, chưa kiểm thử việc upload thật*.

**Chưa triển khai (không có trong source code):**

- **Đổi mật khẩu** hoặc **sửa thông tin cá nhân** cho người dùng/admin (không có trang, không có
  chức năng). Tài liệu cũ có ghi "đổi mật khẩu mặc định" nhưng **chức năng này chưa tồn tại**.
- **Xoá vĩnh viễn sản phẩm**: hệ thống chỉ có "Ngừng bán" (ẩn sản phẩm) để bảo toàn lịch sử đơn hàng.
- **Thanh toán online tự động** (thẻ, ví điện tử, cổng thanh toán): chỉ có COD và chuyển khoản thủ công.
- **Mã giảm giá / khuyến mãi**: trường giảm giá trong đơn hàng luôn bằng 0.
- **Quên mật khẩu** (gửi email đặt lại mật khẩu): chưa có.
- **Gửi email tự động** cho khách khi đặt hàng: chưa có.

**Chưa đủ thông tin để kết luận:**

- Website **chưa có bằng chứng đã được đưa lên internet (deploy)**. Trong thư mục dự án không có
  file cấu hình deploy nào (`vercel.json`, `.vercel/`, `netlify.toml`...). `Cần xác minh`.

### A.4. Lưu ý quan trọng về dữ liệu đang có

14 sản phẩm và 4 danh mục hiện có trong database là **dữ liệu mẫu (demo)**, không phải hàng thật:

- **Giá cả, mô tả, tình trạng máy**: đều là ví dụ.
- **Ảnh sản phẩm**: được sinh tự động từ một dịch vụ tạo ảnh bằng AI
  (`https://coresg-normal.trae.ai/api/ide/v1/text_to_image?...`). Đây **không phải ảnh hàng thật**,
  và chất lượng/ tốc độ tải phụ thuộc vào dịch vụ bên ngoài. Cần thay bằng ảnh thật trước khi bán.
- **Hotline, email, địa chỉ, số tài khoản ngân hàng**: là thông tin mẫu, nằm trong
  [site.ts](file:///d:/WorkSpace/Project/linhchuplinhtinh/src/lib/site.ts) và **phải sửa lại**
  trước khi dùng thật.

---

## B. Hai cách sử dụng

### B.1. Cách 1 — Sử dụng website online (khuyến nghị cho người không biết code)

> **Cảnh báo**: tính đến ngày 2026-10-23, **chưa tìm thấy bằng chứng dự án đã được deploy lên
> internet**. Nếu người bàn giao nói website đã online, hãy yêu cầu họ cung cấp **địa chỉ website
> thật** và làm theo mục "Cách xác minh website đang hoạt động" bên dưới để tự kiểm tra.

**Cần chuẩn bị:**

1. **Địa chỉ website** (ví dụ dạng `https://<ten-mien-cua-ban>`).
2. **Tài khoản quản trị**: email và mật khẩu do người bàn giao cung cấp qua kênh bảo mật
   (không gửi qua chat công khai, không gửi kèm trong source code).
3. Một trình duyệt hiện đại (Chrome, Edge, Firefox, Safari) trên máy tính hoặc điện thoại.

**Cách truy cập:**

| Mục đích | Đường dẫn |
| --- | --- |
| Trang chủ (khách) | `https://<ten-mien-cua-ban>/` |
| Danh sách sản phẩm | `https://<ten-mien-cua-ban>/products` |
| Giỏ hàng | `https://<ten-mien-cua-ban>/cart` |
| Đăng nhập | `https://<ten-mien-cua-ban>/login` |
| **Trang quản trị** | `https://<ten-mien-cua-ban>/admin` |

**Cách xác minh website đang hoạt động** (làm lần lượt, dừng lại và báo kỹ thuật viên nếu bước nào sai):

1. Mở trang chủ → phải thấy tên "Analog House" và các khối nội dung giới thiệu.
2. Mở `/products` → phải thấy danh sách sản phẩm có ảnh và giá bằng VND.
3. Mở `/login`, đăng nhập bằng tài khoản admin → phải được chuyển tới `/admin`.
4. Nếu **chưa đăng nhập** mà mở `/admin`, website phải tự chuyển về trang đăng nhập — đó là hành vi
   đúng (bảo mật), không phải lỗi.
5. Mở `/robots.txt` và `/sitemap.xml` → phải hiển thị nội dung, và trong `sitemap.xml` phải thấy
   đúng tên miền thật của bạn (nếu thấy `localhost` thì cấu hình tên miền chưa đúng).

### B.2. Cách 2 — Chạy source code trên máy Windows

Phần này dành cho trường hợp bạn muốn **tự chạy website trên máy tính cá nhân** (để xem, để thử,
hoặc để bàn giao lại cho lập trình viên khác). Bạn sẽ dùng **PowerShell** — đây là cửa sổ dòng lệnh
có sẵn trên Windows.

#### Bước 1 — Cài Node.js

**Node.js** là "môi trường chạy" giúp máy tính hiểu được code của website.

- Dự án yêu cầu **Node.js 20 trở lên** (Next.js 15 yêu cầu tối thiểu 18.18; tài liệu triển khai
  của dự án ghi khuyến nghị **20+**).
- Máy đã kiểm tra trong ngày lập tài liệu đang dùng **Node.js v22.14.0** và **npm 10.9.2** — chạy
  tốt.
- Tải Node.js tại <https://nodejs.org> (chọn bản **LTS**). Cài xong, mở PowerShell và gõ:

```powershell
node -v
npm -v
```

Nếu hiện ra số phiên bản (ví dụ `v22.14.0`) là đã cài thành công.

#### Bước 2 — Tải source code và mở đúng thư mục

- Nhận source code qua GitHub private hoặc file nén (xem [mục E](#e-quy-trình-bàn-giao-cho-người-khác)).
- Giải nén vào một thư mục không dấu, ví dụ `D:\AnalogHouse`. **Tránh** thư mục có dấu tiếng Việt
  hoặc khoảng trắng để giảm lỗi.
- Mở **VS Code** (trình soạn thảo code miễn phí, tải tại <https://code.visualstudio.com>) →
  `File` → `Open Folder...` → chọn **đúng thư mục chứa file `package.json`**.
- Trong VS Code mở `Terminal` → `New Terminal`. Kiểm tra đang đứng đúng thư mục:

```powershell
Get-Location
```

Kết quả phải là đường dẫn chứa `package.json`.

#### Bước 3 — Cài các thư viện phụ thuộc (dependencies)

**Dependencies** là các thư viện có sẵn mà website cần để chạy. Dự án có file `package-lock.json`
(khoá chính xác phiên bản), nên dùng lệnh sau:

```powershell
npm ci
```

- `npm ci` cài **đúng** các phiên bản đã ghi trong `package-lock.json` — ổn định và tái lập được.
- Nếu `npm ci` báo lỗi, có thể dùng tạm `npm install` (linh hoạt hơn nhưng kém chính xác hơn).
- Trong quá trình cài, script `postinstall` sẽ tự chạy `prisma generate` (chuẩn bị thư viện làm
  việc với database).

#### Bước 4 — Tạo file cấu hình `.env`

File `.env` chứa các **biến môi trường** — tức các "chìa khoá cấu hình" như mật khẩu database. File
này **không** được đưa lên GitHub (đã có trong `.gitignore`).

```powershell
copy .env.example .env
notepad .env
```

Sau đó điền các giá trị thật theo bảng ở [mục C](#c-danh-sách-biến-môi-trường).

> **Tuyệt đối không** dán mật khẩu/chuỗi bí mật vào `HUONG_DAN_CHAY_VA_BAN_GIAO.md` hay bất kỳ tài
> liệu nào được chia sẻ. Chuyển bí mật qua kênh riêng (xem [mục E](#e-quy-trình-bàn-giao-cho-người-khác)).

#### Bước 5 — Chuẩn bị database (Neon PostgreSQL)

Database là nơi lưu sản phẩm và đơn hàng.

1. Tạo tài khoản miễn phí tại <https://neon.tech> và tạo một project.
2. Vào **Dashboard → Connection string**, chọn định dạng **Prisma** (hoặc Node.js), sao chép chuỗi
   kết nối. Chuỗi này có dạng:

   ```
   postgresql://<NGUOI_DUNG>:<MAT_KHAU>@<HOST>/<TEN_DB>?sslmode=require
   ```

3. Dán vào biến `DATABASE_URL` trong file `.env` (giữ nguyên dấu ngoặc kép).

**Tạo bảng trong database:**

```powershell
npx prisma migrate deploy
```

Lệnh này áp toàn bộ "bản thiết kế bảng" có sẵn trong thư mục `prisma/migrations` lên database
(không tạo migration mới, không xoá dữ liệu).

**Nạp dữ liệu mẫu (danh mục, thương hiệu, 14 sản phẩm, tài khoản admin):**

```powershell
npm run db:seed
```

> **CẢNH BÁO VỀ DỮ LIỆU**: `npm run db:seed` **ghi đè** thông tin sản phẩm/danh mục và **đặt lại
> mật khẩu** của tài khoản admin và tài khoản khách demo. **Không chạy lệnh này trên database
> production đang có dữ liệu thật**. Nếu chưa chắc chắn, hãy sao lưu trước (xem [mục F](#f-sao-lưu-khôi-phục-và-bảo-trì)).

Trong quá trình chạy trên máy kiểm tra, Prisma có in thêm dòng
`TRAE Sandbox Error: hit restricted` (do môi trường soạn thảo chặn ghi bộ nhớ tạm của Prisma).
Đây **không phải lỗi của dự án** — lệnh vẫn báo database đã cập nhật đúng.

#### Bước 6 — Cấu hình Cloudinary (tuỳ chọn)

Chỉ làm bước này nếu bạn muốn quản trị viên **tải ảnh lên trực tiếp** từ trang quản trị.
Nếu bỏ qua, vẫn có thể dán **URL ảnh** thủ công vào ô "URL ảnh" trong form sản phẩm.

1. Tạo tài khoản tại <https://cloudinary.com>.
2. Lấy 3 giá trị: **Cloud name**, **API key**, **API secret**.
3. Điền vào 3 biến `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` trong `.env`.
4. Kiểm tra: mở website → `/admin/settings` → mục "Tải ảnh sản phẩm" phải hiện badge **"Đã cấu hình"**.

#### Bước 7 — Khởi động website

```powershell
npm run dev
```

Khi thấy dòng `Ready` hoặc `Local: http://localhost:3000`, hãy mở trình duyệt và truy cập:

```
http://localhost:3000
```

Trang quản trị: `http://localhost:3000/admin`

**Dừng website**: quay lại cửa sổ PowerShell đang chạy và bấm `Ctrl` + `C`, sau đó gõ `Y` nếu được
hỏi. Không đóng cửa sổ bằng nút X nếu muốn tắt êm.

#### Bước 8 — Lệnh hữu ích khác

| Lệnh | Công dụng |
| --- | --- |
| `npm run dev` | Chạy website ở chế độ phát triển (tự làm mới khi sửa code) |
| `npm run build` | Kiểm tra và đóng gói bản chạy thật (production build) |
| `npm start` | Chạy bản đã đóng gói (phải chạy `npm run build` trước) |
| `npm run lint` | Kiểm tra lỗi phong cách code |
| `npm run typecheck` | Kiểm tra lỗi kiểu dữ liệu TypeScript |
| `npm test` | Chạy 42 bài kiểm tra tự động |
| `npm run db:studio` | Mở giao diện xem/sửa dữ liệu database trên trình duyệt |
| `npx prisma migrate status` | Xem database đã cập nhật đúng bản thiết kế chưa |

#### Bước 9 — Lỗi thường gặp

| Hiện tượng | Nguyên nhân thường gặp | Cách xử lý |
| --- | --- | --- |
| `'npm' is not recognized` | Chưa cài Node.js, hoặc chưa mở lại PowerShell sau khi cài | Cài Node.js rồi **mở lại** PowerShell |
| `Cấu hình môi trường chưa hợp lệ: - DATABASE_URL: DATABASE_URL là bắt buộc` | Chưa có file `.env` hoặc thiếu `DATABASE_URL` | Tạo `.env` từ `.env.example` và điền đủ giá trị |
| `Thiếu biến môi trường DATABASE_URL...` khi build | Giống trên | Điền `DATABASE_URL` vào `.env` |
| `Can't reach database server` / `P1001` | Sai chuỗi kết nối, thiếu `?sslmode=require`, hoặc database Neon đang tạm ngưng | Sao chép lại connection string từ Neon, thêm `?sslmode=require` |
| Ảnh sản phẩm không hiện | Ảnh mẫu lấy từ dịch vụ AI bên ngoài có thể bị chặn hoặc tải chậm | Không phải lỗi nghiêm trọng; thay bằng ảnh thật qua Cloudinary hoặc URL ảnh |
| `Port 3000 is already in use` | Đã có chương trình khác dùng cổng 3000 | Tắt chương trình đó, hoặc chạy `npm run dev -- -p 3001` rồi truy cập cổng 3001 |
| Vào `/admin` bị chuyển về `/login` | Bạn chưa đăng nhập, hoặc tài khoản không phải quyền ADMIN | Đăng nhập bằng tài khoản admin |
| Upload ảnh báo "Chưa cấu hình Cloudinary" | Chưa khai báo đủ 3 biến Cloudinary | Xem [Bước 6](#bước-6--cấu-hình-cloudinary-tuỳ-chọn) |

---

## C. Danh sách biến môi trường

Bảng dưới đây liệt kê **các biến thực sự được dùng trong source code** (đã kiểm tra bằng cách tìm
`process.env` trong toàn bộ dự án). Giá trị cụ thể **không** được ghi vào tài liệu này.

| Tên biến | Chức năng | Bắt buộc? | Lấy giá trị từ đâu | Cần ở đâu |
| --- | --- | --- | --- | --- |
| `DATABASE_URL` | Chuỗi kết nối tới database PostgreSQL | **Bắt buộc** | Neon (hoặc PostgreSQL tương thích) | Local **và** Production |
| `AUTH_SECRET` | Chuỗi bí mật dùng để ký phiên đăng nhập (session). Tối thiểu 16 ký tự; khuyến nghị 32+ ký tự ngẫu nhiên | **Bắt buộc** | Tự sinh bằng lệnh `npx auth secret` | Local **và** Production |
| `NEXT_PUBLIC_SITE_URL` | Địa chỉ công khai của website; dùng cho thẻ chia sẻ mạng xã hội, `sitemap.xml`, liên kết chuẩn (canonical) | Nên có. Nếu thiếu, code tự dùng `http://localhost:3000` | Tên miền thật của bạn | Local (dùng localhost) **và** Production (dùng tên miền thật) |
| `ADMIN_EMAIL` | Email của tài khoản quản trị do lệnh `npm run db:seed` tạo ra | Tuỳ chọn (mặc định `admin@analoghouse.vn`) | Bạn tự đặt | Chỉ cần ở Local/ khi chạy seed |
| `ADMIN_PASSWORD` | Mật khẩu tài khoản quản trị do seed tạo (tối thiểu 8 ký tự) | Tuỳ chọn | Bạn tự đặt | Chỉ cần ở Local/ khi chạy seed |
| `CLOUDINARY_CLOUD_NAME` | Tên "cloud" trên Cloudinary | Tuỳ chọn (cần đủ cả 3 biến để bật upload) | Cloudinary Dashboard | Local **và** Production (nếu muốn upload ảnh) |
| `CLOUDINARY_API_KEY` | Khoá công khai của Cloudinary | Tuỳ chọn | Cloudinary Dashboard | Local **và** Production |
| `CLOUDINARY_API_SECRET` | Khoá bí mật của Cloudinary — **chỉ tồn tại ở server** | Tuỳ chọn | Cloudinary Dashboard | Local **và** Production |

**Ghi chú về tên biến xác thực:** dự án dùng **Auth.js v5**, thư viện này đọc biến **`AUTH_SECRET`**
(đã xác minh trong [env.ts](file:///d:/WorkSpace/Project/linhchuplinhtinh/src/server/env.ts) — schema
bắt buộc `AUTH_SECRET` dài ít nhất 16 ký tự).

**Biến thừa cần lưu ý:** file `.env` hiện tại trên máy có thêm biến `BETTER_AUTH_SECRET`. Biến này
**không được source code sử dụng** (dự án không dùng thư viện Better Auth). Có thể xoá để tránh
nhầm lẫn. `Cần xác minh` nguồn gốc của biến này.

**Không** đặt tiền tố `NEXT_PUBLIC_` cho các biến chứa bí mật (ví dụ `AUTH_SECRET`), vì mọi biến có
tiền tố đó sẽ bị đưa xuống trình duyệt của khách.

---

## D. Hướng dẫn sử dụng website

> Các thao tác dưới đây dựa trên giao diện và code thực tế. Những thao tác **đã được chạy thử** được
> ghi rõ; những thao tác chỉ *có giao diện* nhưng chưa chạy thử đều được đánh dấu.

### D.1. Đăng nhập và đăng xuất — *Đã xác minh*

1. Mở `/login`.
2. Nhập **email** và **mật khẩu**, bấm nút đăng nhập.
3. Nếu đúng, bạn được đưa về trang tài khoản (`/account`) hoặc trang quản trị (`/admin`) nếu là admin.
4. **Đăng xuất**: vào `/account` (hoặc `/admin`) và bấm nút **Đăng xuất**.
5. Nếu nhập sai, website chỉ báo chung "Email hoặc mật khẩu không đúng." — đây là chủ đích, để
   không tiết lộ email nào tồn tại trong hệ thống.

**Đăng ký tài khoản khách**: mở `/register`, nhập họ tên, email, số điện thoại (không bắt buộc),
mật khẩu (tối thiểu 8 ký tự, phải có ít nhất 1 chữ cái và 1 chữ số) rồi xác nhận mật khẩu. Tài
khoản tạo ra **luôn** là khách hàng — không thể tự nâng quyền quản trị.

> Tài khoản demo do seed tạo ra được ghi trong [.env.example](file:///d:/WorkSpace/Project/linhchuplinhtinh/.env.example)
> và [README.md](file:///d:/WorkSpace/Project/linhchuplinhtinh/README.md). **Hãy đổi mật khẩu này
> trước khi dùng thật** — nhưng lưu ý: dự án **chưa có chức năng đổi mật khẩu trong giao diện**,
> nên việc đổi phải do lập trình viên thực hiện (xem [mục F.4](#f4-việc-người-không-biết-code-có-thể-tự-làm-và-việc-nên-nhờ-developer)).

### D.2. Mở trang quản trị — *Đã xác minh*

- Đường dẫn: `http://localhost:3000/admin` (khi chạy trên máy) hoặc `https://<ten-mien>/admin`.
- Bắt buộc đăng nhập bằng tài khoản có vai trò **ADMIN**.
- Nếu chưa đăng nhập → tự chuyển về `/login?next=/admin`.
- Nếu đăng nhập bằng tài khoản khách → tự chuyển về `/account`.
- Menu bên trái gồm: **Sản phẩm**, **Đơn hàng**, **Danh mục**, **Cấu hình**.

### D.3. Thêm / sửa sản phẩm — *Đã xác minh (trang hiển thị đúng)*

**Thêm mới:** `/admin/products` → bấm **Thêm sản phẩm** → điền form tại `/admin/products/new`.

| Trường | Ghi chú |
| --- | --- |
| Tên sản phẩm | Bắt buộc. Đường dẫn (slug) sẽ được **tự sinh** từ tên, trừ khi bạn tự sửa. |
| SKU | Mã nội bộ của sản phẩm, bắt buộc, phải **không trùng** với sản phẩm khác. |
| Giá bán / Giá so sánh | Nhập theo đồng VND. Giá so sánh (giá gạch) dùng để hiện phần trăm giảm giá. |
| Danh mục / Thương hiệu | Chọn từ danh sách. Nếu chưa có danh mục nào, form sẽ cảnh báo và cần tạo danh mục trước. |
| Loại sản phẩm / Tình trạng | Chọn trong danh sách (máy film, digital, compact, lens, phụ kiện, film...). |
| Thông số máy ảnh | Nhập dạng "Tên thông số: giá trị", mỗi dòng một thông số. |
| Tình trạng ngoại hình / hoạt động | Mô tả bằng chữ để khách đọc. |
| Phụ kiện đi kèm | Ví dụ: thân máy, lens, nắp, dây đeo. |
| Số lượng tồn kho | Số nguyên, không âm. |
| Hiển thị / Nổi bật | Bật để đăng bán công khai / để hiện ở mục nổi bật. |
| URL ảnh | Mỗi dòng một đường dẫn ảnh, **tối đa 12 ảnh**. |

**Sửa sản phẩm:** `/admin/products` → bấm **Sửa** ở dòng tương ứng → `/admin/products/[id]`.

### D.4. Ẩn (ngừng bán) và khôi phục sản phẩm — *Đã xác minh*

- Trong `/admin/products`, mỗi dòng có nút **Ngừng bán**. Khi bấm, hệ thống hỏi xác nhận, sau đó
  sản phẩm sẽ **bị ẩn khỏi cửa hàng** nhưng **vẫn giữ lịch sử trong các đơn hàng cũ**.
- Nút **Khôi phục** sẽ đưa sản phẩm trở lại bán.
- **Không có nút xoá vĩnh viễn** — đây là chủ đích để tránh mất dữ liệu đơn hàng.

### D.5. Sửa nhanh tồn kho — *Đã xác minh*

- Trong `/admin/products`, cột tồn kho có ô nhập số và nút **Lưu** để cập nhật nhanh số lượng.

### D.6. Upload ảnh hoặc nhập URL ảnh — *Có code, chưa kiểm thử việc upload thật*

- **Cách 1 — Tải ảnh lên**: trong form sản phẩm, bấm nút tải ảnh và chọn file từ máy.
  - Chỉ nhận ảnh **JPG, PNG, WEBP, AVIF**; dung lượng **tối đa 5MB**.
  - Ảnh được lưu trên Cloudinary trong thư mục `analog-house/products`.
  - **Bắt buộc** đã cấu hình đủ 3 biến Cloudinary, nếu không sẽ báo lỗi "Chưa cấu hình Cloudinary".
  - Kiểm tra trạng thái tại `/admin/settings`.
- **Cách 2 — Dán URL ảnh**: nhập trực tiếp đường dẫn ảnh (bắt đầu bằng `https://`) vào ô **URL ảnh**,
  mỗi dòng một ảnh. Cách này hoạt động ngay cả khi chưa có Cloudinary.
- Nếu ô URL ảnh để trống, website sẽ hiển thị một **ảnh thay thế** màu kem với dòng chữ
  "Ảnh đang được cập nhật" (tệp `public/placeholders/camera.svg`).

### D.7. Quản lý đơn hàng — *Đã xác minh (trang hiển thị đúng)*

**Danh sách đơn:** `/admin/orders` — có ô tìm kiếm và lọc theo trạng thái.

**Chi tiết đơn:** `/admin/orders/[id]`, gồm các khối:

- **Xử lý đơn hàng**: các nút chuyển trạng thái. Luồng trạng thái được kiểm soát chặt:
  - `Chờ xác nhận` → `Đã xác nhận` hoặc `Đã huỷ`
  - `Đã xác nhận` → `Đang giao` hoặc `Đã huỷ`
  - `Đang giao` → `Hoàn tất` hoặc `Đã huỷ`
  - `Hoàn tất` và `Đã huỷ` là **trạng thái cuối**, không chuyển tiếp được nữa.
  - Không thể "nhảy cóc" (ví dụ từ Chờ xác nhận sang Hoàn tất).
- **Thanh toán**: chọn trạng thái `Chưa thanh toán` / `Đã thanh toán` / `Đã hoàn tiền` /
  `Thanh toán lỗi` rồi bấm **Lưu**.
- **Thông tin giao hàng** và **Lịch sử** (thời điểm tạo, xác nhận, hoàn tất, huỷ).

> **Lưu ý đã kiểm tra**: bảng sản phẩm trong trang đơn hàng hiển thị **tên, mã SKU, đơn giá × số
> lượng và thành tiền** — **không hiển thị ảnh sản phẩm**. Đây là thiết kế hiện tại của dự án
> (đơn hàng chỉ lưu "ảnh chụp" thông tin tên/SKU/giá tại thời điểm đặt, không lưu ảnh), không phải
> lỗi tải ảnh.

### D.8. Quản lý danh mục và thương hiệu — *Đã xác minh (trang hiển thị đúng)*

- `/admin/categories`:
  - Thêm danh mục mới hoặc sửa danh mục có sẵn (tên, mô tả, thứ tự hiển thị, đường dẫn tự sinh).
  - Thêm **thương hiệu** mới. Lưu ý: giao diện ghi rõ **không thể sửa/xoá thương hiệu** để bảo toàn
    dữ liệu sản phẩm.

### D.9. Cấu hình cửa hàng — *Đã xác minh*

`/admin/settings` gồm 3 phần:

1. **Phí vận chuyển**: nhập phí cố định (VND) và mức tiền để được **miễn phí vận chuyển**, rồi Lưu.
   Giá trị này được dùng ngay ở trang giỏ hàng và trang thanh toán.
2. **Thông tin cửa hàng**: chỉ để **xem** — muốn sửa phải nhờ lập trình viên sửa file
   [site.ts](file:///d:/WorkSpace/Project/linhchuplinhtinh/src/lib/site.ts).
3. **Tải ảnh sản phẩm**: badge cho biết Cloudinary đã cấu hình hay chưa.

### D.10. Thao tác của khách — *Có code, chưa kiểm thử đầu-cuối*

- **Giỏ hàng**: giỏ được lưu **trên trình duyệt của khách** (không lưu trên server). Nếu khách xoá
  dữ liệu trình duyệt hoặc dùng máy khác, giỏ hàng sẽ trống.
- **Đặt hàng**: khách điền tên người nhận, số điện thoại (định dạng Việt Nam, ví dụ `0901234567`),
  email (không bắt buộc), địa chỉ đầy đủ (tối thiểu 10 ký tự), ghi chú (không bắt buộc) và chọn
  COD hoặc chuyển khoản.
- Sau khi đặt, khách được đưa tới trang "Đặt hàng thành công" kèm mã đơn dạng `AH20261023-XXXXXX`.
- **Tra cứu đơn**: khách vãng lai vào `/account/orders`, nhập **mã đơn + số điện thoại đã dùng khi
  đặt** để xem chi tiết.

---

## E. Quy trình bàn giao cho người khác

### E.1. Bàn giao source code

Chọn **một** trong hai cách:

- **GitHub private** (khuyến nghị): tạo repository ở chế độ **Private**, mời tài khoản người nhận
  làm cộng tác viên, rồi đẩy code lên.
- **File nén an toàn**: nén source code **sau khi đã chắc chắn không có file `.env`**, `.env.local`,
  `node_modules`, `.next` trong gói nén. Gửi qua dịch vụ lưu trữ có mật khẩu (ví dụ Google Drive
  giới hạn quyền) và gửi mật khẩu mở nén qua kênh khác.

> **Quan trọng**: trong `.gitignore` của dự án đã loại trừ `.env`, `.env.*`, `node_modules`, `.next`
> — nhưng nếu bạn nén thủ công, hãy **tự kiểm tra lại** trước khi gửi.
>
> **Lưu ý trạng thái hiện tại**: tại thời điểm kiểm tra, thư mục dự án **chưa được khởi tạo Git**
> (không có thư mục `.git`). Vì vậy **toàn bộ lịch sử phát triển chưa được lưu lại**. Người nhận
> sẽ chỉ nhận được trạng thái code hiện tại, không có lịch sử thay đổi.

### E.2. Bàn giao quyền sở hữu các dịch vụ

| Dịch vụ | Việc cần làm |
| --- | --- |
| **Tên miền (domain)** | Chuyển quyền quản lý, hoặc cập nhật thông tin chủ sở hữu; cập nhật lại DNS nếu đổi nhà cung cấp. |
| **Hosting** (ví dụ Vercel) | Mời tài khoản người nhận vào team với quyền **Owner**, hoặc chuyển hẳn project. |
| **Neon (database)** | Mời người nhận vào organization/project với quyền quản trị, hoặc tạo project mới rồi chuyển dữ liệu (xem E.3). |
| **Cloudinary (ảnh)** | Chuyển quyền sở hữu tài khoản, hoặc tạo tài khoản mới và **tải lại toàn bộ ảnh** rồi cập nhật URL. |

> Không xác định được từ source code những tài khoản dịch vụ nào đã tồn tại. `Cần xác minh` bằng
> cách trao đổi trực tiếp với người bàn giao.

### E.3. Bàn giao database và dữ liệu

**Nhận bàn giao source code KHÔNG có nghĩa là nhận được dữ liệu.** Database nằm ở nơi khác (Neon).
Cần làm rõ một trong hai:

- **Cách A — Chuyển quyền project Neon** cho người nhận (đơn giản nhất, giữ nguyên dữ liệu).
- **Cách B — Chuyển dữ liệu sang project Neon mới**: xuất dữ liệu từ project cũ rồi nhập vào project
  mới (nhờ lập trình viên; xem gợi ý ở [mục F.1](#f1-sao-lưu-database)).

Sau khi có database mới, phải cập nhật lại biến `DATABASE_URL` ở mọi nơi (file `.env` khi chạy
local, và biến môi trường trên hosting).

### E.4. Tạo hoặc chuyển quyền tài khoản admin

1. **Xác nhận** tài khoản admin hiện có (email nào, ai đang giữ mật khẩu).
2. **Không** gửi mật khẩu qua kênh công khai. Nên tạo mật khẩu mới và gửi qua kênh bảo mật.
3. Vì dự án **chưa có chức năng đổi mật khẩu trong giao diện**, việc đổi mật khẩu admin cần:
   - đặt `ADMIN_EMAIL` / `ADMIN_PASSWORD` trong `.env` rồi chạy lại `npm run db:seed`
     (**cách này cũng ghi đè dữ liệu sản phẩm mẫu — chỉ làm trên môi trường demo**), hoặc
   - nhờ lập trình viên đổi trực tiếp trong database.
4. Thu hồi quyền truy cập của người bàn giao cũ sau khi đã xác nhận chuyển giao xong.

### E.5. Chuyển biến môi trường qua kênh bảo mật

- Danh sách biến cần chuyển: xem [mục C](#c-danh-sách-biến-môi-trường).
- **Kênh bảo mật** gợi ý: trình quản lý mật khẩu có tính năng chia sẻ (1Password, Bitwarden), hoặc
  file mã hoá gửi kèm mật khẩu riêng.
- **Không** gửi bí mật qua GitHub, Zalo/Messenger công khai, email không mã hoá, hoặc chú thích
  trong tài liệu.

### E.6. Sao lưu trước khi chuyển đổi

Trước khi đổi database, đổi hosting, hoặc đổi tài khoản Cloudinary: **sao lưu database và ảnh**
(xem [mục F](#f-sao-lưu-khôi-phục-và-bảo-trì)). Đây là bước bắt buộc, không được bỏ qua.

### E.7. Kiểm tra website sau bàn giao

Sau khi người nhận tự vận hành được, hãy cùng nhau kiểm tra:

- [ ] Mở được trang chủ và danh sách sản phẩm.
- [ ] Đăng nhập được vào `/admin` bằng tài khoản mới.
- [ ] Thêm thử một sản phẩm và thấy nó xuất hiện ở trang bán.
- [ ] Ngừng bán sản phẩm đó và thấy nó biến mất khỏi trang bán.
- [ ] Mở được một đơn hàng cũ và thấy đúng thông tin.
- [ ] `/sitemap.xml` hiển thị đúng tên miền thật.
- [ ] Không còn bí mật nào nằm trong repository hoặc tài liệu.

---

## F. Sao lưu, khôi phục và bảo trì

> **Nguyên tắc chung**: sao lưu là việc *bắt buộc* trước mọi thay đổi lớn. Nếu bạn không chắc một
> lệnh có an toàn hay không — **đừng chạy**, hãy hỏi lập trình viên.

### F.1. Sao lưu database

Dự án dùng PostgreSQL trên **Neon**, và có sẵn công cụ `pg_dump`/`pg_restore` (thường đi kèm khi
cài PostgreSQL). Hai cách:

1. **Dùng tính năng của Neon (khuyến nghị cho người không biết code)**: Neon hỗ trợ
   **point-in-time restore** (khôi phục về một thời điểm) và tạo **branch** (nhánh dữ liệu) để thử
   nghiệm an toàn. Vào Neon Dashboard để bật và kiểm tra định kỳ.
   `Cần xác minh` cấu hình sao lưu hiện tại của project, vì thông tin này nằm trong Neon chứ không
   nằm trong source code.
2. **Xuất file sao lưu bằng `pg_dump`** (nhờ lập trình viên, hoặc tự làm khi đã quen):

   ```powershell
   pg_dump "<CHUOI_KET_NOI_DATABASE>" --no-owner --no-privileges --file "backup-analog-house.sql"
   ```

   - Lệnh này **chỉ đọc** dữ liệu và ghi ra file — **không** làm thay đổi database.
   - **Tuyệt đối không** đưa file `.sql` chứa dữ liệu thật lên GitHub.
   - `pg_restore` (khôi phục) **ghi đè** dữ liệu hiện có → chỉ dùng khi thực sự cần và phải sao lưu
     bản hiện tại trước.

### F.2. Lưu trữ ảnh và kiểm tra URL ảnh

- Ảnh sản phẩm nằm ở **Cloudinary** (thư mục `analog-house/products`) hoặc ở bất kỳ địa chỉ URL nào
  bạn dán vào ô "URL ảnh".
- Kiểm tra định kỳ: mở vài trang sản phẩm, xem ảnh có hiển thị không.
- Nếu ảnh lấy từ dịch vụ miễn phí bên ngoài (như ảnh demo hiện tại), ảnh có thể **biến mất bất cứ
  lúc nào**. Muốn bền vững, hãy tải ảnh lên Cloudinary của bạn rồi dán URL Cloudinary vào sản phẩm.
- **Sao lưu ảnh**: tải toàn bộ ảnh từ Cloudinary về máy theo định kỳ (Cloudinary có công cụ tải hàng
  loạt), hoặc ghi lại danh sách URL.

### F.3. Cập nhật thư viện (dependencies) có kiểm soát

Chỉ nên cập nhật khi có lý do (bảo mật, sửa lỗi), và luôn theo quy trình:

```powershell
# 1. Tạo nhánh mới nếu dùng Git
git checkout -b chore/update-deps

# 2. Xem thư viện nào lỗi thời
npm outdated

# 3. Cập nhật (nhờ lập trình viên quyết định có nên dùng --latest hay không)
npm update

# 4. Bắt buộc chạy lại toàn bộ kiểm tra trước khi nhận
npm run lint
npm run typecheck
npm test
npm run build
```

Cả 4 lệnh phải báo thành công (không có dòng "error", kết thúc bình thường) mới được đưa lên chạy thật.

### F.4. Việc người không biết code có thể tự làm và việc nên nhờ developer

**Bạn có thể tự làm:**

- Đăng nhập trang quản trị và cập nhật sản phẩm: tên, giá, mô tả, tồn kho, ảnh.
- Ngừng bán / khôi phục sản phẩm.
- Xử lý đơn hàng: xác nhận, chuyển sang đang giao, hoàn tất, huỷ; cập nhật trạng thái thanh toán.
- Điều chỉnh phí vận chuyển tại `/admin/settings`.
- Thêm danh mục, thêm thương hiệu.
- Sao lưu dữ liệu bằng công cụ có sẵn của Neon.
- Chạy website trên máy tính bằng các lệnh trong tài liệu này.

**Nên nhờ developer:**

- Đổi mật khẩu tài khoản admin (chưa có giao diện).
- Sửa hotline, email, địa chỉ, thông tin ngân hàng (nằm trong `src/lib/site.ts`).
- Thay đổi cấu trúc database, tạo migration mới.
- Cập nhật các thư viện lớn (Next.js, Prisma...).
- Đưa website lên hosting (deploy) và cấu hình tên miền.
- Thêm chức năng mới (đổi mật khẩu, mã giảm giá, gửi email, thanh toán online...).
- Xử lý sự cố database hoặc khôi phục dữ liệu từ bản sao lưu.

---

## G. Checklist bàn giao

Đánh dấu `[x]` vào ô khi hoàn tất.

### G.1. Source code và tài liệu

- [ ] Source code đã được đẩy lên GitHub **private** (hoặc đóng gói file nén an toàn).
- [ ] Đã kiểm tra gói bàn giao **không chứa** `.env`, `.env.local`, `node_modules`, `.next`.
- [ ] Người nhận đã có quyền truy cập source code.
- [ ] Đã gửi kèm `README.md`, `SECURITY.md`, `docs/DEPLOYMENT.md`, và 2 tài liệu bàn giao này.
- [ ] Đã thống nhất: dự án **chưa có Git history** (nếu vẫn chưa khởi tạo Git).

### G.2. Dịch vụ và tài khoản

- [ ] Quyền quản lý **tên miền** đã được chuyển hoặc xác nhận.
- [ ] Quyền truy cập **hosting** đã được chuyển (quyền Owner cho người nhận).
- [ ] Quyền truy cập **Neon** đã được chuyển.
- [ ] Quyền truy cập **Cloudinary** đã được chuyển (nếu có dùng).
- [ ] Không còn tài khoản dịch vụ nào chỉ một mình người bàn giao cũ nắm giữ.

### G.3. Dữ liệu

- [ ] **Database đã được sao lưu** (bản sao lưu có ngày giờ rõ ràng).
- [ ] **Ảnh đã được sao lưu** hoặc đã ghi lại danh sách URL.
- [ ] Đã xác nhận cách bàn giao database (chuyển quyền project Neon **hoặc** chuyển dữ liệu).
- [ ] `DATABASE_URL` mới đã được cập nhật ở local và trên hosting.
- [ ] Đã kiểm tra: số lượng sản phẩm và đơn hàng hiển thị đúng sau khi chuyển.

### G.4. Tài khoản admin

- [ ] Đã xác định rõ tài khoản admin hiện tại (email).
- [ ] Mật khẩu admin mới đã được tạo và **đã đổi khỏi giá trị mặc định demo**.
- [ ] Mật khẩu mới đã được gửi qua **kênh bảo mật**.
- [ ] Quyền truy cập admin của người bàn giao cũ đã được **thu hồi**.

### G.5. Biến môi trường

- [ ] Danh sách biến cần thiết đã được chuyển (theo [mục C](#c-danh-sách-biến-môi-trường)).
- [ ] `AUTH_SECRET` đã được tạo mới (không dùng lại giá trị cũ).
- [ ] `NEXT_PUBLIC_SITE_URL` đã đặt đúng tên miền thật.
- [ ] Các bí mật **không** xuất hiện trong GitHub, tài liệu, hay ảnh chụp màn hình.
- [ ] Đã xử lý biến thừa `BETTER_AUTH_SECRET` (xoá nếu không dùng).

### G.6. Kiểm tra sau bàn giao

- [ ] Trang chủ, danh sách sản phẩm, chi tiết sản phẩm hiển thị đúng.
- [ ] Đăng nhập `/admin` bằng tài khoản mới thành công.
- [ ] Thêm/sửa/ngừng bán một sản phẩm thành công.
- [ ] Upload ảnh hoạt động (hoặc đã ghi rõ là chưa kiểm thử).
- [ ] Mở được một đơn hàng cũ và chuyển trạng thái thành công.
- [ ] `/robots.txt` và `/sitemap.xml` hiển thị đúng tên miền thật.
- [ ] Website hiển thị tốt trên **điện thoại** (thu nhỏ cửa sổ trình duyệt để thử).

### G.7. Nội dung cần thay trước khi dùng thật

- [ ] Hotline, email, địa chỉ, giờ làm việc trong `src/lib/site.ts` đã được thay bằng thông tin thật.
- [ ] Thông tin tài khoản ngân hàng trong `src/lib/site.ts` đã được thay bằng số thật.
- [ ] Liên kết Facebook/Instagram đã được thay bằng trang thật.
- [ ] **Toàn bộ ảnh demo** đã được thay bằng ảnh hàng thật.
- [ ] Giá và mô tả sản phẩm demo đã được thay bằng dữ liệu thật.
- [ ] Phí vận chuyển và mức miễn phí vận chuyển tại `/admin/settings` đã được đặt đúng thực tế.
- [ ] Chính sách vận chuyển / đổi trả / bảo hành đã được rà soát lại nội dung cho phù hợp.
