import { parseVndInput } from "@/lib/format";
import { DEFAULT_SHIPPING_CONFIG, type ShippingConfig } from "@/lib/cart";
import { getSettingsMap, upsertSetting } from "@/server/repositories/settings.repository";

const KEY_FLAT_FEE = "shipping.flatFee";
const KEY_FREE_THRESHOLD = "shipping.freeThreshold";

/**
 * Phí vận chuyển là mức cấu hình thủ công (chưa tích hợp API hãng vận chuyển).
 * Admin có thể sửa trong /admin/settings.
 */
export async function getShippingConfig(): Promise<ShippingConfig> {
  const settings = await getSettingsMap();

  const flatFee = parseVndInput(settings[KEY_FLAT_FEE] ?? "") ?? DEFAULT_SHIPPING_CONFIG.flatFee;
  const freeThreshold =
    parseVndInput(settings[KEY_FREE_THRESHOLD] ?? "") ?? DEFAULT_SHIPPING_CONFIG.freeThreshold;

  return {
    flatFee,
    freeThreshold,
    note: DEFAULT_SHIPPING_CONFIG.note,
  };
}

export async function updateShippingConfig(input: {
  flatFee: number;
  freeThreshold: number;
}): Promise<void> {
  await upsertSetting(KEY_FLAT_FEE, String(input.flatFee));
  await upsertSetting(KEY_FREE_THRESHOLD, String(input.freeThreshold));
}
