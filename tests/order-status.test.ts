import { describe, expect, it } from "vitest";

import {
  canTransitionOrderStatus,
  isOrderLocked,
  isOrderStatus,
  ORDER_STATUSES,
  nextOrderStatuses,
  ORDER_STATUS_TRANSITIONS,
} from "@/lib/order-status";

describe("isOrderStatus", () => {
  it("nhận diện trạng thái hợp lệ", () => {
    expect(isOrderStatus("PENDING")).toBe(true);
    expect(isOrderStatus("CANCELLED")).toBe(true);
  });

  it("từ chối giá trị không hợp lệ", () => {
    expect(isOrderStatus("UNKNOWN")).toBe(false);
    expect(isOrderStatus(123)).toBe(false);
    expect(isOrderStatus(null)).toBe(false);
  });
});

describe("canTransitionOrderStatus", () => {
  it("cho phép chuyển theo đúng luồng", () => {
    expect(canTransitionOrderStatus("PENDING", "CONFIRMED")).toBe(true);
    expect(canTransitionOrderStatus("CONFIRMED", "SHIPPING")).toBe(true);
    expect(canTransitionOrderStatus("SHIPPING", "COMPLETED")).toBe(true);
  });

  it("cho phép huỷ ở các bước chưa hoàn tất", () => {
    expect(canTransitionOrderStatus("PENDING", "CANCELLED")).toBe(true);
    expect(canTransitionOrderStatus("SHIPPING", "CANCELLED")).toBe(true);
  });

  it("chặn nhảy cóc trạng thái", () => {
    expect(canTransitionOrderStatus("PENDING", "COMPLETED")).toBe(false);
    expect(canTransitionOrderStatus("PENDING", "SHIPPING")).toBe(false);
  });

  it("không cho chuyển tiếp từ trạng thái kết thúc", () => {
    expect(canTransitionOrderStatus("COMPLETED", "SHIPPING")).toBe(false);
    expect(canTransitionOrderStatus("CANCELLED", "PENDING")).toBe(false);
  });
});

describe("nextOrderStatuses", () => {
  it("trả về danh sách kế tiếp của PENDING", () => {
    expect(nextOrderStatuses("PENDING")).toEqual(["CONFIRMED", "CANCELLED"]);
  });

  it("trả về rỗng cho trạng thái kết thúc", () => {
    expect(nextOrderStatuses("COMPLETED")).toEqual([]);
    expect(nextOrderStatuses("CANCELLED")).toEqual([]);
  });
});

describe("isOrderLocked", () => {
  it("khoá khi đơn đã hoàn tất hoặc đã huỷ", () => {
    expect(isOrderLocked("COMPLETED")).toBe(true);
    expect(isOrderLocked("CANCELLED")).toBe(true);
  });

  it("không khoá với đơn đang xử lý", () => {
    expect(isOrderLocked("PENDING")).toBe(false);
    expect(isOrderLocked("SHIPPING")).toBe(false);
  });
});

describe("ORDER_STATUSES", () => {
  it("mọi trạng thái đều có khai báo chuyển tiếp (không undefined)", () => {
    for (const status of ORDER_STATUSES) {
      expect(ORDER_STATUS_TRANSITIONS[status]).toBeDefined();
    }
  });
});
