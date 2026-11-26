import type { DetailedHTMLProps, HTMLAttributes } from "react";

/**
 * Thuộc tính của thẻ <model-viewer> (Google model-viewer).
 * Khai báo để JSX/TSX nhận diện thẻ tùy biến này.
 */
type ModelViewerAttributes = HTMLAttributes<HTMLElement> & {
  src?: string;
  alt?: string;
  poster?: string;
  /** Tỷ lệ mô hình (số hoặc chuỗi 3 giá trị), dùng để chỉnh kích thước thực tế khi đặt vào AR. */
  scale?: string;
  ar?: boolean;
  "ar-modes"?: string;
  "ar-scale"?: "auto" | "fixed";
  "ar-placement"?: "floor" | "wall";
  "camera-controls"?: boolean;
  "auto-rotate"?: boolean;
  "auto-rotate-delay"?: number;
  "rotation-per-second"?: string;
  "shadow-intensity"?: number | string;
  "shadow-softness"?: number | string;
  "camera-orbit"?: string;
  "field-of-view"?: string;
  "environment-image"?: string;
  exposure?: number | string;
  "interaction-prompt"?: "auto" | "none";
  "touch-action"?: "pan-y" | "pan-x" | "none";
  loading?: "auto" | "lazy" | "eager";
  reveal?: "auto" | "manual";
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": DetailedHTMLProps<ModelViewerAttributes, HTMLElement>;
    }
  }
}
