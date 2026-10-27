import { z } from "zod";

const phoneRegex = /^(0|\+84)\d{9}$/;

export const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "Vui lòng nhập tên người nhận").max(80),
  customerPhone: z
    .string()
    .trim()
    .regex(phoneRegex, "Số điện thoại không hợp lệ (ví dụ: 0901234567)"),
  customerEmail: z
    .string()
    .trim()
    .toLowerCase()
    .email("Email không hợp lệ")
    .optional()
    .or(z.literal("")),
  shippingAddress: z
    .string()
    .trim()
    .min(10, "Vui lòng nhập địa chỉ đầy đủ (số nhà, đường, quận/huyện, tỉnh/thành)")
    .max(300),
  note: z.string().trim().max(300, "Ghi chú tối đa 300 ký tự").optional().or(z.literal("")),
  paymentMethod: z.enum(["COD", "BANK_TRANSFER"], {
    errorMap: () => ({ message: "Vui lòng chọn phương thức thanh toán" }),
  }),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

/** Dữ liệu giỏ hàng gửi lên server: chỉ gồm id và số lượng. */
export const cartSubmissionSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(99),
      }),
    )
    .min(1, "Giỏ hàng đang trống"),
});

export type CartSubmission = z.infer<typeof cartSubmissionSchema>;
