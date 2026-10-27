import { z } from "zod";

export const PRODUCT_TYPES = [
  "FILM_CAMERA",
  "DIGITAL_CAMERA",
  "COMPACT_CAMERA",
  "LENS",
  "ACCESSORY",
  "FILM_ROLL",
] as const;

export const PRODUCT_CONDITIONS = ["NEW", "LIKE_NEW", "EXCELLENT", "GOOD", "FAIR"] as const;

export type ProductTypeValue = (typeof PRODUCT_TYPES)[number];
export type ProductConditionValue = (typeof PRODUCT_CONDITIONS)[number];

/**
 * Schema dùng chung cho form admin (client validate) và server (validate lại).
 *
 * Các trường số được giữ ở dạng chuỗi để kiểu input/output của Zod trùng nhau,
 * nhờ đó react-hook-form + zodResolver không bị lệch type. Việc chuyển sang số
 * nguyên VND diễn ra ở tầng service (`parseVndInput`).
 */
const integerString = (label: string, max = 12) =>
  z
    .string()
    .trim()
    .regex(new RegExp(`^\\d{1,${max}}$`), `${label} phải là số nguyên không âm`);

const text = (max: number) => z.string().trim().max(max, `Nội dung tối đa ${max} ký tự`);

export const productFormSchema = z.object({
  name: z.string().trim().min(3, "Tên sản phẩm tối thiểu 3 ký tự").max(160),
  slug: z
    .string()
    .trim()
    .min(3, "Slug tối thiểu 3 ký tự")
    .max(90)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chỉ gồm chữ thường, số và dấu gạch ngang"),
  sku: z
    .string()
    .trim()
    .min(3, "SKU tối thiểu 3 ký tự")
    .max(40)
    .regex(/^[A-Z0-9-]+$/, "SKU chỉ gồm chữ in hoa, số và dấu gạch ngang"),
  description: z.string().trim().min(20, "Mô tả tối thiểu 20 ký tự").max(5000),
  price: integerString("Giá"),
  compareAtPrice: z
    .string()
    .trim()
    .refine((value) => value === "" || /^\d{1,12}$/.test(value), "Giá so sánh không hợp lệ"),
  categoryId: z.string().min(1, "Vui lòng chọn danh mục"),
  brandId: z.string().trim(),
  productType: z.enum(PRODUCT_TYPES),
  condition: z.enum(PRODUCT_CONDITIONS),
  cameraSpecs: text(4000),
  cosmeticCondition: text(1000),
  functionalCondition: text(1000),
  includedAccessories: text(1000),
  warrantyText: text(1000),
  stockQuantity: integerString("Tồn kho", 4),
  isPublished: z.boolean(),
  isFeatured: z.boolean(),
  /** Mỗi dòng một URL ảnh. */
  imageUrls: text(4000),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export const categoryFormSchema = z.object({
  name: z.string().trim().min(2, "Tên danh mục tối thiểu 2 ký tự").max(80),
  slug: z
    .string()
    .trim()
    .min(2, "Slug tối thiểu 2 ký tự")
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug không hợp lệ"),
  description: text(500),
  sortOrder: integerString("Thứ tự", 4),
  isActive: z.boolean(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const brandFormSchema = z.object({
  name: z.string().trim().min(1, "Tên thương hiệu là bắt buộc").max(80),
  slug: z
    .string()
    .trim()
    .min(1, "Slug là bắt buộc")
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug không hợp lệ"),
});

export type BrandFormValues = z.infer<typeof brandFormSchema>;

export const shippingSettingsSchema = z.object({
  flatFee: integerString("Phí vận chuyển"),
  freeThreshold: integerString("Mức miễn phí vận chuyển"),
});

export type ShippingSettingsValues = z.infer<typeof shippingSettingsSchema>;
