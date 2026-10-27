"use server";

import { revalidatePath } from "next/cache";

import { parseVndInput } from "@/lib/format";
import {
  brandFormSchema,
  categoryFormSchema,
  productFormSchema,
  shippingSettingsSchema,
  type BrandFormValues,
  type CategoryFormValues,
  type ProductFormValues,
  type ShippingSettingsValues,
} from "@/lib/validations/product";
import { assertAdmin } from "@/server/auth-guard";
import {
  failure,
  toErrorMessage,
  zodFieldErrors,
  type ActionResult,
} from "@/server/actions/action-result";
import {
  archiveProduct,
  createBrand,
  createCategory,
  createProduct,
  restoreProduct,
  updateCategory,
  updateProduct,
  updateProductStock,
} from "@/server/services/admin.service";
import { updateShippingConfig } from "@/server/services/settings.service";

function revalidateCatalog(slug?: string) {
  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  if (slug) revalidatePath(`/products/${slug}`);
}

export async function saveProductAction(input: {
  id?: string;
  values: ProductFormValues;
}): Promise<ActionResult<{ productId: string; slug: string }>> {
  await assertAdmin();

  const parsed = productFormSchema.safeParse(input.values);
  if (!parsed.success) {
    return failure("Vui lòng kiểm tra lại thông tin sản phẩm.", zodFieldErrors(parsed.error));
  }

  try {
    const product = input.id
      ? await updateProduct(input.id, parsed.data)
      : await createProduct(parsed.data);

    if (!product) return failure("Không tìm thấy sản phẩm cần cập nhật.");

    revalidateCatalog(product.slug);
    return { ok: true, productId: product.id, slug: product.slug };
  } catch (error) {
    return failure(toErrorMessage(error, "Không thể lưu sản phẩm."));
  }
}

export async function archiveProductAction(id: string): Promise<ActionResult> {
  await assertAdmin();
  try {
    const product = await archiveProduct(id);
    revalidateCatalog(product.slug);
    return { ok: true };
  } catch (error) {
    return failure(toErrorMessage(error, "Không thể ngừng bán sản phẩm."));
  }
}

export async function restoreProductAction(id: string): Promise<ActionResult> {
  await assertAdmin();
  try {
    const product = await restoreProduct(id);
    revalidateCatalog(product.slug);
    return { ok: true };
  } catch (error) {
    return failure(toErrorMessage(error, "Không thể khôi phục sản phẩm."));
  }
}

export async function updateStockAction(input: {
  id: string;
  stockQuantity: number;
}): Promise<ActionResult> {
  await assertAdmin();
  try {
    const product = await updateProductStock(input.id, input.stockQuantity);
    revalidateCatalog(product.slug);
    return { ok: true };
  } catch (error) {
    return failure(toErrorMessage(error, "Không thể cập nhật tồn kho."));
  }
}

export async function saveCategoryAction(input: {
  id?: string;
  values: CategoryFormValues;
}): Promise<ActionResult> {
  await assertAdmin();

  const parsed = categoryFormSchema.safeParse(input.values);
  if (!parsed.success) {
    return failure("Vui lòng kiểm tra lại thông tin danh mục.", zodFieldErrors(parsed.error));
  }

  try {
    if (input.id) {
      await updateCategory(input.id, parsed.data);
    } else {
      await createCategory(parsed.data);
    }
    revalidatePath("/admin/categories");
    revalidatePath("/products");
    return { ok: true };
  } catch (error) {
    return failure(toErrorMessage(error, "Không thể lưu danh mục."));
  }
}

export async function createBrandAction(values: BrandFormValues): Promise<ActionResult> {
  await assertAdmin();

  const parsed = brandFormSchema.safeParse(values);
  if (!parsed.success) {
    return failure("Vui lòng kiểm tra lại thông tin thương hiệu.", zodFieldErrors(parsed.error));
  }

  try {
    await createBrand(parsed.data);
    revalidatePath("/admin/categories");
    return { ok: true };
  } catch (error) {
    return failure(toErrorMessage(error, "Không thể thêm thương hiệu."));
  }
}

export async function updateShippingSettingsAction(
  values: ShippingSettingsValues,
): Promise<ActionResult> {
  await assertAdmin();

  const parsed = shippingSettingsSchema.safeParse(values);
  if (!parsed.success) {
    return failure("Vui lòng kiểm tra lại cấu hình vận chuyển.", zodFieldErrors(parsed.error));
  }

  try {
    const flatFee = parseVndInput(parsed.data.flatFee);
    const freeThreshold = parseVndInput(parsed.data.freeThreshold);

    if (flatFee === null || freeThreshold === null) {
      return failure("Phí vận chuyển và mức miễn phí phải là số nguyên VND hợp lệ.");
    }

    await updateShippingConfig({ flatFee, freeThreshold });
    revalidatePath("/admin/settings");
    revalidatePath("/cart");
    revalidatePath("/checkout");
    return { ok: true };
  } catch (error) {
    return failure(toErrorMessage(error, "Không thể lưu cấu hình vận chuyển."));
  }
}
