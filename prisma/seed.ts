/**
 * Seed dữ liệu DEMO cho Second Shot.
 *
 * Lưu ý: toàn bộ sản phẩm, giá và ảnh dưới đây là DỮ LIỆU MẪU,
 * không phải hàng thật. Ảnh dùng dịch vụ ảnh placeholder.
 *
 * Chạy: npm run db:seed
 */
import { PrismaClient, ProductCondition, ProductType } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient();

const placeholderImage = (prompt: string, size = "landscape_4_3") =>
  `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
    prompt,
  )}&image_size=${size}`;

const DEMO_NOTE =
  "Ảnh minh hoạ dạng placeholder — vui lòng thay ảnh thật trong trang quản trị.";

const categories = [
  {
    slug: "may-film",
    name: "Máy film",
    description: "Máy ảnh film 35mm và medium format đã kiểm tra, chụp tốt.",
    sortOrder: 1,
  },
  {
    slug: "digital-compact",
    name: "Digital & Compact",
    description: "Máy ảnh digital, compact và mirrorless cho nhu cầu hằng ngày.",
    sortOrder: 2,
  },
  {
    slug: "lens",
    name: "Lens",
    description: "Ống kính rời cho các mount phổ biến, kèm filter khi có.",
    sortOrder: 3,
  },
  {
    slug: "phu-kien",
    name: "Phụ kiện",
    description: "Túi, dây đeo, filter, pin, film và phụ kiện nhiếp ảnh.",
    sortOrder: 4,
  },
];

const brands = [
  "Canon",
  "Nikon",
  "Olympus",
  "Pentax",
  "Fujifilm",
  "Sony",
  "Contax",
  "Yashica",
  "Leica",
  "Peak Design",
  "Kodak",
];

interface DemoProduct {
  slug: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  categorySlug: string;
  brandName?: string;
  productType: ProductType;
  condition: ProductCondition;
  cameraSpecs: Record<string, string>;
  cosmeticCondition: string;
  functionalCondition: string;
  includedAccessories: string;
  stockQuantity: number;
  isFeatured?: boolean;
  imagePrompt: string;
}

const products: DemoProduct[] = [
  {
    slug: "canon-ae-1-program-50mm-f18-demo",
    name: "Canon AE-1 Program + FD 50mm f/1.8",
    sku: "AH-FILM-AE1-001",
    description:
      "Bộ máy film 35mm huyền thoại của Canon, đã được vệ sinh buồng phim và thay light seal. Máy đo sáng hoạt động chính xác, chụp thử 1 cuộn film màu cho kết quả tốt.",
    price: 4_200_000,
    compareAtPrice: 4_900_000,
    categorySlug: "may-film",
    brandName: "Canon",
    productType: ProductType.FILM_CAMERA,
    condition: ProductCondition.LIKE_NEW,
    cameraSpecs: {
      "Định dạng film": "35mm (135)",
      Mount: "Canon FD",
      "Tốc độ màn trập": "B – 1/1000s",
      "Đo sáng": "Có, hoạt động tốt",
      Viewfinder: "Nguyên vẹn, kính trong",
    },
    cosmeticCondition: "Thân máy đẹp, xước nhỏ ở đế máy, da dán còn tốt.",
    functionalCondition: "Màn trập, film advance và light meter đều chuẩn.",
    includedAccessories: "Thân máy, lens 50mm f/1.8, nắp lens, dây đeo, pin LR44.",
    stockQuantity: 2,
    isFeatured: true,
    imagePrompt:
      "product photo of a vintage Canon AE-1 Program 35mm film SLR camera with 50mm lens on a warm cream studio background, soft editorial lighting, high detail",
  },
  {
    slug: "nikon-fm2-nikkor-50mm-f14-demo",
    name: "Nikon FM2 + Nikkor 50mm f/1.4",
    sku: "AH-FILM-FM2-002",
    description:
      "Nikon FM2 cơ hoàn toàn, màn trập titan bền bỉ. Máy đã căn chỉnh tốc độ màn trập và vệ sinh gương lật, phù hợp cả chụp hằng ngày và học nhiếp ảnh.",
    price: 6_500_000,
    categorySlug: "may-film",
    brandName: "Nikon",
    productType: ProductType.FILM_CAMERA,
    condition: ProductCondition.EXCELLENT,
    cameraSpecs: {
      "Định dạng film": "35mm (135)",
      Mount: "Nikon F",
      "Tốc độ màn trập": "B – 1/4000s",
      "Đo sáng": "Có (LED trong viewfinder)",
    },
    cosmeticCondition: "Vỏ máy còn sáng, vài vết xước nhỏ theo thời gian.",
    functionalCondition: "Hoạt động ổn định, không kẹt film, kính ngắm trong.",
    includedAccessories: "Thân máy, lens 50mm f/1.4, nắp lens, dây đeo.",
    stockQuantity: 1,
    isFeatured: true,
    imagePrompt:
      "product photo of a black Nikon FM2 film SLR camera with a 50mm f1.4 lens, cream paper background, editorial product photography, soft shadow",
  },
  {
    slug: "olympus-om-1-zuiko-50mm-f18-demo",
    name: "Olympus OM-1 + Zuiko 50mm f/1.8",
    sku: "AH-FILM-OM1-003",
    description:
      "Olympus OM-1 nhỏ gọn, kính ngắm lớn dễ lấy nét. Máy đã thay light seal và kiểm tra hệ thống đo sáng bằng pin 1.35V tương đương.",
    price: 3_800_000,
    categorySlug: "may-film",
    brandName: "Olympus",
    productType: ProductType.FILM_CAMERA,
    condition: ProductCondition.GOOD,
    cameraSpecs: {
      "Định dạng film": "35mm (135)",
      Mount: "Olympus OM",
      "Tốc độ màn trập": "1 – 1/1000s",
      "Đo sáng": "Có, đã hiệu chỉnh",
    },
    cosmeticCondition: "Bong tróc sơn nhẹ ở góc máy, không ảnh hưởng sử dụng.",
    functionalCondition: "Máy chụp tốt, film counter chuẩn.",
    includedAccessories: "Thân máy, lens 50mm f/1.8, nắp lens, dây đeo.",
    stockQuantity: 3,
    imagePrompt:
      "product photo of a silver and black Olympus OM-1 35mm film camera with 50mm lens, cream linen background, minimal editorial styling",
  },
  {
    slug: "pentax-k1000-smc-50mm-f2-demo",
    name: "Pentax K1000 + SMC 50mm f/2",
    sku: "AH-FILM-K1000-004",
    description:
      "Chiếc máy film cơ bản đáng tin cậy nhất cho người mới. Toàn bộ chức năng cơ học đã được kiểm tra, đồng hồ đo sáng hoạt động.",
    price: 3_200_000,
    compareAtPrice: 3_600_000,
    categorySlug: "may-film",
    brandName: "Pentax",
    productType: ProductType.FILM_CAMERA,
    condition: ProductCondition.GOOD,
    cameraSpecs: {
      "Định dạng film": "35mm (135)",
      Mount: "Pentax K",
      "Tốc độ màn trập": "B – 1/1000s",
      "Đo sáng": "Có (kim chỉ), chính xác",
    },
    cosmeticCondition: "Dấu hiệu sử dụng rõ, vỏ kim loại còn chắc.",
    functionalCondition: "Chụp thử tốt, không rò sáng.",
    includedAccessories: "Thân máy, lens 50mm f/2, nắp lens, dây đeo.",
    stockQuantity: 2,
    imagePrompt:
      "product photo of a classic Pentax K1000 film camera with 50mm lens, warm neutral background, soft daylight, editorial catalog style",
  },
  {
    slug: "yashica-mat-124g-tlr-demo",
    name: "Yashica Mat-124G (TLR medium format)",
    sku: "AH-FILM-MAT124G-005",
    description:
      "Máy TLR medium format 6x6 với lens Yashinon 80mm f/3.5. Kính ngắm sáng, lấy nét mượt, phù hợp chụp chân dung và phong cảnh khổ vuông.",
    price: 7_900_000,
    categorySlug: "may-film",
    brandName: "Yashica",
    productType: ProductType.FILM_CAMERA,
    condition: ProductCondition.EXCELLENT,
    cameraSpecs: {
      "Định dạng film": "120 medium format (6x6)",
      Lens: "Yashinon 80mm f/3.5",
      "Tốc độ màn trập": "1 – 1/500s",
      "Đo sáng": "Có, hoạt động",
    },
    cosmeticCondition: "Ngoại hình đẹp, chữ và logo còn rõ.",
    functionalCondition: "Lấy nét chính xác, đếm film hoạt động tốt.",
    includedAccessories: "Thân máy, nắp lens, dây đeo, hood.",
    stockQuantity: 1,
    isFeatured: true,
    imagePrompt:
      "product photo of a Yashica Mat-124G twin lens reflex medium format camera, cream backdrop, soft studio light, editorial photography",
  },
  {
    slug: "contax-t2-compact-demo",
    name: "Contax T2 (compact film cao cấp)",
    sku: "AH-CMP-T2-006",
    description:
      "Compact film cao cấp với lens Sonnar 38mm f/2.8, chế độ lấy nét tự động và đo sáng chuẩn. Máy đã được kiểm tra toàn bộ và chụp test.",
    price: 18_500_000,
    compareAtPrice: 19_900_000,
    categorySlug: "digital-compact",
    brandName: "Contax",
    productType: ProductType.COMPACT_CAMERA,
    condition: ProductCondition.LIKE_NEW,
    cameraSpecs: {
      "Định dạng film": "35mm (135)",
      Lens: "Carl Zeiss Sonnar 38mm f/2.8",
      "Lấy nét": "Tự động / thủ công",
      "Đo sáng": "Tự động",
    },
    cosmeticCondition: "Thân titan còn đẹp, màn LCD không mờ.",
    functionalCondition: "Flash, autofocus, motor advance hoạt động hoàn hảo.",
    includedAccessories: "Thân máy, pin CR123A, dây đeo.",
    stockQuantity: 1,
    isFeatured: true,
    imagePrompt:
      "product photo of a titanium Contax T2 premium compact 35mm film camera, cream background, luxury editorial product shot, soft reflection",
  },
  {
    slug: "fujifilm-x100v-demo",
    name: "Fujifilm X100V (silver)",
    sku: "AH-DIG-X100V-007",
    description:
      "Máy compact cao cấp cảm biến APS-C 26MP, lens cố định 23mm f/2, có màn hình lật và film simulation đặc trưng Fujifilm.",
    price: 26_900_000,
    categorySlug: "digital-compact",
    brandName: "Fujifilm",
    productType: ProductType.COMPACT_CAMERA,
    condition: ProductCondition.LIKE_NEW,
    cameraSpecs: {
      "Cảm biến": "APS-C X-Trans CMOS 4, 26.1MP",
      Lens: "Fujinon 23mm f/2 (tương đương 35mm)",
      "Video": "4K 30fps",
      "Số lần bấm máy": "~4.200",
    },
    cosmeticCondition: "Như mới, không xước, đầy đủ hộp.",
    functionalCondition: "Hoạt động hoàn hảo, không lỗi.",
    includedAccessories: "Thân máy, pin, sạc, cap, hộp, dây đeo.",
    stockQuantity: 2,
    isFeatured: true,
    imagePrompt:
      "product photo of a silver Fujifilm X100V premium compact digital camera, cream paper background, editorial product photography, soft light",
  },
  {
    slug: "sony-a7-iii-body-demo",
    name: "Sony A7 III (body)",
    sku: "AH-DIG-A7III-008",
    description:
      "Máy mirrorless full-frame 24MP, lấy nét tự động nhanh, phù hợp chụp sự kiện và làm video. Máy đã qua sử dụng, số lần bấm còn thấp.",
    price: 27_500_000,
    compareAtPrice: 29_900_000,
    categorySlug: "digital-compact",
    brandName: "Sony",
    productType: ProductType.DIGITAL_CAMERA,
    condition: ProductCondition.GOOD,
    cameraSpecs: {
      "Cảm biến": "Full-frame 24.2MP",
      Mount: "Sony E",
      "Video": "4K 30fps",
      "Số lần bấm máy": "~18.500",
    },
    cosmeticCondition: "Vỏ máy có vết sử dụng ở góc, không móp.",
    functionalCondition: "Cảm biến sạch, không dead pixel, AF nhanh.",
    includedAccessories: "Body, pin, sạc, cap body, dây đeo.",
    stockQuantity: 1,
    imagePrompt:
      "product photo of a black Sony A7 III full frame mirrorless camera body, cream background, editorial product photography, soft shadows",
  },
  {
    slug: "canon-eos-r50-kit-demo",
    name: "Canon EOS R50 + RF-S 18-45mm (new)",
    sku: "AH-DIG-R50-009",
    description:
      "Máy mirrorless APS-C mới nguyên hộp, phù hợp người mới bắt đầu làm quen nhiếp ảnh và quay vlog.",
    price: 17_990_000,
    categorySlug: "digital-compact",
    brandName: "Canon",
    productType: ProductType.DIGITAL_CAMERA,
    condition: ProductCondition.NEW,
    cameraSpecs: {
      "Cảm biến": "APS-C 24.2MP",
      Mount: "Canon RF",
      "Video": "4K 30fps",
      "Bảo hành": "12 tháng chính hãng",
    },
    cosmeticCondition: "Mới 100%, nguyên seal.",
    functionalCondition: "Mới, chưa qua sử dụng.",
    includedAccessories: "Body, lens RF-S 18-45mm, pin, sạc, dây đeo, hộp.",
    stockQuantity: 4,
    isFeatured: true,
    imagePrompt:
      "product photo of a new Canon EOS R50 white mirrorless camera with kit zoom lens, clean cream background, bright editorial catalog lighting",
  },
  {
    slug: "nikkor-50mm-f18g-demo",
    name: "Nikon AF-S Nikkor 50mm f/1.8G",
    sku: "AH-LENS-50G-010",
    description:
      "Ống kính fix 50mm f/1.8 cho mount Nikon F, kính trong, lấy nét tự động nhanh và chính xác.",
    price: 2_300_000,
    categorySlug: "lens",
    brandName: "Nikon",
    productType: ProductType.LENS,
    condition: ProductCondition.EXCELLENT,
    cameraSpecs: {
      Mount: "Nikon F (AF-S)",
      "Tiêu cự": "50mm",
      "Khẩu độ": "f/1.8 – f/16",
      "Lấy nét": "Tự động / thủ công",
    },
    cosmeticCondition: "Vỏ lens đẹp, không mốc.",
    functionalCondition: "Kính trong, AF nhanh, không kẹt.",
    includedAccessories: "Lens, nắp trước, nắp sau, hood.",
    stockQuantity: 3,
    imagePrompt:
      "product photo of a Nikon 50mm f1.8 prime camera lens on cream background, editorial product photography, soft light",
  },
  {
    slug: "canon-fd-28mm-f28-demo",
    name: "Canon FD 28mm f/2.8",
    sku: "AH-LENS-FD28-011",
    description:
      "Lens góc rộng cho máy film Canon FD, phù hợp chụp phong cảnh và street photography.",
    price: 1_750_000,
    categorySlug: "lens",
    brandName: "Canon",
    productType: ProductType.LENS,
    condition: ProductCondition.GOOD,
    cameraSpecs: {
      Mount: "Canon FD",
      "Tiêu cự": "28mm",
      "Khẩu độ": "f/2.8 – f/22",
      "Lấy nét": "Thủ công",
    },
    cosmeticCondition: "Có vết sử dụng trên vỏ, vòng khẩu độ mượt.",
    functionalCondition: "Kính trong, không mốc, khẩu độ đóng mở đều.",
    includedAccessories: "Lens, nắp trước, nắp sau.",
    stockQuantity: 2,
    imagePrompt:
      "product photo of a vintage Canon FD 28mm f2.8 wide angle lens, cream linen background, minimal editorial styling",
  },
  {
    slug: "peak-design-cuff-strap-demo",
    name: "Dây đeo tay Peak Design Cuff",
    sku: "AH-ACC-CUFF-012",
    description:
      "Dây đeo cổ tay bằng nylon dệt chắc chắn, kèm anchor link, chịu tải tốt cho máy ảnh nhỏ và mirrorless.",
    price: 950_000,
    categorySlug: "phu-kien",
    brandName: "Peak Design",
    productType: ProductType.ACCESSORY,
    condition: ProductCondition.NEW,
    cameraSpecs: {
      "Chất liệu": "Nylon dệt, hợp kim nhôm",
      "Tải trọng": "Lên đến 90kg",
      "Kèm theo": "2 anchor link",
    },
    cosmeticCondition: "Mới nguyên bao bì.",
    functionalCondition: "Mới 100%.",
    includedAccessories: "Dây đeo, 2 anchor link, hộp.",
    stockQuantity: 8,
    imagePrompt:
      "product photo of a black Peak Design Cuff camera wrist strap coiled on cream paper background, editorial product photography",
  },
  {
    slug: "kodak-portra-400-box-5-demo",
    name: "Film Kodak Portra 400 (hộp 5 cuộn)",
    sku: "AH-ACC-PORTRA-013",
    description:
      "Film màu âm bản ISO 400, tông màu da đẹp, phù hợp chụp chân dung. Hộp 5 cuộn 35mm.",
    price: 1_250_000,
    categorySlug: "phu-kien",
    brandName: "Kodak",
    productType: ProductType.FILM_ROLL,
    condition: ProductCondition.NEW,
    cameraSpecs: {
      "Định dạng": "35mm (135)",
      "ISO": "400",
      "Số kiện": "36 kiện",
      "Hạn sử dụng": "Còn dài",
    },
    cosmeticCondition: "Hộp còn niêm phong.",
    functionalCondition: "Bảo quản ngăn mát, film mới.",
    includedAccessories: "5 cuộn film trong hộp.",
    stockQuantity: 10,
    imagePrompt:
      "product photo of a box of Kodak Portra 400 35mm film rolls on cream paper background, warm editorial product photography",
  },
  {
    slug: "leica-m6-classic-demo",
    name: "Leica M6 Classic + Summicron 35mm",
    sku: "AH-FILM-M6-014",
    description:
      "Rangefinder Leica M6 huyền thoại, kèm lens Summicron 35mm f/2. Máy đo sáng hoạt động chính xác, đã được kiểm tra kỹ bởi kỹ thuật viên.",
    price: 89_000_000,
    compareAtPrice: 95_000_000,
    categorySlug: "may-film",
    brandName: "Leica",
    productType: ProductType.FILM_CAMERA,
    condition: ProductCondition.EXCELLENT,
    cameraSpecs: {
      "Định dạng film": "35mm (135)",
      Mount: "Leica M",
      "Tốc độ màn trập": "1 – 1/1000s",
      "Đo sáng": "Có, chuẩn",
    },
    cosmeticCondition: "Đẹp, vài dấu sử dụng nhỏ ở đáy máy.",
    functionalCondition: "Rangefinder chỉnh chuẩn, màn trập chính xác.",
    includedAccessories: "Thân máy, lens Summicron 35mm f/2, nắp, dây đeo.",
    stockQuantity: 1,
    imagePrompt:
      "product photo of a black Leica M6 classic rangefinder film camera with 35mm summicron lens, cream background, luxury editorial product shot",
  },
];

async function main() {
  console.log("→ Seed dữ liệu DEMO cho Second Shot...");

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, description: category.description },
      create: category,
    });
  }

  for (const name of brands) {
    await prisma.brand.upsert({
      where: { slug: name.toLowerCase().replace(/\s+/g, "-") },
      update: { name },
      create: { name, slug: name.toLowerCase().replace(/\s+/g, "-") },
    });
  }

  const categoryMap = new Map(
    (await prisma.category.findMany()).map((item) => [item.slug, item.id]),
  );
  const brandMap = new Map((await prisma.brand.findMany()).map((item) => [item.slug, item.id]));

  for (const item of products) {
    const categoryId = categoryMap.get(item.categorySlug);
    if (!categoryId) throw new Error(`Không tìm thấy danh mục ${item.categorySlug}`);

    const brandId = item.brandName
      ? (brandMap.get(item.brandName.toLowerCase().replace(/\s+/g, "-")) ?? null)
      : null;

    const data = {
      name: item.name,
      sku: item.sku,
      description: item.description,
      price: item.price,
      compareAtPrice: item.compareAtPrice ?? null,
      categoryId,
      brandId,
      productType: item.productType,
      condition: item.condition,
      cameraSpecs: item.cameraSpecs,
      cosmeticCondition: item.cosmeticCondition,
      functionalCondition: item.functionalCondition,
      includedAccessories: item.includedAccessories,
      warrantyText: "Bảo hành 3 tháng cho máy cũ, 12 tháng cho máy mới.",
      stockQuantity: item.stockQuantity,
      isPublished: true,
      isFeatured: item.isFeatured ?? false,
    };

    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: data,
      create: { ...data, slug: item.slug },
    });

    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.createMany({
      data: [0, 1, 2].map((index) => ({
        productId: product.id,
        url: placeholderImage(
          index === 0
            ? item.imagePrompt
            : `${item.imagePrompt}, alternate angle ${index + 1}`,
        ),
        alt: `${item.name} — ảnh demo ${index + 1}`,
        sortOrder: index,
      })),
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@secondshot.vn";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@12345";
  const customerPassword = "Khachhang@123";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: "ADMIN",
      passwordHash: await bcrypt.hash(adminPassword, 10),
      name: "Quản trị viên",
    },
    create: {
      email: adminEmail,
      name: "Quản trị viên",
      phone: "0900000001",
      role: "ADMIN",
      passwordHash: await bcrypt.hash(adminPassword, 10),
    },
  });

  await prisma.user.upsert({
    where: { email: "khach@secondshot.vn" },
    update: { passwordHash: await bcrypt.hash(customerPassword, 10) },
    create: {
      email: "khach@secondshot.vn",
      name: "Khách demo",
      phone: "0900000002",
      role: "CUSTOMER",
      passwordHash: await bcrypt.hash(customerPassword, 10),
    },
  });

  await prisma.storeSetting.upsert({
    where: { key: "shipping.flatFee" },
    update: {},
    create: { key: "shipping.flatFee", value: "35000" },
  });
  await prisma.storeSetting.upsert({
    where: { key: "shipping.freeThreshold" },
    update: {},
    create: { key: "shipping.freeThreshold", value: "5000000" },
  });

  console.log(`✓ Xong. ${products.length} sản phẩm demo, ${categories.length} danh mục.`);
  console.log(`  Tài khoản admin demo: ${adminEmail} / ${adminPassword}`);
  console.log("  Tài khoản khách demo: khach@secondshot.vn / Khachhang@123");
  console.log(`  ${DEMO_NOTE}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
