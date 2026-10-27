import { describe, expect, it } from "vitest";

import { formatNumber, formatVnd, parseVndInput, slugify, truncate } from "@/lib/format";

describe("formatVnd", () => {
  it("định dạng tiền tệ VND", () => {
    const result = formatVnd(12_500_000);
    expect(result).toMatch(/12\.500\.000/);
    expect(result).toMatch(/₫/);
  });

  it("trả về gạch ngang với giá trị không hợp lệ", () => {
    expect(formatVnd(Number.NaN)).toBe("—");
    expect(formatVnd(Number.POSITIVE_INFINITY)).toBe("—");
  });
});

describe("formatNumber", () => {
  it("phân tách hàng nghìn theo kiểu Việt Nam", () => {
    expect(formatNumber(1234567)).toMatch(/1\.234\.567/);
  });
});

describe("parseVndInput", () => {
  it("chấp nhận chuỗi có dấu phân tách", () => {
    expect(parseVndInput("12.500.000")).toBe(12_500_000);
    expect(parseVndInput("12500000")).toBe(12_500_000);
    expect(parseVndInput("12 500 000 đ")).toBe(12_500_000);
  });

  it("trả về null khi không có chữ số", () => {
    expect(parseVndInput("")).toBeNull();
    expect(parseVndInput("abc")).toBeNull();
  });
});

describe("slugify", () => {
  it("bỏ dấu tiếng Việt và thay khoảng trắng bằng gạch ngang", () => {
    expect(slugify("Máy ảnh Canon AE-1")).toBe("may-anh-canon-ae-1");
    expect(slugify("Đèn Flash Đức")).toBe("den-flash-duc");
  });

  it("loại bỏ gạch ngang ở đầu và cuối", () => {
    expect(slugify("  --Hello--  ")).toBe("hello");
  });
});

describe("truncate", () => {
  it("giữ nguyên chuỗi ngắn", () => {
    expect(truncate("máy ảnh", 20)).toBe("máy ảnh");
  });

  it("cắt và thêm dấu ba chấm khi vượt giới hạn", () => {
    const result = truncate("a".repeat(50), 10);
    expect(result.endsWith("…")).toBe(true);
    expect(result.length).toBeLessThanOrEqual(10);
  });
});
