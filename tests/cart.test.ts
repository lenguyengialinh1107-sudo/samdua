import { describe, expect, it } from "vitest";

import {
  calculateGrandTotal,
  calculateShippingFee,
  calculateSubtotal,
  clampQuantity,
  countItems,
  summarizeCart,
  type ShippingConfig,
} from "@/lib/cart";

const config: ShippingConfig = {
  flatFee: 35_000,
  freeThreshold: 5_000_000,
  note: "",
};

describe("calculateSubtotal", () => {
  it("nhân đơn giá với số lượng rồi cộng lại", () => {
    expect(
      calculateSubtotal([
        { unitPrice: 1_000_000, quantity: 2 },
        { unitPrice: 500_000, quantity: 1 },
      ]),
    ).toBe(2_500_000);
  });

  it("trả về 0 với giỏ hàng rỗng", () => {
    expect(calculateSubtotal([])).toBe(0);
  });

  it("bỏ qua giá trị không hợp lệ thay vì trả về NaN", () => {
    expect(calculateSubtotal([{ unitPrice: Number.NaN, quantity: 3 }])).toBe(0);
  });
});

describe("countItems", () => {
  it("cộng tổng số lượng sản phẩm", () => {
    expect(countItems([{ unitPrice: 0, quantity: 2 }, { unitPrice: 0, quantity: 3 }])).toBe(5);
  });
});

describe("calculateShippingFee", () => {
  it("miễn phí khi đơn đạt mức miễn phí", () => {
    expect(calculateShippingFee(5_000_000, config)).toBe(0);
  });

  it("áp phí cố định khi đơn dưới mức miễn phí", () => {
    expect(calculateShippingFee(1_000_000, config)).toBe(35_000);
  });

  it("không tính phí cho đơn rỗng", () => {
    expect(calculateShippingFee(0, config)).toBe(0);
  });
});

describe("calculateGrandTotal", () => {
  it("cộng phí vận chuyển và trừ giảm giá", () => {
    expect(calculateGrandTotal({ subtotal: 1_000_000, shippingFee: 35_000, discountTotal: 100_000 })).toBe(
      935_000,
    );
  });

  it("không trả về số âm", () => {
    expect(calculateGrandTotal({ subtotal: 100_000, shippingFee: 0, discountTotal: 500_000 })).toBe(0);
  });
});

describe("summarizeCart", () => {
  it("tính đủ các khoản và số tiền còn thiếu để được miễn phí vận chuyển", () => {
    const summary = summarizeCart([{ unitPrice: 2_000_000, quantity: 1 }], config);

    expect(summary.subtotal).toBe(2_000_000);
    expect(summary.shippingFee).toBe(35_000);
    expect(summary.grandTotal).toBe(2_035_000);
    expect(summary.itemCount).toBe(1);
    expect(summary.freeShippingRemaining).toBe(3_000_000);
  });

  it("freeShippingRemaining bằng 0 khi đã đạt ngưỡng", () => {
    const summary = summarizeCart([{ unitPrice: 6_000_000, quantity: 1 }], config);
    expect(summary.freeShippingRemaining).toBe(0);
  });
});

describe("clampQuantity", () => {
  it("kẹp số lượng trong khoảng 1..tồn kho", () => {
    expect(clampQuantity(0, 5)).toBe(1);
    expect(clampQuantity(10, 5)).toBe(5);
    expect(clampQuantity(3, 5)).toBe(3);
  });

  it("trả về 0 khi hết hàng", () => {
    expect(clampQuantity(2, 0)).toBe(0);
  });
});
