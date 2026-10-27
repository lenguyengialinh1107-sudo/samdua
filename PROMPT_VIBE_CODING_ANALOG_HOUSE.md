Prompt Vibe Coding — Website mua bán máy film & máy ảnh digital
Cách dùng: Mở công cụ vibe coding (ví dụ Cursor, Windsurf, Claude Code hoặc công cụ tương tự), mở một thư mục dự án mới rồi dán toàn bộ prompt bên dưới. Nếu công cụ làm theo từng bước, yêu cầu nó hoàn thành từng phase và chạy kiểm tra trước khi chuyển phase tiếp theo.

PROMPT CHÍNH
Bạn là Senior Full-Stack Engineer kiêm UI/UX Designer. Hãy xây dựng một website thương mại điện tử hoàn chỉnh để mua bán máy ảnh film, máy ảnh digital, máy ảnh compact, lens và phụ kiện nhiếp ảnh. Tên thương hiệu tạm thời: Analog House (đặt tên và nội dung ở một nơi dễ đổi). Thị trường: Việt Nam; ngôn ngữ giao diện mặc định là tiếng Việt; tiền tệ VND.
1. Mục tiêu và nguyên tắc làm việc
- Tạo sản phẩm chạy được thực tế, không chỉ là landing page hoặc mockup.
- Có frontend, backend/API, database, xác thực, quản trị sản phẩm và quy trình đặt hàng.
- Ưu tiên kiến trúc đơn giản, chi phí thấp, dễ học, dễ deploy cho sinh viên.
- Không dựng chức năng giả rồi ghi là đã hoàn thành. Nếu tích hợp bên thứ ba cần key, hãy tạo adapter, .env.example và hướng dẫn cấu hình.
- Trước khi code: kiểm tra thư mục hiện tại, nêu kế hoạch ngắn, đề xuất cấu trúc thư mục rồi triển khai. Nếu thư mục đã có code, không xóa hoặc ghi đè mù quáng.
- Chia việc thành các phase nhỏ; sau mỗi phase chạy lint, typecheck, test hoặc build phù hợp, sửa lỗi trước khi tiếp tục.
- Không để lộ secret, API key, mật khẩu, connection string hay thông tin cá nhân trong client bundle hoặc Git.
- Không dùng dữ liệu/hình ảnh có bản quyền một cách tùy tiện. Dùng ảnh mẫu hợp pháp, ảnh placeholder hoặc ảnh được cung cấp; cho phép thay ảnh trong trang admin.
- Mọi nội dung, tên sản phẩm và giá demo phải được đánh dấu rõ là dữ liệu mẫu.
2. Công nghệ yêu cầu
Dùng một monorepo TypeScript với cấu trúc dễ hiểu.

Frontend
- Next.js App Router, TypeScript, React.
- Tailwind CSS và shadcn/ui hoặc các component accessible tương đương.
- React Hook Form + Zod cho form và validation.
- Dùng Server Components mặc định; chỉ dùng Client Components khi cần tương tác.
- Responsive tốt trên mobile, tablet và desktop.
- Tối ưu SEO: metadata, Open Graph, sitemap, robots, URL sản phẩm dễ đọc.
Backend — không sử dụng Supabase
- Dùng Next.js Route Handlers / Server Actions làm backend Node.js tích hợp trong cùng ứng dụng; không cần tạo Express server riêng trừ khi có lý do kỹ thuật rõ ràng.
- Dùng PostgreSQL làm database và Prisma ORM để truy vấn, quản lý schema, migrations và seed data.
- Ưu tiên Neon PostgreSQL làm database managed để dễ deploy; phải giữ khả năng chạy PostgreSQL local hoặc dùng một nhà cung cấp PostgreSQL tương thích khác.
- Dùng Auth.js (hoặc giải pháp authentication tương thích Next.js được duy trì tốt) cho đăng nhập/đăng xuất và session. Không tự viết cơ chế lưu mật khẩu. Mật khẩu phải được hash bằng thuật toán phù hợp nếu dùng credentials provider.
- Dùng Cloudinary cho upload và lưu ảnh sản phẩm nếu cần dịch vụ ảnh bên ngoài; tạo adapter rõ ràng và .env.example. Nếu chưa cấu hình Cloudinary, hỗ trợ ảnh demo/placeholder trong môi trường local, nhưng không giả vờ upload production đã hoạt động.
- Tất cả thao tác nhạy cảm phải chạy server-side; xác thực session và kiểm tra role ở mọi route/action cần quyền.
- Tạo lớp service/repository để tách nghiệp vụ khỏi UI và tránh truy vấn database rải rác.
- Không sử dụng Supabase dưới bất kỳ hình thức nào: không Supabase Database, Auth, Storage, SDK, RLS hoặc biến môi trường liên quan.
- Không âm thầm dùng mock database trong production. Nếu database chưa cấu hình, báo lỗi cấu hình rõ ràng.
Các thư viện bổ trợ
- prisma và @prisma/client cho database.
- next-auth / Auth.js theo phiên bản tương thích với Next.js hiện hành.
- zod, react-hook-form.
- SDK Cloudinary chỉ khi được dùng cho upload ảnh.
- Thư viện icon như Lucide.
- Chỉ thêm thư viện khi thực sự cần; kiểm tra phiên bản tương thích trước khi cài.
3. Phong cách thiết kế
Thiết kế theo phong cách editorial, analog, premium nhưng gần gũi:
- Màu nền kem/ngà, đen than, nâu film và một màu nhấn cam đất.
- Typography có cá tính, khoảng trắng rộng, hình ảnh sản phẩm nổi bật.
- Cảm giác cửa hàng máy ảnh film tuyển chọn, không giống template thương mại điện tử đại trà.
- Animation nhẹ, tinh tế; tránh hiệu ứng nặng và không làm giảm hiệu năng.
- Hỗ trợ trạng thái loading, empty, error, success; skeleton chỉ dùng khi hợp lý.
- Đảm bảo contrast, focus state, bàn phím và nhãn accessible.
- Không nhồi nhét gradient, glassmorphism hoặc quá nhiều card bo tròn.
- Dùng ảnh sản phẩm tỷ lệ nhất quán, có crop hợp lý; nếu thiếu ảnh thật, dùng placeholder đẹp và ghi chú rõ.
4. Cấu trúc trang khách hàng
Tạo tối thiểu các trang sau:
1. / — Trang chủ:
   - Header, logo chữ, menu, tìm kiếm, tài khoản, giỏ hàng.
   - Hero giới thiệu thương hiệu và CTA.
   - Danh mục: Máy film, Digital/Compact, Lens, Phụ kiện.
   - Sản phẩm nổi bật, hàng mới về, sản phẩm tuyển chọn.
   - Khối giới thiệu kiểm tra máy, tình trạng sản phẩm, chính sách bảo hành/đổi trả.
   - Newsletter chỉ làm khi có backend/consent phù hợp; nếu chưa tích hợp, không giả vờ gửi email.
   - Footer có thông tin liên hệ và liên kết chính sách mẫu.
2. /products — Danh sách sản phẩm:
   - Tìm kiếm theo tên/model/brand.
   - Lọc theo loại máy, thương hiệu, khoảng giá, tình trạng, tình trạng hàng.
   - Sắp xếp mới nhất, giá tăng/giảm.
   - Phân trang hoặc tải thêm; trạng thái không có kết quả.
   - Filter có thể dùng trên mobile bằng drawer/sheet.
3. /products/[slug] — Chi tiết sản phẩm:
   - Gallery ảnh, tên, giá VND, tình trạng máy, số lượng tồn, mô tả.
   - Thông số phù hợp với máy ảnh: loại máy, hãng, model, mount (nếu có), định dạng film/cảm biến, tình trạng ngoại hình, tình trạng hoạt động, phụ kiện kèm theo.
   - Mô tả kiểm tra máy, bảo hành, lưu ý sản phẩm cũ.
   - Số lượng, thêm vào giỏ, sản phẩm liên quan.
   - Không cho đặt hàng vượt tồn kho.
4. /cart — Giỏ hàng:
   - Thêm/xóa/cập nhật số lượng.
   - Tính tổng tiền ở server khi tạo đơn; không tin tổng tiền do client gửi.
   - Thông báo sản phẩm hết hàng hoặc giá đã thay đổi.
   - Giỏ hàng có thể lưu local cho khách chưa đăng nhập, nhưng phải kiểm tra lại tồn kho/giá trên server lúc checkout.
5. /checkout — Thanh toán/đặt hàng:
   - Thông tin người nhận, số điện thoại, email tùy chọn, địa chỉ, ghi chú.
   - Chọn phương thức thanh toán: COD và chuyển khoản thủ công (MVP).
   - Hiển thị phí vận chuyển như cấu hình có thể chỉnh; nếu chưa tích hợp hãng vận chuyển, ghi rõ đây là mức phí cấu hình, không gọi API giả.
   - Tạo đơn hàng bằng server-side transaction/logic chống tạo đơn trùng; kiểm tra tồn kho và giá lại.
   - Trang xác nhận /order-success/[orderNumber] chỉ hiển thị thông tin đơn phù hợp với người đặt hoặc token an toàn; không để lộ đơn của người khác.
6. /account — Tài khoản:
   - Đăng ký, đăng nhập, đăng xuất.
   - Xem hồ sơ và lịch sử đơn của chính người dùng.
   - Khách không đăng nhập vẫn có thể checkout nếu hệ thống thiết kế hỗ trợ, nhưng chỉ được tra cứu đơn bằng token an toàn hoặc quy trình xác minh.
   - Thêm trang quên/đặt lại mật khẩu nếu auth provider hỗ trợ đúng cấu hình.
7. Các trang thông tin:
   - /about
   - /policies/shipping
   - /policies/returns
   - /policies/warranty
   - /contact
5. Admin dashboard
Tạo nhóm route /admin chỉ dành cho tài khoản có role admin, kiểm tra quyền ở server và dùng RLS để bảo vệ dữ liệu. Ẩn nút admin ở UI không được xem là bảo mật.

Chức năng:
- Dashboard: số đơn, doanh thu theo trạng thái đơn, sản phẩm sắp hết hàng; truy vấn dữ liệu thật từ database.
- CRUD sản phẩm: tên, slug, SKU, giá, giá so sánh tùy chọn, danh mục, thương hiệu, tình trạng mới/cũ, mô tả, thông số, số lượng tồn, trạng thái hiển thị.
- Upload nhiều ảnh lên Cloudinary qua server-side upload/signature; kiểm tra loại file, kích thước và quyền upload. Không để lộ API secret trong client.
- CRUD danh mục/thương hiệu nếu phạm vi phù hợp.
- Quản lý đơn hàng: xem chi tiết, cập nhật trạng thái có quy tắc hợp lệ, ghi nhận phương thức thanh toán và trạng thái thanh toán.
- Quản lý tồn kho; không cho tồn kho âm.
- Tìm kiếm, lọc, phân trang trong bảng.
- Có xác nhận trước thao tác nguy hiểm và toast phản hồi.
- Không cho admin tự gán role qua form public; việc bootstrap admin phải có hướng dẫn an toàn bằng SQL/dashboard.
6. Database và mô hình dữ liệu
Thiết kế schema PostgreSQL có migration, khóa ngoại, index, constraint và timestamps. Tối thiểu gồm:
- users hoặc profiles: id, email unique, password hash nếu dùng credentials, display name, phone, role (customer/admin), timestamps; thiết kế tương thích với adapter/session của Auth.js.
- categories: id, name, slug, description, active.
- brands: id, name, slug.
- products: id, name, slug unique, SKU unique, description, price, compare_at_price nullable, category_id, brand_id, product_type, condition, camera_specs JSONB hoặc các cột có cấu trúc phù hợp, cosmetic_condition, functional_condition, included_accessories, warranty_text, stock_quantity, is_published, timestamps.
- product_images: id, product_id, storage path/public URL, alt text, sort order.
- orders: id, order_number unique, user_id nullable nếu hỗ trợ guest, customer contact/address snapshot, subtotal, shipping_fee, discount_total, grand_total, payment_method, payment_status, order_status, notes, timestamps.
- order_items: id, order_id, product_id nullable nếu cần giữ lịch sử khi sản phẩm bị xóa, product_name snapshot, SKU snapshot, unit_price snapshot, quantity, line_total.
- Nếu có wishlist, wishlists/wishlist_items.
Yêu cầu nghiệp vụ:
- Giá lưu kiểu integer VND hoặc numeric có constraint; không dùng floating-point cho tiền.
- quantity > 0, price >= 0, stock_quantity >= 0.
- Snapshot tên/giá sản phẩm trong order item để đơn cũ không đổi khi sản phẩm thay đổi.
- Đơn hàng và order items phải được tạo nhất quán; xử lý tồn kho an toàn để hai đơn đồng thời không bán vượt số lượng.
- Không cho client tự gửi role, payment_status, giá cuối cùng hoặc trạng thái đơn để nâng quyền.
- Xác định chính sách xóa: ưu tiên archive/unpublish sản phẩm đã bán thay vì xóa dữ liệu lịch sử.
- Tạo seed data tối thiểu 12 sản phẩm demo thuộc nhiều danh mục, có tình trạng khác nhau, giá hợp lý và ảnh placeholder; ghi rõ là demo.
7. Bảo mật bắt buộc
- Không dựa vào việc ẩn nút ở UI để bảo mật: kiểm tra session và role trong server actions/route handlers và service layer.
- Customer chỉ đọc/sửa profile của chính mình; chỉ xem đơn của mình.
- Chỉ admin mới được quản lý sản phẩm, tồn kho, đơn hàng và dữ liệu quản trị.
- Không đưa database URL, AUTH_SECRET, Cloudinary API secret hoặc bất kỳ secret nào vào biến NEXT_PUBLIC_* hay client code.
- Dùng tài khoản database có quyền tối thiểu cần thiết; không sử dụng thông tin kết nối production trong môi trường preview nếu không cần.
- Validate mọi input bằng Zod ở server; sanitize nội dung hiển thị phù hợp.
- Rate limit hoặc có biện pháp giảm spam cho endpoint nhạy cảm nếu triển khai được; nêu giới hạn nếu phụ thuộc nền tảng.
- Không log mật khẩu, token, địa chỉ hoặc dữ liệu nhạy cảm không cần thiết.
- Có .env.example không chứa secret thật; .gitignore đầy đủ.
- Liệt kê chính xác các biến môi trường cần thiết, ví dụ DATABASE_URL, AUTH_SECRET và các biến OAuth nếu có; Cloudinary CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET chỉ khi sử dụng. Không khai báo biến không được code dùng.
- Kiểm tra upload file và giới hạn loại/kích thước; chỉ server được ký upload hoặc dùng API secret.
- Không coi URL khó đoán là cơ chế phân quyền.
- Viết SECURITY.md ghi rõ rủi ro còn lại và checklist trước khi mở bán thật.
8. Tìm kiếm, SEO và chất lượng
- Metadata riêng cho trang sản phẩm và danh mục.
- Slug duy nhất, canonical URL phù hợp.
- Sitemap và robots.
- Product structured data JSON-LD chỉ dùng thông tin thực có; không tạo review/rating giả.
- Ảnh có alt text; tối ưu kích thước và lazy loading.
- Có loading.tsx, error.tsx, not-found.tsx phù hợp.
- Kiểm tra responsive, keyboard navigation, loading/error/empty state.
- Dùng Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }) hoặc helper tương đương cho hiển thị tiền.
- Tránh hydration errors và fetch dữ liệu trùng lặp.
- Thêm favicon và metadata thương hiệu.
9. Kiểm thử và tiêu chí hoàn thành
Tạo và chạy:
- Lint và TypeScript check.
- Unit test cho hàm định dạng tiền, tính giỏ hàng, kiểm tra chuyển trạng thái đơn.
- Test/kiểm tra cho quyền customer/admin.
- Kiểm tra các luồng chính: xem sản phẩm, lọc, thêm giỏ, checkout, tạo đơn, admin sửa sản phẩm và trạng thái đơn.
- npm run build phải chạy thành công trước khi báo hoàn tất.
- Không để link chết, nút không có hành động, form không validate hoặc trang chỉ chứa placeholder mà không ghi chú.
10. Tổ chức dự án và tài liệu
Tạo tối thiểu:
- README.md: mô tả, yêu cầu, cài đặt local, scripts, cấu hình PostgreSQL/Prisma/Auth.js và Cloudinary.
- .env.example không chứa giá trị bí mật thật.
- SECURITY.md
- docs/DEPLOYMENT.md
- prisma/schema.prisma, thư mục migrations và seed script.
- Cấu trúc thư mục rõ ràng, ví dụ app/, components/, lib/, features/, prisma/, tests/.
11. Kế hoạch triển khai
Làm theo thứ tự:
1. Khảo sát repo, lập kế hoạch, dựng giao diện và design tokens.
2. Khởi tạo Next.js/TypeScript/Tailwind và component nền.
3. Dựng trang chủ, listing, product detail và responsive.
4. Thiết kế schema Prisma, PostgreSQL migrations, indexes, constraints và seed data.
5. Tích hợp Auth.js, database sessions/token strategy phù hợp và phân quyền server-side; cấu hình Cloudinary upload nếu cần.
6. Làm giỏ hàng, checkout, tạo đơn và kiểm tra tồn kho.
7. Làm admin dashboard.
8. Bổ sung SEO, error/empty/loading states và accessibility.
9. Viết tests, chạy lint/typecheck/build, sửa lỗi.
10. Viết hướng dẫn deploy từng bước; liệt kê chính xác biến môi trường cần khai báo.
12. Định nghĩa MVP và phạm vi không làm giả
MVP phải hỗ trợ duyệt sản phẩm, tìm/lọc, chi tiết sản phẩm, giỏ hàng, đặt hàng COD/chuyển khoản thủ công, tài khoản, lịch sử đơn và admin CRUD sản phẩm/quản lý đơn.

Chưa cần tích hợp cổng thanh toán online, vận chuyển tự động, chat realtime hoặc hệ thống khuyến mãi phức tạp. Không hiển thị các chức năng đó như đã hoạt động. Thiết kế code để có thể tích hợp sau.
13. Cách báo cáo kết quả
Khi hoàn thành, hãy cung cấp:
- Tóm tắt tính năng đã triển khai và tính năng chưa triển khai.
- Cấu trúc thư mục quan trọng.
- Lệnh cài đặt/chạy local trên Windows 11 PowerShell.
- Cách tạo database PostgreSQL (Neon hoặc PostgreSQL tương thích), chạy Prisma migrations và seed.
- Cách cấu hình Auth.js và biến môi trường.
- Cách cấu hình Cloudinary (nếu dùng) và tạo tài khoản admin an toàn.
- Danh sách biến môi trường cần thiết.
- Kết quả lint, typecheck, tests và build thực tế; không tuyên bố pass nếu chưa chạy.
- Các bước deploy và checklist trước khi dùng cho khách hàng thật.
Bắt đầu bằng việc kiểm tra môi trường và repo hiện tại, sau đó thực hiện theo phase. Ưu tiên code sạch, chạy được, dễ bảo trì hơn việc tạo thật nhiều file hoặc tính năng chưa hoàn thiện.