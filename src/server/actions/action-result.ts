import type { ZodError } from "zod";

export interface ActionFailure {
  ok: false;
  message: string;
  fieldErrors?: Record<string, string[]>;
}

export type ActionResult<T extends object = object> = ({ ok: true } & T) | ActionFailure;

export function zodFieldErrors(error: ZodError): Record<string, string[]> {
  const flattened = error.flatten();
  const result: Record<string, string[]> = {};
  for (const [key, messages] of Object.entries(flattened.fieldErrors)) {
    if (messages && messages.length > 0) result[key] = messages as string[];
  }
  return result;
}

export function failure(message: string, fieldErrors?: Record<string, string[]>): ActionFailure {
  return { ok: false, message, ...(fieldErrors ? { fieldErrors } : {}) };
}

/** Lấy thông báo lỗi an toàn, không lộ chi tiết nội bộ ra UI. */
export function toErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
