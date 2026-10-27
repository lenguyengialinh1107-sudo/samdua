import { describe, expect, it } from "vitest";

import { formatSpecsText, parseImageUrlsText, parseSpecsText } from "@/lib/product-specs";

describe("parseSpecsText", () => {
  it("tách mỗi dòng thành một cặp khoá — giá trị", () => {
    expect(parseSpecsText("Mount: M42\nShutter: 1/1000")).toEqual({
      Mount: "M42",
      Shutter: "1/1000",
    });
  });

  it("giữ giá trị chứa dấu hai chấm", () => {
    expect(parseSpecsText("ISO: 100 - 1600: mở rộng")).toEqual({
      ISO: "100 - 1600: mở rộng",
    });
  });

  it("dòng không có dấu hai chấm được gán giá trị rỗng", () => {
    expect(parseSpecsText("Ghi chú")).toEqual({ "Ghi chú": "" });
  });

  it("bỏ qua dòng trống và trả về object rỗng với đầu vào rỗng", () => {
    expect(parseSpecsText("\n\n   \n")).toEqual({});
    expect(parseSpecsText(null)).toEqual({});
    expect(parseSpecsText(undefined)).toEqual({});
  });
});

describe("formatSpecsText", () => {
  it("chuyển object thông số về dạng nhập liệu nhiều dòng", () => {
    expect(formatSpecsText({ Mount: "M42", Shutter: "1/1000" })).toBe("Mount: M42\nShutter: 1/1000");
  });

  it("trả về chuỗi rỗng với dữ liệu không phải object", () => {
    expect(formatSpecsText(null)).toBe("");
    expect(formatSpecsText([])).toBe("");
    expect(formatSpecsText("abc")).toBe("");
  });
});

describe("parseImageUrlsText", () => {
  it("tách mỗi dòng thành một URL và bỏ dòng trống", () => {
    expect(parseImageUrlsText("https://a.com/1.jpg\n\n  https://a.com/2.jpg  ")).toEqual([
      "https://a.com/1.jpg",
      "https://a.com/2.jpg",
    ]);
  });

  it("giới hạn tối đa 12 ảnh", () => {
    const text = Array.from({ length: 20 }, (_, index) => `https://a.com/${index}.jpg`).join("\n");
    expect(parseImageUrlsText(text)).toHaveLength(12);
  });

  it("trả về mảng rỗng với đầu vào rỗng", () => {
    expect(parseImageUrlsText(null)).toEqual([]);
    expect(parseImageUrlsText("")).toEqual([]);
  });
});
