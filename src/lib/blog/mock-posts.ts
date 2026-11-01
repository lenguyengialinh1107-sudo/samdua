import { demoImage } from "@/lib/images";

import { estimateReadingMinutes } from "./content";
import type { BlogPost } from "./types";

/**
 * Dữ liệu mẫu cho Blog.
 *
 * Đây là nguồn dữ liệu duy nhất khi chưa cấu hình backend. Repository sẽ nạp
 * danh sách này vào kho dữ liệu trong bộ nhớ; khi chuyển sang Headless CMS chỉ
 * cần thay phần nạp dữ liệu, phần còn lại của website giữ nguyên.
 */
const seeds: Omit<BlogPost, "readingMinutes">[] = [
  {
    id: "post-01",
    slug: "huong-dan-chon-may-anh-film-cho-nguoi-moi",
    title: "Hướng dẫn chọn máy ảnh film cho người mới",
    excerpt:
      "Bắt đầu từ đâu, chọn máy nào và cần tránh những gì? Bài viết tổng hợp kinh nghiệm chọn máy film đầu tiên cho người mới.",
    categorySlug: "huong-dan-cho-nguoi-moi",
    tags: ["người mới", "chọn máy", "máy film"],
    coverImage: demoImage(
      "young person holding a classic film camera, a variety of beginner-friendly film cameras arranged on a table, warm analog tones, soft natural lighting, professional photography",
      "landscape_4_3",
    ),
    coverAlt: "Người đang cầm máy ảnh film và các dòng máy cho người mới",
    gallery: [
      demoImage(
        "hands loading a 35mm film roll into a vintage camera, close-up, warm cinematic lighting, editorial analog photography",
        "landscape_4_3",
      ),
      demoImage(
        "collection of popular beginner film cameras like Pentax K1000 and Canon AE-1 on a wooden shelf, warm vintage atmosphere",
        "landscape_4_3",
      ),
    ],
    author: "Second Shot",
    publishedAt: "2026-09-12T09:00:00.000Z",
    isFeatured: true,
    status: "PUBLISHED",
    updatedAt: "2026-09-12T09:00:00.000Z",
    content: `Chọn chiếc máy film đầu tiên giống như chọn một người bạn đồng hành: không cần đắt tiền, chỉ cần hợp với cách bạn chụp.

## Xác định nhu cầu trước khi chọn máy
Đa số người mới mua máy theo cảm hứng rồi mới nhận ra mình cần một chiếc máy khác. Hãy trả lời ba câu hỏi: bạn chụp gì, chụp bao nhiêu cuộn mỗi tháng và bạn thích mang máy theo người hay để ở nhà?

- Chụp hằng ngày, mang theo người: máy compact là lựa chọn gọn nhẹ.
- Muốn học bố cục, khẩu độ, tốc độ: máy SLR cơ sẽ dạy bạn nhiều hơn.
- Chụp chân dung, sự kiện trong nhà: ưu tiên máy có đèn flash hoặc hot shoe.

## Các dòng máy phù hợp với người mới
Máy SLR cơ như Pentax K1000, Canon AE-1 hay Nikon FM10 có ưu điểm là bền, dễ sửa và giá lens rẻ. Máy compact như Olympus Mju, Yashica T4 lại tiện mang theo và chụp nhanh.

> Lời khuyên: chiếc máy tốt nhất là chiếc máy bạn thực sự mang ra khỏi nhà.

Nếu ngân sách hạn chế, hãy dành nhiều tiền cho lens và film hơn là cho thân máy. Một thân máy tầm trung đi kèm lens tốt sẽ cho ảnh đẹp hơn một thân máy cao cấp với lens kém.

## Những thứ cần kiểm tra khi mua máy cũ
Máy film mua cũ luôn cần kiểm tra kỹ trước khi xuống tiền, đặc biệt là các bộ phận dễ hỏng theo thời gian.

- Gioăng sáng (light seal) có bị mủn hay không.
- Cửa màn trập mở đúng tốc độ, tiếng máy đều.
- Ống kính không mốc, không rễ tre, không xước thấu kính.
- Đồng hồ đo sáng hoạt động và khớp với máy đo ngoài.

## Ngân sách và phụ kiện đi kèm
Ngoài tiền máy, bạn nên tính thêm chi phí film và các khoản phát sinh khi chụp — đây mới là khoản chi kéo dài. Một cuộn film 36 kiểu thường tốn tương đương vài trăm nghìn đồng, nên hãy chọn máy theo khả năng duy trì đều đặn việc chụp.

Đừng quên pin, túi đựng máy và một ít hạt hút ẩm. Ba thứ nhỏ này giúp máy của bạn sống lâu hơn rất nhiều.`,
  },
  {
    id: "post-02",
    slug: "kodak-gold-200-hay-fujifilm-400",
    title: "Kodak Gold 200 hay Fujifilm 400?",
    excerpt:
      "Hai cuộn film phổ thông được hỏi nhiều nhất. Cùng so sánh tông màu, độ hạt và bối cảnh chụp phù hợp của từng loại.",
    categorySlug: "review-cuon-film",
    tags: ["kodak", "fujifilm", "film màu"],
    coverImage: demoImage(
      "one Kodak Gold 200 film roll and one Fujifilm 400 film roll side by side, vintage analog mood, warm golden sunlight, cinematic film look",
      "landscape_4_3",
    ),
    coverAlt: "Hai cuộn film Kodak Gold 200 và Fujifilm 400 đặt cạnh nhau",
    gallery: [
      demoImage(
        "photo comparison: warm golden street scene shot on Kodak Gold versus cooler green tones of Fujifilm 400, split screen, analog grain",
        "landscape_4_3",
      ),
      demoImage(
        "stack of Kodak and Fuji film boxes on a vintage wooden desk, warm cinematic lighting",
        "landscape_4_3",
      ),
    ],
    author: "Second Shot",
    publishedAt: "2026-09-20T09:00:00.000Z",
    isFeatured: true,
    status: "PUBLISHED",
    updatedAt: "2026-09-20T09:00:00.000Z",
    content: `Kodak Gold 200 và Fujifilm 400 là hai cái tên gần như xuất hiện trong mọi cuộc trò chuyện của người chơi film. Vậy nên chọn loại nào?

## Tông màu đặc trưng của Kodak Gold 200
Kodak Gold 200 nổi tiếng với tông vàng ấm, da người hồng hào và cảm giác hoài cổ rất rõ. Đây là cuộn film dễ chịu với ánh nắng buổi chiều, phù hợp cho ảnh kỷ niệm, ảnh gia đình và những buổi dạo phố.

- ISO 200 nên cần ánh sáng tốt hoặc khẩu độ mở.
- Màu ấm, độ tương phản vừa phải.
- Hạt film mịn hơn ở điều kiện đủ sáng.

## Fujifilm 400 và lợi thế tốc độ
Fujifilm 400 nhạy sáng gấp đôi, cho phép chụp trong nhà, buổi tối hoặc khi trời âm u mà không lo thiếu sáng. Tông màu nghiêng về xanh — xanh lá cây rất tươi, da người có xu hướng lạnh hơn.

> Nếu bạn chụp trong điều kiện ánh sáng khó, ISO 400 thường là lựa chọn an toàn hơn.

## So sánh nhanh theo tình huống
Dưới đây là cách chọn nhanh theo bối cảnh chụp thường gặp:

- Nắng chiều, chân dung ngoài trời: Kodak Gold 200.
- Du lịch, ánh sáng thay đổi liên tục: Fujifilm 400.
- Chụp đêm có flash: Fujifilm 400 cho nền sáng hơn.
- Muốn ảnh mang màu vintage rõ: Kodak Gold 200.

## Kết luận
Không có cuộn film nào "tốt nhất", chỉ có cuộn phù hợp nhất với ánh sáng và gu màu của bạn. Người mới nên thử cả hai với cùng một bối cảnh để tự thấy sự khác biệt, sau đó chọn loại mình thích làm cuộn chủ lực.`,
  },
  {
    id: "post-03",
    slug: "review-olympus-superzoom-70",
    title: "Review Olympus Superzoom 70",
    excerpt:
      "Chiếc compact zoom bình dân với dải tiêu cự linh hoạt. Liệu đây có phải lựa chọn đáng tiền cho người mới?",
    categorySlug: "review-may-anh",
    tags: ["olympus", "compact", "zoom"],
    coverImage: demoImage(
      "authentic Olympus Superzoom 70 black compact film camera, realistic product photo on a vintage wooden surface, warm analog tones",
      "landscape_4_3",
    ),
    coverAlt: "Máy ảnh Olympus Superzoom 70",
    gallery: [
      demoImage(
        "detailed shot of Olympus Superzoom 70 camera lens and buttons, black plastic body, vintage cinematic lighting",
        "landscape_4_3",
      ),
      demoImage(
        "person holding an Olympus Superzoom 70 camera, candid street photography style, warm analog mood",
        "landscape_4_3",
      ),
    ],
    author: "Second Shot",
    publishedAt: "2026-09-28T09:00:00.000Z",
    isFeatured: false,
    status: "PUBLISHED",
    updatedAt: "2026-09-28T09:00:00.000Z",
    content: `Olympus Superzoom 70 là mẫu compact zoom xuất hiện khá nhiều trong các cửa hàng máy film cũ nhờ mức giá dễ chịu và dải tiêu cự linh hoạt.

## Thiết kế và cảm giác cầm
Máy có thân nhựa gọn, trọng lượng nhẹ, dễ bỏ túi áo khoác. Cụm zoom 38–70mm đủ cho cả ảnh toàn cảnh lẫn chân dung gần. Các nút bấm đơn giản, phù hợp với người mới chưa quen thao tác.

## Chất lượng ảnh
Ở điều kiện đủ sáng, ảnh ra khá nét, màu trung tính và dễ chỉnh trong quá trình hậu kỳ. Khi thiếu sáng, máy có xu hướng dùng flash tự động — kết quả chấp nhận được nhưng không phải điểm mạnh.

- Điểm cộng: nhỏ gọn, zoom linh hoạt, giá dễ tiếp cận.
- Điểm trừ: thân nhựa, tốc độ lấy nét chậm, hạn chế khi thiếu sáng.

## Ai nên mua máy này?
Máy phù hợp với người mới muốn một chiếc compact mang theo hằng ngày, chụp du lịch hoặc ảnh gia đình. Nếu bạn cần chất ảnh đỉnh cao để in lớn, hãy cân nhắc máy SLR với lens cố định.

> Đây là chiếc máy "đủ tốt để bắt đầu", không phải để theo đuổi chất lượng tối đa.

## Kết luận
Với mức giá phổ thông, Olympus Superzoom 70 làm tốt vai trò của một chiếc máy nhập môn. Hãy kiểm tra kỹ gioăng sáng và cơ chế zoom trước khi mua vì đây là hai bộ phận hay gặp vấn đề nhất ở dòng máy này.`,
  },
  {
    id: "post-04",
    slug: "5-loi-nguoi-moi-choi-film-thuong-mac",
    title: "5 lỗi người mới chơi film thường mắc",
    excerpt:
      "Từ quên gạt film đến đo sáng sai, đây là những lỗi phổ biến khiến cuộn film đầu tiên của bạn không như mong đợi.",
    categorySlug: "meo-chup-anh",
    tags: ["lỗi thường gặp", "người mới", "kinh nghiệm"],
    coverImage: demoImage(
      "young person loading a 35mm film roll into a vintage SLR camera, concentrated expression, soft indoor lighting, analog film aesthetic",
      "landscape_4_3",
    ),
    coverAlt: "Người đang lắp film vào máy ảnh",
    gallery: [
      demoImage(
        "hands holding a vintage camera, accidentally opening the back door with film inside, light leak effect, analog photography mistake",
        "landscape_4_3",
      ),
      demoImage(
        "blurry and underexposed analog photo, film grain, vintage mistake style",
        "landscape_4_3",
      ),
    ],
    author: "Second Shot",
    publishedAt: "2026-10-02T09:00:00.000Z",
    isFeatured: false,
    status: "PUBLISHED",
    updatedAt: "2026-10-02T09:00:00.000Z",
    content: `Hầu hết cuộn film đầu tiên đều có vài khung bị lỗi. Biết trước những lỗi này sẽ giúp bạn tiết kiệm film và có những cuộn ảnh đẹp hơn.

## Lỗi 1: Quên gạt film trước khi chụp
Ở máy SLR cơ, nếu bạn quên gạt cần lên film, khung ảnh sau sẽ chồng lên khung trước. Cách phòng tránh đơn giản là tạo thói quen: gạt film ngay sau mỗi lần bấm máy.

## Lỗi 2: Đo sáng sai trong điều kiện ngược sáng
Máy đo sáng tự động dễ bị đánh lừa khi chủ thể đứng trước nguồn sáng mạnh. Hãy đo sáng vào vùng tối của chủ thể, hoặc dùng chế độ bù sáng nếu máy có.

- Ngược sáng: đo vào khuôn mặt, không đo vào nền.
- Chụp tuyết hoặc biển: tăng sáng 1 đến 2 khẩu.
- Trong nhà tối: mở khẩu, dùng film ISO cao hơn.

## Lỗi 3: Nạp film chưa đúng
Nếu film không ăn vào trục, máy vẫn cho bấm nhưng không có ảnh nào được ghi. Sau khi nạp, hãy gạt và bấm thử hai khung, kiểm tra trục film có quay không.

## Lỗi 4: Mở nắp máy giữa cuộn
Đây là lỗi tốn kém nhất: ánh sáng lọt vào làm cháy một phần cuộn film. Trước khi mở nắp, luôn kiểm tra film đã được cuộn hết hoặc đã quay lại vào vỏ chưa.

> Một khoảnh khắc bất cẩn có thể xoá đi cả tháng chụp.

## Lỗi 5: Không ghi chú cuộn film
Không ghi lại loại film, ISO hay bối cảnh khiến bạn không biết vì sao cuộn này đẹp hơn cuộn kia. Một cuốn sổ nhỏ hoặc ghi chú trong điện thoại là đủ.

## Cách khắc phục
Hãy chụp chậm lại, kiểm tra máy trước và sau mỗi cuộn, và chấp nhận rằng vài khung lỗi là một phần của hành trình chơi film.`,
  },
  {
    id: "post-05",
    slug: "cach-bao-quan-may-anh-film",
    title: "Cách bảo quản máy ảnh film",
    excerpt:
      "Độ ẩm, nấm mốc và bụi là kẻ thù lớn nhất của máy film. Đây là cách bảo quản để máy bền theo năm tháng.",
    categorySlug: "huong-dan-cho-nguoi-moi",
    tags: ["bảo quản", "chăm sóc máy", "nấm mốc"],
    coverImage: demoImage(
      "vintage film camera, a wooden dry box, and a lens cleaning kit with a soft brush and cloth on a cream table, warm cinematic lighting",
      "landscape_4_3",
    ),
    coverAlt: "Máy ảnh, hộp chống ẩm và bộ vệ sinh lens",
    gallery: [
      demoImage(
        "close-up of hands cleaning a camera lens with a microfiber cloth, dust-free glass, warm analog mood",
        "landscape_4_3",
      ),
      demoImage(
        "camera equipment stored neatly in a professional dry cabinet, hygrometer visible, warm vintage lighting",
        "landscape_4_3",
      ),
    ],
    author: "Second Shot",
    publishedAt: "2026-10-06T09:00:00.000Z",
    isFeatured: false,
    status: "PUBLISHED",
    updatedAt: "2026-10-06T09:00:00.000Z",
    content: `Máy film là thiết bị cơ khí có nhiều bộ phận nhạy cảm với độ ẩm và bụi. Bảo quản đúng cách sẽ giữ máy hoạt động ổn định trong nhiều năm.

## Hiểm hoạ từ độ ẩm và nấm mốc
Khí hậu nóng ẩm tạo điều kiện cho nấm mốc phát triển trên thấu kính. Nấm mốc ăn mòn lớp coating, để lại vết mờ không thể phục hồi hoàn toàn.

- Giữ độ ẩm trong khoảng 40 đến 50 phần trăm.
- Dùng tủ chống ẩm hoặc hộp kín kèm hạt hút ẩm.
- Thay hạt hút ẩm định kỳ, thường 1 đến 2 tháng một lần.

## Vệ sinh định kỳ
Bụi trên thấu kính làm giảm độ tương phản và dễ gây xước khi lau. Chỉ dùng bút thổi bụi và khăn microfibre dành riêng cho quang học, không dùng vạt áo.

> Không bao giờ dùng cồn nồng độ cao để lau thấu kính có coating.

## Cất máy đúng cách
Máy nên được cất ở nơi khô, thoáng, tránh ánh nắng trực tiếp. Với máy SLR, hãy trả cần lên film về vị trí nghỉ và đặt tốc độ màn trập ở vị trí trung tính để lò xo không bị mỏi.

- Tháo pin nếu không dùng trong thời gian dài.
- Không để máy chung với hóa chất hoặc thực phẩm.
- Kiểm tra máy định kỳ, kể cả khi không sử dụng.

## Trước và sau khi đi chụp
Sau chuyến đi biển hoặc mưa, hãy lau khô máy bằng khăn mềm và để máy thông gió tự nhiên trước khi cất. Đừng vội đóng hộp kín khi máy còn ẩm.`,
  },
  {
    id: "post-07",
    slug: "nhung-dia-diem-chup-anh-film-dep",
    title: "Những địa điểm chụp ảnh film đẹp",
    excerpt:
      "Không cần đi xa, vài gợi ý dưới đây sẽ giúp bạn có một buổi chụp film đủ chất liệu cho cả cuộn phim.",
    categorySlug: "cau-chuyen-cong-dong",
    tags: ["địa điểm", "dạo phố", "câu chuyện"],
    coverImage: demoImage(
      "cinematic shot of a beautiful old street in Hanoi at sunset, warm golden light, vintage colonial buildings, analog film grain",
      "landscape_4_3",
    ),
    coverAlt: "Địa điểm chụp ảnh film đẹp tại phố cổ",
    gallery: [
      demoImage(
        "an old vintage cafe with wooden furniture and warm lighting, perfect for film photography, analog aesthetic",
        "landscape_4_3",
      ),
      demoImage(
        "sunlit riverside path with silhouettes of people at golden hour, warm cinematic film look",
        "landscape_4_3",
      ),
    ],
    author: "Second Shot",
    publishedAt: "2026-10-18T09:00:00.000Z",
    isFeatured: false,
    status: "PUBLISHED",
    updatedAt: "2026-10-18T09:00:00.000Z",
    content: `Chụp film không cần những địa điểm hoành tráng. Điều quan trọng là ánh sáng, chất liệu bề mặt và câu chuyện bạn muốn kể.

## Phố cũ và tường vàng
Những con phố với tường vàng, cửa gỗ và ban công cũ là chất liệu quen thuộc nhưng luôn hiệu quả. Ánh sáng xiên buổi chiều tạo khối rõ và tông màu ấm rất hợp với film màu.

- Chụp giờ vàng, khoảng 16h đến 18h.
- Tìm mảng tường có kết cấu bong tróc để tăng chiều sâu.
- Dùng film ISO thấp để giữ chi tiết vùng sáng.

## Chợ và khu dân sinh
Chợ sớm, ngõ nhỏ và hàng nước vỉa hè cho ảnh có "hơi thở" đời sống. Hãy xin phép trước khi chụp cận mặt người lạ, và tôn trọng không gian riêng tư của họ.

> Ảnh đẹp nhất thường đến từ nơi ta đi qua mỗi ngày mà chưa từng dừng lại.

## Công viên và ven sông
Không gian xanh giúp ảnh có nhiều lớp tiền cảnh và hậu cảnh. Ven sông vào cuối ngày cho những khung ảnh ngược sáng rất hợp với film màu âm.

## Quán cà phê và không gian trong nhà
Ánh sáng cửa sổ là nguồn sáng mềm lý tưởng, phù hợp cho chân dung với film ISO 400. Hãy chọn chỗ ngồi cạnh cửa sổ và tránh để hậu cảnh có nhiều chi tiết nhiễu.

## Chuẩn bị cho một buổi chụp
Mang theo 2 cuộn film với ISO khác nhau, một lens góc rộng và một lens chân dung là đủ. Đừng quên pin dự phòng, khăn lau lens và một chút kiên nhẫn để chờ đúng khoảnh khắc.`,
  },
  {
    id: "post-08",
    slug: "cach-chon-cuon-film-theo-dieu-kien-anh-sang",
    title: "Cách chọn cuộn film theo điều kiện ánh sáng",
    excerpt:
      "ISO chỉ là một phần của câu chuyện. Hiểu cách film phản ứng với ánh sáng sẽ giúp bạn chọn đúng cuộn mỗi lần ra ngoài.",
    categorySlug: "review-cuon-film",
    tags: ["ISO", "ánh sáng", "chọn film"],
    coverImage: demoImage(
      "different film rolls (ISO 100, 400, 800) placed in various lighting conditions from bright sun to deep shadow, warm analog cinematic lighting",
      "landscape_4_3",
    ),
    coverAlt: "Chọn film theo điều kiện ánh sáng",
    gallery: [
      demoImage(
        "sunlight streaming through a window onto a variety of film canisters, warm golden tones, editorial analog photography",
        "landscape_4_3",
      ),
      demoImage(
        "shadowy indoor scene with a vintage camera, soft dim lighting, analog grain, cinematic mood",
        "landscape_4_3",
      ),
    ],
    author: "Second Shot",
    publishedAt: "2026-10-22T09:00:00.000Z",
    isFeatured: false,
    status: "PUBLISHED",
    updatedAt: "2026-10-22T09:00:00.000Z",
    content: `Chọn film theo ánh sáng là kỹ năng quan trọng nhất khi chơi ảnh film, bởi bạn không thể đổi ISO giữa cuộn như trên máy số.

## Hiểu về ISO của film
ISO càng thấp thì film càng cần nhiều sáng nhưng cho hạt mịn và chi tiết tốt hơn. ISO càng cao thì càng linh hoạt trong điều kiện thiếu sáng nhưng hạt to hơn.

- ISO 100 và 200: ngoài trời, nắng đẹp.
- ISO 400: linh hoạt, dùng được cả trong nhà.
- ISO 800 trở lên: chụp tối, chuyển động, buổi tối.

## Chọn film theo bối cảnh
Mỗi bối cảnh có một dải ISO phù hợp. Hãy chọn theo ánh sáng bạn dự kiến gặp, và luôn có phương án dự phòng.

- Nắng gắt giữa trưa: ISO 100, chú ý vùng cháy sáng.
- Trời âm u hoặc mưa: ISO 400 để giữ tốc độ an toàn.
- Trong nhà thiếu sáng: ISO 800 kèm lens khẩu lớn.
- Chụp đêm có flash: ISO 400 giúp nền sáng tự nhiên hơn.

> Khi không chắc về ánh sáng, ISO 400 thường là lựa chọn ít hậu quả nhất.

## Kỹ thuật đẩy sáng (push) khi cần
Nếu buộc phải chụp trong điều kiện tối hơn dự kiến, bạn có thể đẩy sáng cuộn film, ví dụ đẩy ISO 400 lên 800. Hãy chấp nhận hạt film to hơn và tương phản cao hơn.

## Kết luận
Mang theo hai cuộn ở hai mức ISO khác nhau là cách đơn giản nhất để xử lý mọi tình huống ánh sáng. Theo thời gian, bạn sẽ tự cảm nhận được khi nào nên dùng ISO thấp để giữ chất ảnh, khi nào cần ISO cao để không bỏ lỡ khoảnh khắc.`,
  },
];

export const mockBlogPosts: BlogPost[] = seeds.map((post) => ({
  ...post,
  readingMinutes: estimateReadingMinutes(post.content),
}));
